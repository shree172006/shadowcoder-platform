// --- REACT.JS SKILL ROADMAP DEFINITION ---
export const REACT_COURSE = {
  id: 'react',
  title: 'React.js Architecture & Performance',
  icon: 'react',
  description: 'Master Virtual DOM Reconciliation, Hooks, Custom Hooks, Performance Profiling (useMemo/useCallback), State Machines, and React 19 features.',
  nodes: [
    {
      id: 'react-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. JSX & Virtual DOM Reconciliation',
        category: 'Foundations',
        status: 'completed',
        overview: 'Understand JSX transpilation to React.createElement, Fiber tree nodes, reconciliation diffing algorithm, and why stable keys are essential for list rendering.',
        codeSnippet: `// Pure React Component with Stable Keys & Immutability
function UserCard({ user, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(user.id)}>
      <h4>{user.name}</h4>
      <span className="badge">{user.role}</span>
    </div>
  );
}

// Rendering lists with stable unique identifiers (NOT array indices)
export function UserDirectory({ users, onSelectUser }) {
  return (
    <div className="directory">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onSelect={onSelectUser} />
      ))}
    </div>
  );
}`,
        tools: ['React 19', 'JSX', 'Babel / SWC'],
        testQuestion: {
          question: 'Why should you avoid using array indices as `key` props when rendering dynamic lists in React?',
          options: [
            'Using indices causes reconciliation bugs and state corruption when items are reordered, inserted, or deleted',
            'Indices crash the browser JavaScript engine',
            'Indices make HTTP requests slower',
            'React forbids numbers as keys'
          ],
          correctIndex: 0,
          explanation: 'When items are reordered or filtered, index keys make React think elements are unchanged, causing stale component state and input glitches.'
        }
      }
    },
    {
      id: 'react-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. State Hooks, Batching & useEffect Lifecycle',
        category: 'State & Lifecycle',
        status: 'completed',
        overview: 'Master functional setState updates, automatic render batching in React 18/19, dependency arrays, and cleanup functions for WebSocket/event subscriptions.',
        codeSnippet: `import { useState, useEffect } from 'react';

export function WindowResizeMonitor() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 1. Subscribe to browser event
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // 2. Return cleanup function to eliminate memory leaks on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array = runs only on mount & unmount

  return <p>Current viewport width: {windowWidth}px</p>;
}`,
        tools: ['React DevTools', 'React StrictMode'],
        testQuestion: {
          question: 'What is the purpose of the return function inside a `useEffect` callback?',
          options: [
            'It acts as the cleanup phase, running before the component unmounts or before the effect re-runs with new dependencies',
            'It restarts the React application',
            'It sends a POST request to the server',
            'It forces a full page reload'
          ],
          correctIndex: 0,
          explanation: 'The cleanup function is executed when the component unmounts or before subsequent effect runs to tear down timers, sockets, or event listeners.'
        }
      }
    },
    {
      id: 'react-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. Performance: useMemo, useCallback & React.memo',
        category: 'Optimization',
        status: 'active',
        overview: 'Prevent unnecessary re-renders, memoize expensive calculations with useMemo, preserve callback reference stability with useCallback, and avoid premature optimization.',
        codeSnippet: `import React, { useState, useMemo, useCallback } from 'react';

// Memoized pure child component (only re-renders if props change by reference)
const SearchResultList = React.memo(function SearchResultList({ results, onItemClick }) {
  console.log('[Child Render]: SearchResultList rendered');
  return (
    <ul>
      {results.map((item) => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

export function FilterableCatalog({ products }) {
  const [query, setQuery] = useState('');

  // 1. Memoize expensive array filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  // 2. Preserve stable function reference so child React.memo is not bypassed
  const handleItemClick = useCallback((id) => {
    console.log('Selected product ID:', id);
  }, []);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <SearchResultList results={filteredProducts} onItemClick={handleItemClick} />
    </div>
  );
}`,
        tools: ['React Profiler', 'Why Did You Render'],
        testQuestion: {
          question: 'Why does passing an inline arrow function `<Child onClick={() => doSomething()} />` bypass `React.memo` on the child component?',
          options: [
            'A new function reference is allocated in memory on every parent render, failing React.memo reference equality check',
            'Arrow functions are not valid React props',
            'Inline functions crash the React Fiber tree',
            'React.memo only works on HTML div elements'
          ],
          correctIndex: 0,
          explanation: '`React.memo` performs a shallow reference check (`prevProps.onClick === nextProps.onClick`). A new inline function creates a new memory address every render.'
        }
      }
    },
    {
      id: 'react-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. Custom Hooks & Headless Logic Architecture',
        category: 'Patterns',
        status: 'unlocked',
        overview: 'Encapsulate complex stateful logic into reusable, composable custom hooks (e.g. useDebounce, useLocalStorage, useMediaQuery, useFetchWithRetry).',
        codeSnippet: `import { useState, useEffect } from 'react';

// Custom Hook: useDebounce value after delay
export function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

// Usage in Component
export function LiveSearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const debouncedQuery = useDebounce(input, 400);

  useEffect(() => {
    if (debouncedQuery) onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type to search..." />;
}`,
        tools: ['Custom Hooks', 'useSyncExternalStore'],
        testQuestion: {
          question: 'What are the two core rules of React Hooks that custom hooks must always adhere to?',
          options: [
            'Only call hooks at the top level (never in loops/conditions/nested functions) and only call hooks from React function components or custom hooks',
            'Always name hooks starting with "get" and call them inside class methods',
            'Never use async functions in JavaScript',
            'Hooks must always return an array'
          ],
          correctIndex: 0,
          explanation: 'React relies on call order across renders. Calling hooks inside conditionals breaks internal hook indexing in the Fiber node.'
        }
      }
    },
    {
      id: 'react-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. Context API, useReducer & Global State',
        category: 'State Architecture',
        status: 'unlocked',
        overview: 'Implement predictable state machines with useReducer, build lightweight modular global stores with Context providers, and prevent context re-render cascades.',
        codeSnippet: `import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], total: state.total + action.payload.price };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);`,
        tools: ['useReducer', 'Zustand', 'Context API'],
        testQuestion: {
          question: 'When every component consuming a Context re-renders on any state update, how can you optimize the architecture?',
          options: [
            'Split state and dispatch into separate Contexts (StateContext & DispatchContext), or use an external selector store like Zustand',
            'Delete all state variables',
            'Convert components into jQuery plugins',
            'Wrap the entire HTML document in React.memo'
          ],
          correctIndex: 0,
          explanation: 'Splitting state and dispatch allows components that only trigger actions (dispatch) to never re-render when state data changes.'
        }
      }
    },
    {
      id: 'react-6',
      position: { x: 350, y: 590 },
      data: {
        label: '6. React 19 Actions, Suspense & Streaming',
        category: 'Modern React',
        status: 'unlocked',
        overview: 'Master React 19 useActionState, useOptimistic UI updates, Suspense boundaries, and async streaming without manual loading state booleans.',
        codeSnippet: `import { useOptimistic } from 'react';

export function CommentFeed({ comments, onAddComment }) {
  // Optimistic UI state updates before server response
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (current, newComment) => [...current, { ...newComment, sending: true }]
  );

  async function handleAction(formData) {
    const text = formData.get('comment');
    addOptimisticComment({ id: Date.now(), text });
    await onAddComment(text); // Real network call
  }

  return (
    <div>
      <form action={handleAction}>
        <input name="comment" required placeholder="Write a comment..." />
        <button type="submit">Post</button>
      </form>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} style={{ opacity: c.sending ? 0.6 : 1 }}>
            {c.text} {c.sending && '(Sending...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        tools: ['React 19', 'useOptimistic', 'useActionState'],
        testQuestion: {
          question: 'What is the primary benefit of the `useOptimistic` hook introduced in React 19?',
          options: [
            'It updates the UI immediately assuming the server mutation will succeed, then automatically rolls back if the async action fails',
            'It doubles network download speed',
            'It converts SQL databases into NoSQL',
            'It generates random CSS themes'
          ],
          correctIndex: 0,
          explanation: '`useOptimistic` renders instant user feedback during asynchronous server actions and automatically reconciles when the true server state resolves.'
        }
      }
    }
  ],
  edges: [
    { id: 'er-1-2', source: 'react-1', target: 'react-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'er-2-3', source: 'react-2', target: 'react-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'er-3-4', source: 'react-3', target: 'react-4', type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'er-4-5', source: 'react-4', target: 'react-5', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 3 } },
    { id: 'er-5-6', source: 'react-5', target: 'react-6', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 3 } },
  ]
};
