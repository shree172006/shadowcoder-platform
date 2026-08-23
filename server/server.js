import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { initializeSocket } from './socket/socketManager.js';
import authRoutes from './routes/authRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();
connectDB();

// Ensure upload directories exist
const tempUploadDir = path.resolve(process.cwd(), 'uploads', 'temp');
const scenarioUploadDir = path.resolve(process.cwd(), 'uploads', 'scenarios');
if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir, { recursive: true });
if (!fs.existsSync(scenarioUploadDir)) fs.mkdirSync(scenarioUploadDir, { recursive: true });

const app = express();
const httpServer = http.createServer(app);

// ═══════════════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════

// Helmet: Comprehensive HTTP security headers (CSP, HSTS, Frameguard, etc.)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for API-only server; CSP managed by frontend
  crossOriginEmbedderPolicy: false,
}));

// Compression Middleware for Gzip/Brotli (Reduces network bandwidth by up to 80%)
app.use(compression());

// Disable Express Header & Add Security Guard Headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Global API Rate Limiter (200 requests per 15 minutes per IP)
app.use('/api', apiLimiter);

// Initialize Socket.io Real-Time Engine
initializeSocket(httpServer);

// ═══════════════════════════════════════════════════════
// CORS & BODY PARSING
// ═══════════════════════════════════════════════════════

// CORS Configuration with Credentials Support for HttpOnly Cookies
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ═══════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint (for load balancers, uptime monitors, k8s probes)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'shadowcoder-api',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'ShadowCoder Platform API & Real-Time Engine is running securely.' });
});

// ═══════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════

// Centralized Global Error Handling Middleware
app.use(errorMiddleware);

// ═══════════════════════════════════════════════════════
// SERVER STARTUP & GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
  console.log(`\n══════════════════════════════════════════════`);
  console.log(`  ShadowCoder API Server v1.0.0`);
  console.log(`  Port:        ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Client URL:  ${clientUrl}`);
  console.log(`  Health:      http://localhost:${PORT}/api/health`);
  console.log(`══════════════════════════════════════════════\n`);
});

// Graceful Shutdown Handler — ensures in-flight requests complete before exit
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Graceful shutdown initiated...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });

  // Force kill after 10 seconds if connections are hanging
  setTimeout(() => {
    console.error('[Server] Forced shutdown — connections did not close in time.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT EXCEPTION]:', error);
  process.exit(1);
});