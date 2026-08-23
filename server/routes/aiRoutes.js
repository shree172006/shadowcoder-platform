import express from 'express';
import { generateAiCodeReview } from '../services/aiReviewerService.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * @desc    Generate AI Senior Staff Code Review for a simulation or problem
 * @route   POST /api/ai/review
 * @access  Public / Protected
 */
router.post(
  '/review',
  asyncHandler(async (req, res) => {
    const { files, scenarioTitle, scenarioRole, difficulty, testResults } = req.body;

    const result = await generateAiCodeReview({
      files: files || {},
      scenarioTitle: scenarioTitle || 'Code Review',
      scenarioRole: scenarioRole || 'Software Engineer',
      difficulty: difficulty || 'Mid-Level',
      testResults,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  })
);

export default router;
