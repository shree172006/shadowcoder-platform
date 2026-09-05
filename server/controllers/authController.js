import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendTokenCookies,
  clearTokenCookies,
} from '../utils/tokenService.js';
import { getLevelProgress } from '../services/levelEngine.js';
import { verifyFirebaseToken } from '../services/firebaseAdminService.js';

/**
 * Format user response object (DTO)
 */
const formatUserDto = (user) => {
  const levelProgress = getLevelProgress(user.xp);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    track: user.track,
    avatar: user.avatar,
    xp: user.xp,
    level: user.level,
    unlockedTiers: user.unlockedTiers,
    badges: user.badges,
    streak: user.streak,
    stats: user.stats,
    levelProgress,
    createdAt: user.createdAt,
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, track } = req.body;

  if (!name || !email || !password) {
    throw ApiError.badRequest('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw ApiError.conflict('An account with this email already exists');
  }

  let assignedRole = 'student';
  if (role === 'admin' && req.body.adminSecret === process.env.ADMIN_SECRET) {
    assignedRole = 'admin';
  }

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    track: track || 'fullstack',
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  sendTokenCookies(res, accessToken, refreshToken);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: formatUserDto(user),
  });
});

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  sendTokenCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user: formatUserDto(user),
  });
});

// @desc    Log out current session
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken && req.user) {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (tokenDoc) => tokenDoc.token !== refreshToken
    );
    await req.user.save();
  }

  clearTokenCookies(res);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (err) {
    clearTokenCookies(res);
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    clearTokenCookies(res);
    throw ApiError.unauthorized('User associated with this token no longer exists');
  }

  const tokenExists = user.refreshTokens.some(
    (tokenDoc) => tokenDoc.token === incomingRefreshToken
  );

  if (!tokenExists) {
    user.refreshTokens = [];
    await user.save();
    clearTokenCookies(res);
    throw ApiError.unauthorized('Security Breach: Token reuse detected. All sessions terminated.');
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokens = user.refreshTokens.filter(
    (tokenDoc) => tokenDoc.token !== incomingRefreshToken
  );
  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  sendTokenCookies(res, newAccessToken, newRefreshToken);

  return res.status(200).json({
    success: true,
    message: 'Access token rotated successfully',
  });
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: formatUserDto(req.user),
  });
});

// @desc    Get real leaderboard users sorted by XP
// @route   GET /api/auth/leaderboard
// @access  Public
export const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ xp: -1 })
    .limit(50)
    .select('name email track xp level badges createdAt');

  const formatted = users.map((u, idx) => ({
    id: u._id,
    name: u.name || 'Developer',
    username: (u.name || 'developer').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    role: u.track ? (u.track.charAt(0).toUpperCase() + u.track.slice(1)) + ' Engineer' : 'Full Stack Engineer',
    pts: u.xp || 0,
    lvl: u.level || 1,
    initial: (u.name || 'D').charAt(0).toUpperCase(),
    rank: idx + 1,
    tier: (u.level || 1) >= 8 || (u.xp || 0) >= 3500 ? 'Apex Shadow (Tier S)' : (u.level || 1) >= 5 || (u.xp || 0) >= 1500 ? 'Senior Staff (Tier A)' : (u.level || 1) >= 2 || (u.xp || 0) >= 500 ? 'Specialist (Tier B)' : 'Apprentice (Tier C)',
    badges: u.badges && u.badges.length > 0 ? u.badges : ['Verified Developer'],
  }));

  return res.status(200).json({
    success: true,
    leaderboard: formatted,
  });
});

// @desc    Authenticate/Register user via Firebase Auth (Google or Email/Password)
// @route   POST /api/auth/firebase
// @access  Public
export const firebaseLogin = asyncHandler(async (req, res) => {
  const { idToken, name: bodyName, role: bodyRole, track: bodyTrack } = req.body;

  if (!idToken) {
    throw ApiError.badRequest('Firebase ID token is required');
  }

  const firebaseUser = await verifyFirebaseToken(idToken);

  const email = firebaseUser.email;
  const name = firebaseUser.name || bodyName || 'Developer';
  const avatar = firebaseUser.picture || '';

  if (!email) {
    throw ApiError.badRequest('Firebase authentication is missing an email address');
  }

  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    user = await User.create({
      name,
      email,
      password: randomPassword,
      role: bodyRole || 'student',
      avatar,
      track: bodyTrack || 'fullstack',
    });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  sendTokenCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully via Firebase Auth',
    user: formatUserDto(user),
  });
});