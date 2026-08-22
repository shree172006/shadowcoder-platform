// --- BACKEND DEVELOPER COURSE ROADMAP DEFINITION (OFFICIAL ROADMAP SPECIFICATION) ---
export const BACKEND_COURSE = {
  id: 'backend',
  title: 'Backend Developer',
  icon: 'backend',
  description: 'Master Node.js, Express.js, REST & WebSockets, PostgreSQL & MongoDB, Security, and Microservices.',
  nodes: [
    {
      id: 'be-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Node.js Runtime & Event Loop',
        category: 'Runtime',
        status: 'completed',
        overview: 'Understand Node.js asynchronous non-blocking I/O model, libuv threadpool, Process object, and Buffer/Stream API.',
        codeSnippet: `// Node.js Stream Reading Example\nimport fs from 'fs';\nconst stream = fs.createReadStream('./large-file.json', { encoding: 'utf8' });\nstream.on('data', chunk => console.log('Chunk received:', chunk.length));`,
        tools: ['Node.js v20', 'libuv', 'V8 Inspector'],
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
        label: '2. Express.js & REST API Architecture',
        category: 'Framework',
        status: 'completed',
        overview: 'Build modular RESTful API endpoints, middleware pipelines, error handling boundaries, and request validation wrappers.',
        codeSnippet: `// Express.js Modular Router Example\nimport { Router } from 'express';\nconst router = Router();\nrouter.get('/users', async (req, res) => res.json({ users: [] }));`,
        tools: ['Express.js', 'Postman', 'Swagger OpenAPI'],
        testQuestion: {
          question: 'Which HTTP method should be used to apply partial modifications to a resource according to REST standards?',
          options: ['GET', 'POST', 'PATCH', 'DELETE'],
          correctIndex: 2,
          explanation: 'PATCH is designed for partial modifications to an existing resource.'
        }
      }
    },
    {
      id: 'be-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. SQL & Relational Databases (PostgreSQL)',
        category: 'Databases',
        status: 'active',
        overview: 'Master relational schema design, 3NF normalization, ACID transactions, foreign key constraints, B-Tree indexes, and complex JOIN queries.',
        codeSnippet: `-- PostgreSQL Index & Join Query\nSELECT u.id, u.email, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id;\nCREATE INDEX idx_user_id ON orders(user_id);`,
        tools: ['PostgreSQL', 'pgAdmin', 'Prisma ORM'],
        testQuestion: {
          question: 'What does the "A" in ACID database transaction properties stand for?',
          options: ['Atomicity', 'Asynchronous', 'Authority', 'Availability'],
          correctIndex: 0,
          explanation: 'Atomicity guarantees that all statements within a transaction commit successfully or roll back completely.'
        }
      }
    },
    {
      id: 'be-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. NoSQL Databases (MongoDB)',
        category: 'Databases',
        status: 'locked',
        overview: 'Design document schemas, Mongoose models, aggregation pipelines ($match, $group, $lookup), compound indexing, and MongoDB Atlas sharding.',
        codeSnippet: `// MongoDB Aggregation Pipeline\nUser.aggregate([\n  { $match: { role: 'student' } },\n  { $group: { _id: '$track', totalXp: { $sum: '$xp' } } }\n]);`,
        tools: ['MongoDB Atlas', 'Mongoose', 'MongoDB Compass'],
        testQuestion: {
          question: 'Which MongoDB aggregation stage is used to perform left outer joins with another collection?',
          options: ['$match', '$group', '$lookup', '$unwind'],
          correctIndex: 2,
          explanation: '$lookup performs equality joins to another collection in the same database.'
        }
      }
    },
    {
      id: 'be-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. Authentication & Security Guard',
        category: 'Security',
        status: 'locked',
        overview: 'Implement JWT refresh token rotation, HttpOnly cookie security, bcrypt password hashing, CORS policies, helmet headers, and Redis blacklisting.',
        codeSnippet: `// HttpOnly Cookie & JWT Guard\nres.cookie('token', jwtToken, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict'\n});`,
        tools: ['JSON Web Tokens (JWT)', 'Bcrypt', 'Redis'],
        testQuestion: {
          question: 'Why is storing JWTs in HttpOnly cookies more secure than localStorage?',
          options: ['HttpOnly cookies cannot be read or stolen via Client-Side Cross-Site Scripting (XSS) attacks', 'localStorage is limited to 10 bytes', 'HttpOnly cookies bypass CORS', 'localStorage requires a database'],
          correctIndex: 0,
          explanation: 'HttpOnly flag prevents client-side JavaScript scripts from reading authentication tokens.'
        }
      }
    }
  ],
  edges: [
    { id: 'ebe-1-2', source: 'be-1', target: 'be-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'ebe-2-3', source: 'be-2', target: 'be-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'ebe-3-4', source: 'be-3', target: 'be-4', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'ebe-4-5', source: 'be-4', target: 'be-5', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
  ]
};
