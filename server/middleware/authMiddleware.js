import ApiError from '../utils/ApiError.js';
import asyncHandler from './asyncHandler.js';
import { verifyAccessToken } from '../utils/tokenService.js';
import User from '../models/User.js';

/**
 * Protect Middleware: Authenticates JWT token from HttpOnly cookie or Authorization header.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read token from HttpOnly cookie (preferred)
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Fallback: Read token from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please login.');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Access token expired. Please refresh your session.');
    }
    throw ApiError.unauthorized('Invalid security token.');
  }
});

/**
 * Authorize Middleware: Restricts route access based on RBAC roles (e.g., 'admin', 'student').
 *
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('User state missing');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `User role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};
