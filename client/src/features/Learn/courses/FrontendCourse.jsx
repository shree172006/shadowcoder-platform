// --- FRONTEND DEVELOPER COURSE ROADMAP DEFINITION (OFFICIAL ROADMAP SPECIFICATION) ---
export const FRONTEND_COURSE = {
  id: 'frontend',
  title: 'Frontend Developer',
  icon: 'frontend',
  description: 'Master HTML5, CSS3, JavaScript ES6+, React.js, Vite, Testing, and Next.js App Router.',
  nodes: [
    {
      id: 'fe-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Internet & Web Protocols',
        category: 'Foundation',
        status: 'completed',
        overview: 'Understand how the Internet works, HTTP/HTTPS request-response cycles, DNS resolution, IP routing, and browser rendering engines.',
        codeSnippet: `// HTTP GET Request Header Example\nGET /api/v1/users HTTP/1.1\nHost: shadowcoder-app.web.app\nAccept: application/json`,
        tools: ['DNS', 'HTTP/2', 'Chrome DevTools'],
        testQuestion: {
          question: 'Which network protocol translates human-readable domain names (e.g. shadowcoder.app) into IP addresses?',
          options: ['HTTP', 'DNS (Domain Name System)', 'FTP', 'SMTP'],
          correctIndex: 1,
          explanation: 'DNS maps domain names to numeric IP addresses required for network routing.'
        }
      }
    },
    {
      id: 'fe-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. HTML5 & Semantic Web',
        category: 'Markup',
        status: 'completed',
        overview: 'Master semantic element structures (<header>, <main>, <article>), form validation, ARIA accessibility standards, and SEO tags.',
        codeSnippet: `<!-- Semantic HTML5 & Accessibility Example -->\n<header role="banner">\n  <nav aria-label="Main Navigation">\n    <a href="/dashboard">Dashboard</a>\n  </nav>\n</header>`,
        tools: ['W3C Validator', 'Lighthouse Accessibility Audit'],
        testQuestion: {
          question: 'Which semantic HTML5 tag should be used for the primary self-contained content of a document?',
          options: ['<div>', '<main>', '<section>', '<article>'],
          correctIndex: 1,
          explanation: '<main> represents the dominant, unique content of the body of the document.'
        }
      }
    },
    {
      id: 'fe-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. CSS3 & Modern Layouts',
        category: 'Styling',
        status: 'completed',
        overview: 'Master the CSS Box Model, Flexbox alignment, CSS Grid 2D layouts, Media Queries, CSS Custom Properties (Variables), and responsive breakpoints.',
        codeSnippet: `/* Modern CSS Grid & Flexbox Layout */\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}`,
        tools: ['Flexbox Playground', 'CSS Grid Inspector', 'Tailwind CSS'],
        testQuestion: {
          question: 'Which CSS Grid property specifies equal column sizing that automatically wraps items?',
          options: ['flex-direction: column', 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))', 'position: absolute', 'float: left'],
          correctIndex: 1,
          explanation: 'repeat(auto-fit, minmax(...)) dynamically creates responsive grid column tracks.'
        }
      }
    },
    {
      id: 'fe-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. JavaScript ES6+ & DOM',
        category: 'Core Language',
        status: 'active',
        overview: 'Deep dive into DOM events, Fetch API, Async/Await, ES6 modules, Closures, Prototypes, and the JavaScript Event Loop.',
        codeSnippet: `// Async/Await Fetch API Example\nasync function fetchDashboardStats() {\n  const res = await fetch('/api/stats');\n  const data = await res.json();\n  return data;\n}`,
        tools: ['Chrome V8 Engine', 'JS Event Loop Visualizer'],
        testQuestion: {
          question: 'What is the primary role of the JavaScript Event Loop?',
          options: ['To compile JS to C++', 'To handle asynchronous callbacks by offloading tasks to Web APIs and checking the Call Stack', 'To execute SQL queries', 'To minify CSS files'],
          correctIndex: 1,
          explanation: 'The Event Loop monitors the Call Stack and Callback Queue to execute async code.'
        }
      }
    },
    {
      id: 'fe-5',
      position: { x: 180, y: 480 },
      data: {
        label: '5. Version Control & Git',
        category: 'Tooling',
        status: 'locked',
        overview: 'Master Git CLI branching workflows, merge conflict resolution, rebase, and GitHub pull requests.',
        codeSnippet: `# Git Feature Branch Workflow\ngit checkout -b feature/auth-flow\ngit commit -m "feat: add Google OAuth login"\ngit push origin feature/auth-flow`,
        tools: ['Git CLI', 'GitHub', 'GitLab'],
        testQuestion: {
          question: 'Which Git command creates and immediately switches to a new branch?',
          options: ['git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git push'],
          correctIndex: 1,
          explanation: '`git checkout -b` creates a new branch and switches HEAD to it.'
        }
      }
    },
    {
      id: 'fe-6',
      position: { x: 520, y: 480 },
      data: {
        label: '6. Build Tools & Vite',
        category: 'Bundling',
        status: 'locked',
        overview: 'Explore module bundlers (Vite, Webpack), static asset optimization, ESLint code quality rules, and Prettier auto-formatting.',
        codeSnippet: `// vite.config.js Optimization\nexport default defineConfig({\n  build: { cssCodeSplit: true, minify: 'terser' }\n});`,
        tools: ['Vite', 'Webpack', 'ESLint', 'Prettier'],
        testQuestion: {
          question: 'Why is Vite faster than Webpack for local development hot module replacement (HMR)?',
          options: ['Vite uses Python under the hood', 'Vite leverages native browser ES Modules (ESM) without bundling everything up front', 'Vite disables CSS', 'Vite requires no Node.js'],
          correctIndex: 1,
          explanation: 'Vite serves source code over native ESM, bundling only on demand.'
        }
      }
    },
    {
      id: 'fe-7',
      position: { x: 350, y: 590 },
      data: {
        label: '7. React.js & State Management',
        category: 'Framework',
        status: 'locked',
        overview: 'Master React JSX, Component Lifecycle, Hooks (useState, useEffect, useMemo, useCallback), Context API, and Zustand / Redux Toolkit.',
        codeSnippet: `// Custom React Hook Example\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  return width;\n}`,
        tools: ['React DevTools', 'Redux Toolkit', 'Zustand'],
        testQuestion: {
          question: 'Which React Hook is used to memoize expensive calculation values between re-renders?',
          options: ['useState', 'useMemo', 'useEffect', 'useRef'],
          correctIndex: 1,
          explanation: '`useMemo` caches the result of a calculation between renders.'
        }
      }
    },
    {
      id: 'fe-8',
      position: { x: 180, y: 700 },
      data: {
        label: '8. Testing (Jest & Cypress)',
        category: 'Quality',
        status: 'locked',
        overview: 'Unit testing with Jest & React Testing Library, integration testing, and End-to-End (E2E) browser testing with Cypress.',
        codeSnippet: `// React Testing Library Example\ntest('renders login button', () => {\n  render(<AuthPage />);\n  expect(screen.getByText('Sign In')).toBeInTheDocument();\n});`,
        tools: ['Jest', 'React Testing Library', 'Cypress'],
        testQuestion: {
          question: 'What is the core philosophy of React Testing Library?',
          options: ['Test internal component state implementation details', 'The more your tests resemble the way your software is used, the more confidence they give you', 'Test CSS line heights', 'Disable user events'],
          correctIndex: 1,
          explanation: 'React Testing Library focuses on user-centric testing rather than internal implementation details.'
        }
      }
    },
    {
      id: 'fe-9',
      position: { x: 520, y: 700 },
      data: {
        label: '9. Next.js & Server Side Rendering',
        category: 'Architecture',
        status: 'locked',
        overview: 'TypeScript integration, Server-Side Rendering (SSR), Static Site Generation (SSG), App Router, and Core Web Vitals (LCP, CLS, INP) performance.',
        codeSnippet: `// Next.js App Router Server Component\nexport default async function Page() {\n  const data = await fetch('https://api.example.com/items', { cache: 'force-cache' });\n  const items = await data.json();\n  return <ItemList items={items} />;\n}`,
        tools: ['TypeScript', 'Next.js App Router', 'Web Vitals'],
        testQuestion: {
          question: 'In Web Vitals performance metrics, what does LCP stand for?',
          options: ['Largest Contentful Paint', 'Low Contrast Palette', 'Log Code Protocol', 'Local Cache Process'],
          correctIndex: 0,
          explanation: 'LCP (Largest Contentful Paint) measures render time of the largest content element visible in the viewport.'
        }
      }
    }
  ],
  edges: [
    { id: 'efe-1-2', source: 'fe-1', target: 'fe-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'efe-2-3', source: 'fe-2', target: 'fe-3', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } }, 
    { id: 'efe-3-4', source: 'fe-3', target: 'fe-4', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'efe-4-5', source: 'fe-4', target: 'fe-5', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
    { id: 'efe-4-6', source: 'fe-4', target: 'fe-6', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
    { id: 'efe-5-7', source: 'fe-5', target: 'fe-7', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
    { id: 'efe-6-7', source: 'fe-6', target: 'fe-7', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
    { id: 'efe-7-8', source: 'fe-7', target: 'fe-8', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
    { id: 'efe-7-9', source: 'fe-7', target: 'fe-9', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  ]
};
