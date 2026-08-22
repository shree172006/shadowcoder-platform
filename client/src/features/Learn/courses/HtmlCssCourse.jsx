// --- HTML & CSS SKILL ROADMAP DEFINITION ---
export const HTML_CSS_COURSE = {
  id: 'html-css',
  title: 'HTML5 & Modern CSS3',
  icon: 'html-css',
  description: 'Master Semantic HTML5, CSS Box Model, Flexbox, CSS Grid 2D layout systems, CSS Variables, and Responsive Breakpoints.',
  nodes: [
    {
      id: 'hc-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Semantic Markup & SEO Anatomy',
        category: 'HTML5',
        status: 'completed',
        overview: 'Structure pages with modern semantic elements (<main>, <section>, <article>, <aside>, <nav>), OpenGraph metadata, and ARIA roles.',
        codeSnippet: `<!-- Modern Accessible HTML5 Document -->\n<main id="primary-content" role="main">\n  <article class="post-card">\n    <h2>Understanding Layout Engines</h2>\n    <p>Semantic tags improve accessibility and SEO rankings.</p>\n  </article>\n</main>`,
        tools: ['W3C Markup Validator', 'Lighthouse SEO'],
        testQuestion: {
          question: 'Which element should be used to wrap navigational links according to HTML5 standards?',
          options: ['<nav>', '<menu>', '<header>', '<aside>'],
          correctIndex: 0,
          explanation: '<nav> is specifically designed for major navigational blocks.'
        }
      }
    },
    {
      id: 'hc-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. Flexbox 1D Layout System',
        category: 'Layout',
        status: 'completed',
        overview: 'Master flex-direction, justify-content, align-items, flex-grow, flex-shrink, and flex-wrap for 1-dimensional layouts.',
        codeSnippet: `/* Flexbox Navbar Layout */\n.navbar-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n}`,
        tools: ['Flexbox Cheatsheet', 'Chrome DevTools Flexbox Overlay'],
        testQuestion: {
          question: 'Which property aligns flex items along the cross axis (vertical when flex-direction is row)?',
          options: ['justify-content', 'align-items', 'flex-direction', 'flex-basis'],
          correctIndex: 1,
          explanation: '`align-items` governs item positioning along the cross axis.'
        }
      }
    },
    {
      id: 'hc-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. CSS Grid 2D Layout & Responsive Breakpoints',
        category: 'Layout',
        status: 'active',
        overview: 'Create complex 2-dimensional grid layouts with grid-template-columns, grid-template-rows, repeat(auto-fit, minmax()), and gap.',
        codeSnippet: `/* Responsive 2D Card Grid */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 1.5rem;\n}`,
        tools: ['CSS Grid Inspector', 'Modern CSS Breakpoints'],
        testQuestion: {
          question: 'What is the key advantage of CSS Grid over Flexbox?',
          options: ['CSS Grid works in 2 dimensions (rows and columns simultaneously), whereas Flexbox is primarily 1-dimensional', 'CSS Grid doesn’t require CSS', 'CSS Grid only works on mobile devices', 'Flexbox is deprecated'],
          correctIndex: 0,
          explanation: 'CSS Grid handles full 2D row/column orchestration simultaneously.'
        }
      }
    }
  ],
  edges: [
    { id: 'ehc-1-2', source: 'hc-1', target: 'hc-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'ehc-2-3', source: 'hc-2', target: 'hc-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  ]
};
