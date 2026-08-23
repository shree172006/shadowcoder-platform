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
        codeSnippet: `// Closure State Encapsulation Pattern
function createRateLimiter(limit) {
  let calls = 0;
  return function() {
    if (++calls > limit) {
      console.log('❌ Rate limit exceeded!');
      return false;
    }
    console.log(\`✓ Request \${calls}/\${limit} processed successfully.\`);
    return true;
  };
}

const limiter = createRateLimiter(3);
limiter(); // 1
limiter(); // 2
limiter(); // 3
limiter(); // Exceeded
`,
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
        label: '2. Asynchronous JS, Promises & Event Loop',
        category: 'Async Programming',
        status: 'completed',
        overview: 'Master Promises, async/await error handling with try/catch, Promise.all/allSettled concurrency, Microtask Queue vs Macrotask Queue.',
        codeSnippet: `// Concurrent Promise Resolution Example
async function fetchDashboardBundle() {
  console.log('Fetching multi-endpoint API metrics...');
  const simulateApi = (name, delay) => new Promise(res => setTimeout(() => res(\`\${name} payload\`), delay));

  const [metrics, leaderboards] = await Promise.all([
    simulateApi('Server Metrics', 100),
    simulateApi('Global Leaderboards', 150)
  ]);
  
  console.log('Results loaded:', { metrics, leaderboards });
  return { metrics, leaderboards };
}

fetchDashboardBundle();
`,
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
        codeSnippet: `// ES6 Class with Private Encapsulation & Inheritance
class EventEmitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
  }

  emit(event, data) {
    const handlers = this.#listeners.get(event) || [];
    handlers.forEach(fn => fn(data));
  }
}

const bus = new EventEmitter();
bus.on('orderPlaced', (order) => console.log('🔔 Order received:', order));
bus.emit('orderPlaced', { id: 101, amount: 499 });
`,
        tools: ['ES2024 Features', 'TypeScript Compiler'],
        testQuestion: {
          question: 'How do you declare a truly private field in modern ES6+ classes?',
          options: ['Prefix the property name with `#` (e.g. `#privateField`)', 'Prefix with `_` (e.g. `_privateField`)', 'Use the `private` keyword only', 'Wrap in a string'],
          correctIndex: 0,
          explanation: 'The `#` prefix is the ECMAScript standard syntax for declaring encapsulated private class fields.'
        }
      }
    },
    {
      id: 'js-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. DOM Events & Performance Delegation',
        category: 'Browser APIs',
        status: 'unlocked',
        overview: 'Master Event Bubbling, Capturing, stopPropagation(), preventDefault(), and Event Delegation for high-performance lists.',
        codeSnippet: `// Event Delegation Pattern
function setupTableDelegation(tableElement) {
  tableElement.addEventListener('click', (event) => {
    const targetButton = event.target.closest('button[data-action]');
    if (!targetButton) return;
    
    const action = targetButton.dataset.action;
    const rowId = targetButton.closest('tr')?.dataset.id;
    console.log(\`Action triggered: \${action} on row ID: \${rowId}\`);
  });
}
console.log('Event delegation listener configured.');
`,
        tools: ['Chrome DevTools Elements', 'DOM Events API'],
        testQuestion: {
          question: 'Why is Event Delegation preferred over attaching listeners to 1,000 individual list items?',
          options: ['It uses 1 single event listener on the parent, drastically saving memory and handling dynamically added items', 'It runs in a separate thread', 'It avoids using JavaScript', 'It bypasses CSS styling'],
          correctIndex: 0,
          explanation: 'Event delegation leverages event bubbling to handle events on parent nodes with minimal memory overhead.'
        }
      }
    },
    {
      id: 'js-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. Modern ES2024+ Features & Generators',
        category: 'Modern Syntax',
        status: 'unlocked',
        overview: 'Master Optional Chaining (?.), Nullish Coalescing (??), Structured Clone, Object.groupBy(), and Async Generators (yield).',
        codeSnippet: `// Modern ES2024 Features
const users = [
  { name: 'Alex', role: 'admin', settings: { theme: 'dark' } },
  { name: 'Sam', role: 'developer' }
];

// Optional chaining & nullish coalescing
const theme = users[1]?.settings?.theme ?? 'default-dark';
console.log('Resolved user theme:', theme);

// Async Generator for paginated data
async function* fetchPages() {
  for (let page = 1; page <= 3; page++) {
    yield \`Data Page \${page}\`;
  }
}
`,
        tools: ['ESNext TC39', 'Babel Compiler'],
        testQuestion: {
          question: 'What is the key difference between the || operator and the ?? (Nullish Coalescing) operator?',
          options: ['?? only falls back on null or undefined, while || falls back on any falsy value (0, false, "")', 'There is no difference', '?? is only for numbers', '|| is faster'],
          correctIndex: 0,
          explanation: '?? only treats null and undefined as nullish, preserving valid falsy values like 0, false, and empty strings.'
        }
      }
    },
    {
      id: 'js-6',
      position: { x: 350, y: 590 },
      data: {
        label: '6. WebSockets, Web Workers & Offline Storage',
        category: 'Advanced Architecture',
        status: 'unlocked',
        overview: 'Build real-time apps using WebSockets, offload heavy computation with Web Workers, and manage offline data with IndexedDB.',
        codeSnippet: `// Web Worker Spawning & Message Passing
const workerCode = \`
  self.onmessage = (e) => {
    const result = e.data.nums.reduce((a, b) => a + b, 0);
    self.postMessage({ sum: result });
  };
\`;

console.log('Web Worker script ready for multi-threaded browser computation.');
`,
        tools: ['WebSockets API', 'Web Worker API', 'IndexedDB'],
        testQuestion: {
          question: 'What is the primary benefit of Web Workers in modern web applications?',
          options: ['They execute heavy JavaScript scripts in background threads without blocking the browser UI main thread', 'They allow direct access to DOM nodes', 'They replace CSS', 'They stop HTTP requests'],
          correctIndex: 0,
          explanation: 'Web Workers run in isolated background threads, preventing CPU-intensive tasks from freezing the browser UI.'
        }
      }
    }
  ],
  edges: [
    { id: 'ejs-1-2', source: 'js-1', target: 'js-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'ejs-2-3', source: 'js-2', target: 'js-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'ejs-3-4', source: 'js-3', target: 'js-4', type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'ejs-4-5', source: 'js-4', target: 'js-5', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    { id: 'ejs-5-6', source: 'js-5', target: 'js-6', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 3 } },
  ]
};
