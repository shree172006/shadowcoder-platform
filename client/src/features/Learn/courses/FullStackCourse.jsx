// --- FULL STACK ENGINEER COURSE ROADMAP DEFINITION ---
export const FULLSTACK_COURSE = {
  id: 'fullstack',
  title: 'Full Stack Engineer',
  icon: 'fullstack',
  description: 'Master End-to-End System Design, WebSockets, Docker Sandboxing, Microservices, and CI/CD Pipelines.',
  nodes: [
    {
      id: 'fs-1',
      position: { x: 350, y: 50 },
      data: {
        label: '1. Full Stack Architecture',
        category: 'Architecture',
        status: 'completed',
        overview: 'Structure modern monorepo workspaces, unified client-server type sharing, environment configuration management, and API gateway routing.',
        codeSnippet: `// Monorepo Shared Types Example\nexport interface UserProgressDTO {\n  userId: string;\n  completedTickets: string[];\n  earnedXp: number;\n}`,
        tools: ['npm workspaces', 'pnpm', 'Turborepo'],
        testQuestion: {
          question: 'What is a primary benefit of using a Monorepo architecture for full-stack engineering?',
          options: ['Eliminates the need for databases', 'Allows client and server projects to share code, types, and build scripts in one repository', 'Makes CSS obsolete', 'Forces the backend to use HTML'],
          correctIndex: 1,
          explanation: 'Monorepos enable seamless code/type sharing and synchronized atomic commits.'
        }
      }
    },
    {
      id: 'fs-2',
      position: { x: 350, y: 180 },
      data: {
        label: '2. Real-Time WebSockets & Socket.io',
        category: 'Real-Time Systems',
        status: 'completed',
        overview: 'Implement bidirectional real-time communication, WebSockets handshake, rooms broadcasting, and automatic reconnection fallbacks.',
        codeSnippet: `// Socket.io Room Broadcast Example\nio.to(\`scenario_\${sessionId}\`).emit('EVALUATION_STARTED', {\n  ticketId: 'FE-101',\n  timestamp: new Date()\n});`,
        tools: ['Socket.io', 'WebSockets API', 'Redis Adapter'],
        testQuestion: {
          question: 'Which protocol upgrade header is sent during a WebSockets handshake?',
          options: ['Upgrade: websocket', 'Connection: close', 'Accept: text/html', 'Content-Type: json'],
          correctIndex: 0,
          explanation: 'The client sends `Upgrade: websocket` to switch from HTTP/1.1 to the WebSocket TCP protocol.'
        }
      }
    },
    {
      id: 'fs-3',
      position: { x: 350, y: 310 },
      data: {
        label: '3. Docker Sandboxing & Containerization',
        category: 'DevOps',
        status: 'active',
        overview: 'Write optimized Dockerfiles, docker-compose orchestration, container resource limits (memory/CPU caps), and RCE-safe process isolation.',
        codeSnippet: `# Docker Isolated Evaluation Container\nFROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm ci --only=production\nCMD ["npm", "test"]`,
        tools: ['Docker CLI', 'Docker Compose', 'Alpine Linux'],
        testQuestion: {
          question: 'Which Docker CLI flag disables external network access inside a container for security isolation?',
          options: ['--network none', '--memory 512m', '--rm', '-v'],
          correctIndex: 0,
          explanation: '`--network none` completely disables network interfaces inside the container, preventing unauthorized socket outbound connections.'
        }
      }
    }
  ],
  edges: [
    { id: 'efs-1-2', source: 'fs-1', target: 'fs-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'efs-2-3', source: 'fs-2', target: 'fs-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  ]
};
