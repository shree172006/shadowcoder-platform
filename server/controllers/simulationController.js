import path from 'path';
import fs from 'fs';
import Scenario from '../models/Scenario.js';
import UserProgress from '../models/UserProgress.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { extractZipStream, buildVfsTree, readVfsFileStream, writeVfsFile } from '../services/vfsService.js';
import { runSandboxedEvaluation } from '../services/dockerRunner.js';
import { broadcastToScenario } from '../socket/socketManager.js';
import { awardXpAndProgress } from '../services/levelEngine.js';
import { requestMlCodeAnalysis } from '../services/mlGateway.js';

const SCENARIO_UPLOADS_BASE = path.resolve(process.cwd(), 'uploads', 'scenarios');

// @desc    Upload new simulation codebase ZIP & create scenario (Admin)
// @route   POST /api/simulations/scenarios/upload
// @access  Private/Admin
export const uploadScenarioCodebase = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload a ZIP codebase file');
  }

  const {
    title,
    slug,
    description,
    companyName,
    difficulty,
    targetRole,
    requiredTier,
    xpReward,
    ticketsJson,
    npcPersonasJson,
  } = req.body;

  if (!title || !slug || !description || !companyName) {
    throw ApiError.badRequest('Missing required scenario fields (title, slug, description, companyName)');
  }

  const existingSlug = await Scenario.findOne({ slug });
  if (existingSlug) {
    throw ApiError.conflict(`Scenario with slug '${slug}' already exists`);
  }

  const folderName = `scenario_${Date.now()}_${slug}`;
  const extractedPath = await extractZipStream(req.file.path, folderName);

  let tickets = [];
  let npcPersonas = [];

  try {
    if (ticketsJson) tickets = JSON.parse(ticketsJson);
    if (npcPersonasJson) npcPersonas = JSON.parse(npcPersonasJson);
  } catch (err) {
    throw ApiError.badRequest('Invalid JSON format for tickets or npcPersonas');
  }

  const scenario = await Scenario.create({
    title,
    slug,
    description,
    companyName,
    difficulty: difficulty || 'Junior',
    targetRole: targetRole || 'fullstack',
    requiredTier: requiredTier ? parseInt(requiredTier, 10) : 1,
    xpReward: xpReward ? parseInt(xpReward, 10) : 300,
    starterCodebasePath: extractedPath,
    tickets,
    npcPersonas,
    isPublished: true,
    authorId: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: 'Scenario uploaded and created successfully',
    scenario,
  });
});

// @desc    Get all published scenarios
// @route   GET /api/simulations/scenarios
// @access  Private
export const getScenarios = asyncHandler(async (req, res) => {
  const { difficulty, targetRole } = req.query;
  const filter = { isPublished: true };

  if (difficulty) filter.difficulty = difficulty;
  if (targetRole) filter.targetRole = targetRole;

  const scenarios = await Scenario.find(filter)
    .select('-starterCodebasePath')
    .sort({ requiredTier: 1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: scenarios.length,
    scenarios,
  });
});

// @desc    Get scenario details by ID or Slug
// @route   GET /api/simulations/scenarios/:idOrSlug
// @access  Private
export const getScenarioDetails = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const scenario = isObjectId
    ? await Scenario.findById(idOrSlug)
    : await Scenario.findOne({ slug: idOrSlug });

  if (!scenario) {
    throw ApiError.notFound('Scenario not found');
  }

  return res.status(200).json({
    success: true,
    scenario,
  });
});

// @desc    Start or resume a scenario simulation session
// @route   POST /api/simulations/sessions/start/:scenarioId
// @access  Private
export const startScenarioSession = asyncHandler(async (req, res) => {
  const { scenarioId } = req.params;

  const scenario = await Scenario.findById(scenarioId);
  if (!scenario) {
    throw ApiError.notFound('Scenario not found');
  }

  // Check if user level satisfies required tier
  if (req.user.role !== 'admin' && !req.user.unlockedTiers.includes(scenario.requiredTier)) {
    throw ApiError.forbidden(`This scenario requires Unlocked Tier ${scenario.requiredTier}`);
  }

  let progress = await UserProgress.findOne({
    userId: req.user._id,
    scenarioId: scenario._id,
  });

  if (!progress) {
    const firstTicket = scenario.tickets && scenario.tickets.length > 0 ? scenario.tickets[0].ticketId : '';
    progress = await UserProgress.create({
      userId: req.user._id,
      scenarioId: scenario._id,
      status: 'in_progress',
      currentTicketId: firstTicket,
      completedTickets: [],
    });
  }

  return res.status(200).json({
    success: true,
    progress,
    scenario,
  });
});

// @desc    Get VFS tree for active simulation session
// @route   GET /api/simulations/sessions/:sessionId/vfs
// @access  Private
export const getVfsTree = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const progress = await UserProgress.findById(sessionId).populate('scenarioId');
  if (!progress) {
    throw ApiError.notFound('Simulation session not found');
  }

  const scenarioPath = progress.scenarioId.starterCodebasePath;
  const tree = buildVfsTree(scenarioPath);

  return res.status(200).json({
    success: true,
    vfsTree: tree,
    currentTicketId: progress.currentTicketId,
    completedTickets: progress.completedTickets,
  });
});

// @desc    Read content of a file in VFS
// @route   GET /api/simulations/sessions/:sessionId/vfs/file
// @access  Private
export const readVfsFile = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { filePath } = req.query;

  if (!filePath) {
    throw ApiError.badRequest('filePath query parameter is required');
  }

  const progress = await UserProgress.findById(sessionId).populate('scenarioId');
  if (!progress) {
    throw ApiError.notFound('Simulation session not found');
  }

  // 1. Check if modified file content exists in progress VFS state
  if (progress.vfsState && progress.vfsState.has(filePath)) {
    return res.status(200).json({
      success: true,
      filePath,
      content: progress.vfsState.get(filePath),
      isModified: true,
    });
  }

  // 2. Read from starter codebase file stream
  const baseDir = progress.scenarioId.starterCodebasePath;
  const content = await readVfsFileStream(baseDir, filePath);

  return res.status(200).json({
    success: true,
    filePath,
    content,
    isModified: false,
  });
});

// @desc    Update a file content in active VFS session
// @route   PUT /api/simulations/sessions/:sessionId/vfs/file
// @access  Private
export const updateVfsFile = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { filePath, content } = req.body;

  if (!filePath || content === undefined) {
    throw ApiError.badRequest('filePath and content are required');
  }

  const progress = await UserProgress.findById(sessionId);
  if (!progress) {
    throw ApiError.notFound('Simulation session not found');
  }

  // Store modified file delta in Mongoose Map
  progress.vfsState.set(filePath, content);
  await progress.save();

  return res.status(200).json({
    success: true,
    message: 'VFS file updated successfully',
    filePath,
  });
});

// @desc    Submit ticket for Docker sandboxed evaluation & update scenario state machine
// @route   POST /api/simulations/sessions/:sessionId/evaluate
// @access  Private
export const submitTicketEvaluation = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { ticketId } = req.body;

  const progress = await UserProgress.findById(sessionId).populate('scenarioId');
  if (!progress) {
    throw ApiError.notFound('Simulation session not found');
  }

  const scenario = progress.scenarioId;
  const targetTicket = scenario.tickets.find((t) => t.ticketId === ticketId);

  if (!targetTicket) {
    throw ApiError.notFound(`Ticket '${ticketId}' not found in scenario`);
  }

  // Broadcast live evaluation started event to WebSocket room
  broadcastToScenario(sessionId, 'EVALUATION_STARTED', {
    ticketId,
    timestamp: new Date(),
  });

  // Prepare temp workspace for evaluation
  const baseWorkspacePath = scenario.starterCodebasePath;

  // Apply user modified files onto workspace path if needed
  if (progress.vfsState && progress.vfsState.size > 0) {
    for (const [relPath, fileContent] of progress.vfsState.entries()) {
      await writeVfsFile(baseWorkspacePath, relPath, fileContent);
    }
  }

  // Log streaming callback over WebSocket
  const onLogStream = (logChunk) => {
    broadcastToScenario(sessionId, 'EVALUATION_LOG', {
      ticketId,
      log: logChunk,
    });
  };

  const evalCmd = scenario.environmentConfig?.testCmd || 'npm test';

  // Run isolated Docker / Sandboxed evaluation
  const evalResult = await runSandboxedEvaluation(baseWorkspacePath, evalCmd, {
    timeoutMs: scenario.environmentConfig?.timeoutMs || 30000,
    onLog: onLogStream,
  });

  let earnedXp = 0;
  let leveledUp = false;

  if (evalResult.success) {
    // Ticket completed! Update state machine
    if (!progress.completedTickets.includes(ticketId)) {
      progress.completedTickets.push(ticketId);
    }

    earnedXp = targetTicket.xpPoints || 50;

    // Advance current ticket ID
    const currentTicketIndex = scenario.tickets.findIndex((t) => t.ticketId === ticketId);
    if (currentTicketIndex >= 0 && currentTicketIndex + 1 < scenario.tickets.length) {
      progress.currentTicketId = scenario.tickets[currentTicketIndex + 1].ticketId;
    } else {
      progress.status = 'completed';
      progress.completedAt = new Date();
      earnedXp += scenario.xpReward || 300;
    }

    // Award XP and check for level ups
    const userDoc = req.user;
    const levelResult = await awardXpAndProgress(userDoc, earnedXp);
    leveledUp = levelResult.leveledUp;

    progress.earnedXp += earnedXp;
  }

  // Record evaluation log
  progress.evaluationLogs.push({
    ticketId,
    status: evalResult.success ? 'passed' : 'failed',
    astScore: evalResult.success ? 100 : 0,
    testScore: evalResult.success ? 100 : 0,
    executionLogs: evalResult.stdout || evalResult.stderr,
    submittedAt: new Date(),
  });

  await progress.save();

  // Find NPC persona dialogue response
  const npcPersona = scenario.npcPersonas && scenario.npcPersonas[0];
  const npcMessage = evalResult.success
    ? `Great job on resolving ${ticketId}! Tests passed cleanly.`
    : `Looks like ${ticketId} failed the automated test suite. Check the build logs.`;

  // Broadcast completion event over WebSockets
  broadcastToScenario(sessionId, 'EVALUATION_COMPLETED', {
    ticketId,
    success: evalResult.success,
    earnedXp,
    leveledUp,
    nextTicketId: progress.currentTicketId,
    npcMessage: npcPersona ? { name: npcPersona.name, role: npcPersona.role, message: npcMessage } : null,
  });

  return res.status(200).json({
    success: true,
    evalResult,
    earnedXp,
    leveledUp,
    progress,
  });
});

// @desc    Asynchronously analyze active session code via FastAPI microservice (AST + LLM Review)
// @route   POST /api/simulations/sessions/:sessionId/analyze
// @access  Private
export const analyzeSessionCode = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { filePath, codeContent, language = 'javascript' } = req.body;

  const progress = await UserProgress.findById(sessionId).populate('scenarioId');
  if (!progress) {
    throw ApiError.notFound('Simulation session not found');
  }

  let codeToAnalyze = codeContent || '';

  // If codeContent not provided directly in body, read from VFS state or file
  if (!codeToAnalyze && filePath) {
    if (progress.vfsState && progress.vfsState.has(filePath)) {
      codeToAnalyze = progress.vfsState.get(filePath);
    } else {
      const baseDir = progress.scenarioId.starterCodebasePath;
      codeToAnalyze = await readVfsFileStream(baseDir, filePath);
    }
  }

  if (!codeToAnalyze) {
    throw ApiError.badRequest('Please provide codeContent or a valid VFS filePath to analyze');
  }

  const scenario = progress.scenarioId;
  const activeTicket = scenario.tickets.find((t) => t.ticketId === progress.currentTicketId);
  const ticketTitle = activeTicket ? activeTicket.title : 'General Code Analysis';
  const acceptanceCriteria = activeTicket ? activeTicket.acceptanceCriteria : [];

  // Delegate asynchronously to FastAPI Microservice via Gateway
  const mlResult = await requestMlCodeAnalysis(
    codeToAnalyze,
    language,
    ticketTitle,
    acceptanceCriteria
  );

  // Broadcast WebSocket notification for completed analysis
  broadcastToScenario(sessionId, 'ML_ANALYSIS_COMPLETED', {
    sessionId,
    astMetrics: mlResult.astMetrics,
    llmReview: mlResult.llmReview,
    timestamp: new Date(),
  });

  return res.status(200).json({
    success: true,
    message: 'ML AST & Code Review completed asynchronously',
    astMetrics: mlResult.astMetrics,
    llmReview: mlResult.llmReview,
  });
});

