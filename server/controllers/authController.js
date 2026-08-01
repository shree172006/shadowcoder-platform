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

  // Restrict admin role creation from public signup unless explicit secret is provided
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

  // Store refresh token in user document for revocation tracking
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

  // Maintain up to 5 active refresh tokens per user
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

// @desc    Logout user & clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken && req.user) {
    // Remove refresh token from database
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { token: refreshToken } },
    });
  }

  clearTokenCookies(res);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (via Refresh Cookie)
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw ApiError.unauthorized('Refresh token missing');
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Check if refresh token is registered in user document
    const hasToken = user.refreshTokens.some((rt) => rt.token === token);
    if (!hasToken) {
      clearTokenCookies(res);
      throw ApiError.unauthorized('Invalid or revoked refresh token');
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed',
    });
  } catch (error) {
    clearTokenCookies(res);
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }
});

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return res.status(200).json({
    success: true,
    user: formatUserDto(user),
  });
});

// @desc    OAuth Callback Handler
// @route   GET /api/auth/:provider/callback
// @access  Public
export const handleOAuthSuccess = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }

  const user = req.user;
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  sendTokenCookies(res, accessToken, refreshToken);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return res.redirect(`${clientUrl}/dashboard`);
});