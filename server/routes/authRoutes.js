import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  firebaseLogin,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Email / Password Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

// Firebase Unified Auth Route
router.post('/firebase', firebaseLogin);

// RBAC Admin Verification Test Route
router.get('/admin/verify', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin authorization granted',
    user: req.user,
  });
});

export default router;