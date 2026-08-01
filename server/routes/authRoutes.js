import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  handleOAuthSuccess,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Email / Password Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

// RBAC Admin Verification Test Route
router.get('/admin/verify', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin authorization granted',
    user: req.user,
  });
});

// OAuth 2.0 - Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  handleOAuthSuccess
);

// OAuth 2.0 - GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  handleOAuthSuccess
);

// OAuth 2.0 - LinkedIn
router.get(
  '/linkedin',
  passport.authenticate('linkedin', { session: false })
);
router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  handleOAuthSuccess
);

export default router;