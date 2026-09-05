// --- BACKEND DEVELOPER COURSE ROADMAP DEFINITION ---
export const BACKEND_COURSE = {
  id: 'backend',
  title: 'Distributed Backend Systems & Architecture',
  icon: 'backend',
  description: 'Master Node.js Event Loop, Express Middleware Pipelines, PostgreSQL Indexing, Redis Caching, JWT Token Rotation, and Concurrency Locks.',
  nodes: [
    {
      id: 'be-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Node.js Runtime & Event Loop Phases',
        category: 'Runtime',
        status: 'completed',
        overview: 'Understand Node.js asynchronous non-blocking I/O model, libuv threadpool, process.nextTick vs queueMicrotask, and Stream backpressure.',
        codeSnippet: `// Node.js Stream Pipeline with Backpressure
import fs from 'fs';
import { pipeline } from 'stream/promises';
import zlib from 'zlib';

export async function compressLogFile(inputPath, outputPath) {
  await pipeline(
    fs.createReadStream(inputPath),
    zlib.createGzip(),
    fs.createWriteStream(outputPath)
  );
  console.log('Stream compression finished with zero memory leaks.');
}`,
        tools: ['Node.js v20+', 'libuv', 'V8 Inspector'],
        testQuestion: {
          question: 'Which C library handles asynchronous I/O and threadpooling under the hood in Node.js?',
          options: ['libuv', 'OpenSSL', 'zlib', 'v8'],
          correctIndex: 0,
          explanation: 'libuv is the multi-platform C library that provides Node.js with its asynchronous I/O event loop.'
        }
      }
    },
    {
      id: 'be-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. Express.js & Middleware Architecture',
        category: 'Framework',
        status: 'completed',
        overview: 'Build modular RESTful API endpoints, global error handlers, custom middleware pipelines, and input validation schemas.',
        codeSnippet: `import express from 'express';

const app = express();
app.use(express.json());

// Global Async Handler Middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/api/orders', asyncHandler(async (req, res) => {
  const { cartId, amount } = req.body;
  if (!cartId || amount <= 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  return res.status(201).json({ success: true, orderId: Date.now() });
}));`,
        tools: ['Express.js', 'Postman', 'Zod'],
        testQuestion: {
          question: 'Which HTTP status code should be returned when a client submits malformed or missing parameters?',
          options: ['400 Bad Request', '404 Not Found', '500 Internal Server Error', '302 Found'],
          correctIndex: 0,
          explanation: 'HTTP 400 Bad Request indicates that the server cannot or will not process the request due to client error.'
        }
      }
    },
    {
      id: 'be-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. PostgreSQL, Indexes & ACID Transactions',
        category: 'Databases',
        status: 'active',
        overview: 'Master relational schema design, foreign key constraints, B-Tree indexes, and row-level locking (SELECT FOR UPDATE) to prevent race conditions.',
        codeSnippet: `-- Safe Financial Transfer with Row-Level Lock
BEGIN;
  -- Lock sender row to prevent concurrent double-spending
  SELECT balance FROM accounts WHERE id = 101 FOR UPDATE;
  
  UPDATE accounts SET balance = balance - 500 WHERE id = 101;
  UPDATE accounts SET balance = balance + 500 WHERE id = 202;
COMMIT;`,
        tools: ['PostgreSQL', 'Prisma ORM', 'DBeaver'],
        testQuestion: {
          question: 'What does `SELECT ... FOR UPDATE` guarantee in a high-concurrency database transaction?',
          options: [
            'It locks the selected rows against concurrent modification until the current transaction commits or rolls back',
            'It permanently deletes the records',
            'It disables all database indexes',
            'It converts SQL rows to JSON'
          ],
          correctIndex: 0,
          explanation: '`SELECT FOR UPDATE` acquires an exclusive row-level lock, preventing other transactions from modifying or overwriting the rows until the transaction finishes.'
        }
      }
    },
    {
      id: 'be-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. Redis Caching, Rate Limiting & Concurrency Mutex',
        category: 'Distributed Systems',
        status: 'unlocked',
        overview: 'Implement distributed locking with Redis Redlock, token bucket rate limiting to prevent API abuse, and cache invalidation strategies.',
        codeSnippet: `// Token Bucket Rate Limiting with Redis
export async function checkRateLimit(redisClient, userId, limit = 60, windowSeconds = 60) {
  const key = \`rate_limit:\${userId}\`;
  const current = await redisClient.incr(key);
  if (current === 1) {
    await redisClient.expire(key, windowSeconds);
  }
  return current <= limit;
}`,
        tools: ['Redis', 'ioredis', 'Redlock'],
        testQuestion: {
          question: 'Why is Redis ideal for high-throughput rate limiting and distributed caching?',
          options: [
            'Redis runs entirely in-memory with sub-millisecond atomic commands (INCR, EXPIRE)',
            'Redis stores files on tape drives',
            'Redis only runs on smartphones',
            'Redis does not require CPU'
          ],
          correctIndex: 0,
          explanation: 'Redis operates in-memory with single-threaded atomic operations, enabling tens of thousands of rate-limit evaluations per second.'
        }
      }
    },
    {
      id: 'be-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. Authentication Security, JWT Rotation & Bcrypt',
        category: 'Security',
        status: 'unlocked',
        overview: 'Implement JWT refresh token rotation, HttpOnly cookies to stop XSS attacks, bcrypt password hashing with salt rounds, and token blacklisting.',
        codeSnippet: `import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Password Hashing with Salt Rounds
export async function hashUserPassword(rawPassword) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(rawPassword, salt);
}

// 2. Issuing Secure HttpOnly Cookie
export function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}`,
        tools: ['Bcrypt', 'JWT', 'Helmet'],
        testQuestion: {
          question: 'Why is storing JWTs in HttpOnly cookies more secure than localStorage?',
          options: [
            'HttpOnly cookies cannot be read or stolen via Client-Side Cross-Site Scripting (XSS) attacks',
            'localStorage is limited to 10 bytes',
            'HttpOnly cookies bypass CORS',
            'localStorage requires a database'
          ],
          correctIndex: 0,
          explanation: 'HttpOnly flag prevents client-side JavaScript scripts from reading authentication tokens, stopping XSS token exfiltration.'
        }
      }
    },
    {
      id: 'be-6',
      position: { x: 350, y: 590 },
      data: {
        label: '6. WebSockets, Event Buses & Microservices',
        category: 'Real-Time',
        status: 'unlocked',
        overview: 'Build real-time bi-directional WebSocket servers with Socket.io, pub/sub event buses, and asynchronous background worker queues (BullMQ).',
        codeSnippet: `import { Server } from 'socket.io';

export function setupRealtimeServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join_room', (room) => socket.join(room));
    socket.on('broadcast_event', ({ room, data }) => {
      io.to(room).emit('live_update', data);
    });
  });

  return io;
}`,
        tools: ['Socket.io', 'BullMQ', 'Kafka / RabbitMQ'],
        testQuestion: {
          question: 'What is the primary architectural advantage of WebSockets over traditional HTTP polling?',
          options: [
            'A single persistent full-duplex TCP connection eliminates repetitive HTTP request/response handshake overhead',
            'WebSockets convert audio to text',
            'WebSockets run without an IP address',
            'WebSockets replace SQL databases'
          ],
          correctIndex: 0,
          explanation: 'WebSockets maintain an open two-way channel, enabling instant server-to-client broadcasts without polling latency.'
        }
      }
    }
  ],
  edges: [
    { id: 'ebe-1-2', source: 'be-1', target: 'be-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'ebe-2-3', source: 'be-2', target: 'be-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'ebe-3-4', source: 'be-3', target: 'be-4', type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'ebe-4-5', source: 'be-4', target: 'be-5', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    { id: 'ebe-5-6', source: 'be-5', target: 'be-6', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 3 } },
  ]
};
