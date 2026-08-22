// --- JAVASCRIPT SKILL ROADMAP DEFINITION ---
export const JAVASCRIPT_COURSE = {
  id: 'javascript',
  title: 'JavaScript Core & Advanced ES6+',
  icon: 'javascript',
  description: 'Master Scope & Closures, Prototypes, Asynchronous JavaScript (Promises/Async-Await), DOM Events, and the V8 Event Loop.',
  nodes: [
    {
      id: 'js-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Scopes, Closures & Lexical Environment',
        category: 'Core Concepts',
        status: 'completed',
        overview: 'Understand block scope vs function scope, variable hoisting (let/const vs var), closure memory retention, and IIFE patterns.',
        codeSnippet: `// Closure State Encapsulation Pattern\nfunction createRateLimiter(limit) {\n  let calls = 0;\n  return function() {\n    if (++calls > limit) throw new Error('Rate limit exceeded');\n    return calls;\n  };\n}`,
        tools: ['Chrome V8 Engine', 'Node.js REPL'],
        testQuestion: {
          question: 'What is a closure in JavaScript?',
          options: ['A function bundled together with references to its surrounding lexical state (lexical environment)', 'A keyword that closes the browser tab', 'A method to terminate loops', 'A JSON parser'],
          correctIndex: 0,
          explanation: 'A closure gives a function access to its outer scope variables even after the outer function has closed.'
        }
      }
    },
    {
      id: 'js-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. Asynchronous JS & Event Loop',
        category: 'Async Programming',
        status: 'completed',
        overview: 'Master Promises, async/await error handling with try/catch, Promise.all/allSettled concurrency, Microtask Queue vs Macrotask Queue.',
        codeSnippet: `// Concurrent Promise Resolution Example\nasync function fetchDashboardBundle() {\n  const [metrics, leaderboards] = await Promise.all([\n    fetch('/api/metrics').then(r => r.json()),\n    fetch('/api/leaderboards').then(r => r.json())\n  ]);\n  return { metrics, leaderboards };\n}`,
        tools: ['Fetch API', 'JS Visualizer Event Loop'],
        testQuestion: {
          question: 'Which queue takes execution priority in the JavaScript Event Loop after the Call Stack empties?',
          options: ['Microtask Queue (Promises, queueMicrotask)', 'Macrotask / Callback Queue (setTimeout, setInterval)', 'I/O Polling Queue', 'Rendering Queue'],
          correctIndex: 0,
          explanation: 'The Microtask Queue is completely drained before any task from the Macrotask Queue is picked up.'
        }
      }
    },
    {
      id: 'js-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. Prototypal Inheritance & ES6 Classes',
        category: 'OOP & Patterns',
        status: 'active',
        overview: 'Understand [[Prototype]] chains, Object.create(), class syntax, static methods, private fields (#), and constructor delegation.',
        codeSnippet: `// ES6 Class with Private Fields\nclass EventEmitter {\n  #listeners = new Map();\n  on(event, fn) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, []);\n    this.#listeners.get(event).push(fn);\n  }\n}`,
        tools: ['ES2024 Features', 'TypeScript Compiler'],
        testQuestion: {
          question: 'How do you declare a truly private field in modern ES6+ classes?',
          options: ['Prefix the property name with `#` (e.g. `#privateField`)', 'Prefix with `_` (e.g. `_privateField`)', 'Use the `private` keyword only', 'Wrap in a string'],
          correctIndex: 0,
          explanation: 'The `#` prefix is the ECMAScript standard syntax for declaring encapsulated private class fields.'
        }
      }
    }
  ],
  edges: [
    { id: 'ejs-1-2', source: 'js-1', target: 'js-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'ejs-2-3', source: 'js-2', target: 'js-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  ]
};
