import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadScenarioCodebase,
  getScenarios,
  getScenarioDetails,
  startScenarioSession,
  getVfsTree,
  readVfsFile,
  updateVfsFile,
  submitTicketEvaluation,
  analyzeSessionCode,
} from '../controllers/simulationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Disk Storage for Streaming Archive Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempUploadDir = path.resolve(process.cwd(), 'uploads', 'temp');
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `codebase_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max ZIP size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip archive files are permitted for codebase upload'));
    }
  },
});

// Admin Scenario Upload Route
router.post(
  '/scenarios/upload',
  protect,
  authorize('admin'),
  upload.single('codebaseZip'),
  uploadScenarioCodebase
);

// Scenario Browsing Routes
router.get('/scenarios', protect, getScenarios);
router.get('/scenarios/:idOrSlug', protect, getScenarioDetails);

// Simulation Session & VFS Operations
router.post('/sessions/start/:scenarioId', protect, startScenarioSession);
router.get('/sessions/:sessionId/vfs', protect, getVfsTree);
router.get('/sessions/:sessionId/vfs/file', protect, readVfsFile);
router.put('/sessions/:sessionId/vfs/file', protect, updateVfsFile);
router.post('/sessions/:sessionId/evaluate', protect, submitTicketEvaluation);
router.post('/sessions/:sessionId/analyze', protect, analyzeSessionCode);

export default router;
