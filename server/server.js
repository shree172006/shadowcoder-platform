import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import { initializeSocket } from './socket/socketManager.js';
import authRoutes from './routes/authRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();
configurePassport();

// Ensure upload directories exist
const tempUploadDir = path.resolve(process.cwd(), 'uploads', 'temp');
const scenarioUploadDir = path.resolve(process.cwd(), 'uploads', 'scenarios');
if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir, { recursive: true });
if (!fs.existsSync(scenarioUploadDir)) fs.mkdirSync(scenarioUploadDir, { recursive: true });

const app = express();
const httpServer = http.createServer(app);

// Compression Middleware for Gzip/Brotli (Reduces network bandwidth by up to 80%)
app.use(compression());

// Disable Express Header & Add Security Guard Headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('SourceMap', 'none');
  next();
});

// Initialize Socket.io Real-Time Engine
initializeSocket(httpServer);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/learn', learnRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ShadowCoder Platform API & Real-Time Engine is running securely.' });
});

// Centralized Global Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`ShadowCoder Server & WebSockets running in development mode on port ${PORT}`);
});