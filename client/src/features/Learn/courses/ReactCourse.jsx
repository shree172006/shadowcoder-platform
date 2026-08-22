// --- REACT.JS SKILL ROADMAP DEFINITION ---
export const REACT_COURSE = {
  id: 'react',
  title: 'React.js Deep Dive',
  icon: 'react',
  description: 'Master Components, Hooks, State Management, Custom Hooks, Performance Optimization (React.memo/useMemo), and Next.js integration.',
  nodes: [
    {
      id: 'react-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. JSX & Component Architecture',
        category: 'Components',
        status: 'completed',
        overview: 'Understand Virtual DOM reconciliation, JSX compilation to createElement, props immutability, and component composition patterns.',
        codeSnippet: `// Pure React Component with Props\nfunction UserAvatar({ name, role }) {\n  return (\n    <div className="avatar-card">\n      <h3>{name}</h3>\n      <span className="badge">{role}</span>\n    </div>\n  );\n}`,
        tools: ['React 19', 'JSX', 'Babel / SWC'],
        testQuestion: {
          question: 'What is the primary purpose of the React Virtual DOM?',
          options: ['To compile JavaScript into machine code', 'To minimize expensive direct DOM manipulations through batched reconciliation diffing', 'To store SQL database tables', 'To encrypt HTTP requests'],
          correctIndex: 1,
          explanation: 'The Virtual DOM allows React to compute minimal DOM diffs before updating the real browser DOM.'
        }
      }
    },
    {
      id: 'react-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. Hooks (useState & useEffect)',
        category: 'State & Lifecycle',
        status: 'completed',
        overview: 'Master component state updates, dependency arrays in useEffect, clean-up functions for event listeners, and stale closure pitfalls.',
        codeSnippet: `// useEffect with Cleanup Function\nuseEffect(() => {\n  const onResize = () => setWindowWidth(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);`,
        tools: ['React DevTools', 'React StrictMode'],
        testQuestion: {
          question: 'What happens if you omit the dependency array in a `useEffect` hook?',
          options: ['The effect runs only on mount', 'The effect runs on every single render cycle', 'The effect throws a syntax error', 'The effect is permanently disabled'],
          correctIndex: 1,
          explanation: 'Without a dependency array, `useEffect` executes after every completed render.'
        }
      }
    },
    {
      id: 'react-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. Performance (useMemo, useCallback, React.memo)',
        category: 'Optimization',
        status: 'active',
        overview: 'Prevent unnecessary re-renders, memoize expensive calculations with useMemo, preserve function reference stability with useCallback, and use React.memo.',
        codeSnippet: `// useCallback & useMemo Optimization\nconst memoizedCallback = useCallback((id) => {\n  fetchItemDetails(id);\n}, [fetchItemDetails]);\n\nconst filteredList = useMemo(() => {\n  return items.filter(i => i.score > threshold);\n}, [items, threshold]);`,
        tools: ['React Profiler', 'Why Did You Render'],
        testQuestion: {
          question: 'When should `useCallback` be used in a React component?',
          options: ['On every variable declaration', 'To preserve stable function references passed as props to memoized child components', 'To replace SQL queries', 'To prevent CSS loading'],
          correctIndex: 1,
          explanation: '`useCallback` prevents child components wrapped in React.memo from re-rendering due to changing function references.'
        }
      }
    },
    {
      id: 'react-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. Context API & State Management',
        category: 'Architecture',
        status: 'locked',
        overview: 'Build global application stores with createContext, useContext, custom provider wrappers, and state reducers (useReducer) to eliminate prop drilling.',
        codeSnippet: `// Custom Context Provider Pattern\nconst ThemeContext = createContext(null);\nexport const useTheme = () => useContext(ThemeContext);\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('dark');\n  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;\n}`,
        tools: ['React Context', 'Zustand', 'Redux Toolkit'],
        testQuestion: {
          question: 'What is the main problem solved by React Context API?',
          options: ['Prop drilling across deeply nested component trees', 'Slow database queries', 'Bypassing browser CORS', 'Compiling TypeScript to WebAssembly'],
          correctIndex: 0,
          explanation: 'Context provides a mechanism to pass data down the component tree without manually passing props at every level.'
        }
      }
    }
  ],
  edges: [
    { id: 'er-1-2', source: 'react-1', target: 'react-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'er-2-3', source: 'react-2', target: 'react-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'er-3-4', source: 'react-3', target: 'react-4', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
  ]
};
