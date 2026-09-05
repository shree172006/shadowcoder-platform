import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  getLeaderboard,
  firebaseLogin,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Email / Password Auth Routes (with Brute-Force Rate Limiting)
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);

// Firebase Unified Auth Route (with Brute-Force Rate Limiting)
router.post('/firebase', authLimiter, firebaseLogin);

// RBAC Admin Verification Test Route
router.get('/admin/verify', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin authorization granted',
    user: req.user,
  });
});

export default router;