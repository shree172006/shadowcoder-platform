import express from 'express';
import Roadmap from '../models/Roadmap.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// GET all roadmaps
router.get('/', asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json({ success: true, roadmaps });
}));

// GET specific roadmap graph by slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ slug: req.params.slug });
  if (!roadmap) {
    return res.status(404).json({ success: false, message: 'Roadmap not found' });
  }
  res.json({ success: true, roadmap });
}));

// POST create new roadmap (Admin)
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { title, slug, type, iconName, nodes, edges } = req.body;

  let existing = await Roadmap.findOne({ slug });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Roadmap slug already exists' });
  }

  const roadmap = await Roadmap.create({
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    type: type || 'skill',
    iconName: iconName || 'BookOpen',
    nodes: nodes || [],
    edges: edges || [],
  });

  res.status(201).json({ success: true, roadmap });
}));

// PUT update roadmap nodes, edges, and content (Admin)
router.put('/:slug', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { title, nodes, edges, isPublished } = req.body;
  let roadmap = await Roadmap.findOne({ slug: req.params.slug });

  if (!roadmap) {
    // Create if not exists
    roadmap = new Roadmap({
      slug: req.params.slug,
      title: title || req.params.slug,
    });
  }

  if (title) roadmap.title = title;
  if (nodes) roadmap.nodes = nodes;
  if (edges) roadmap.edges = edges;
  if (typeof isPublished === 'boolean') roadmap.isPublished = isPublished;

  await roadmap.save();
  res.json({ success: true, roadmap });
}));

// DELETE roadmap (Admin)
router.delete('/:slug', protect, authorize('admin'), asyncHandler(async (req, res) => {
  await Roadmap.findOneAndDelete({ slug: req.params.slug });
  res.json({ success: true, message: 'Roadmap deleted' });
}));

export default router;
