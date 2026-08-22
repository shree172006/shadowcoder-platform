// --- SQL & DATABASES SKILL ROADMAP DEFINITION ---
export const SQL_COURSE = {
  id: 'sql',
  title: 'SQL & Database Architecture',
  icon: 'sql',
  description: 'Master DDL & DML, Foreign Keys, Complex JOINs, B-Tree Indexes, ACID Transactions, and Query Optimization.',
  nodes: [
    {
      id: 'sql-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Relational Schema Design & DDL',
        category: 'Foundations',
        status: 'completed',
        overview: 'Understand primary keys, foreign key constraints, column data types, table creation, default values, and schema migrations.',
        codeSnippet: `-- Create Normalized Orders Table with Foreign Key\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  amount DECIMAL(10,2) NOT NULL,\n  status VARCHAR(20) DEFAULT 'pending',\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`,
        tools: ['PostgreSQL', 'MySQL', 'DBeaver'],
        testQuestion: {
          question: 'What does `ON DELETE CASCADE` on a foreign key constraint do?',
          options: ['Deletes the parent table entirely', 'Automatically deletes matching child records when the referenced parent record is deleted', 'Throws an error whenever data is deleted', 'Encrypts deleted rows'],
          correctIndex: 1,
          explanation: '`ON DELETE CASCADE` automatically removes dependent child rows when the parent record is deleted.'
        }
      }
    },
    {
      id: 'sql-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. Multi-Table JOINs & Aggregations',
        category: 'Querying',
        status: 'completed',
        overview: 'Master INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL OUTER JOIN, GROUP BY, HAVING clauses, and subqueries.',
        codeSnippet: `-- Aggregate Total Sales per Customer with LEFT JOIN\nSELECT u.id, u.name, COALESCE(SUM(o.amount), 0) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nHAVING SUM(o.amount) > 1000\nORDER BY total_spent DESC;`,
        tools: ['SQL Query Planner', 'EXPLAIN ANALYZE'],
        testQuestion: {
          question: 'What is the difference between `WHERE` and `HAVING` in SQL?',
          options: ['WHERE filters grouped aggregated records; HAVING filters raw rows', 'WHERE filters raw rows before grouping; HAVING filters aggregated groups', 'WHERE only works on strings; HAVING works on numbers', 'There is no difference'],
          correctIndex: 1,
          explanation: '`WHERE` filters rows before any groupings are applied; `HAVING` filters results produced by `GROUP BY` aggregations.'
        }
      }
    },
    {
      id: 'sql-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. B-Tree Indexes & Query Optimization',
        category: 'Performance',
        status: 'active',
        overview: 'Analyze query execution plans with EXPLAIN ANALYZE, build compound B-Tree indexes, and eliminate costly sequential table scans.',
        codeSnippet: `-- Create Compound Index for High-Throughput Lookup\nCREATE INDEX idx_orders_user_status ON orders(user_id, status);\nEXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42 AND status = 'completed';`,
        tools: ['pg_stat_statements', 'B-Tree Indexes', 'GIN / GiST Indexes'],
        testQuestion: {
          question: 'Why should you avoid creating indexes on columns with very low cardinality (e.g. boolean flags)?',
          options: ['Indexes slow down INSERT/UPDATE/DELETE queries and the planner will prefer a sequential scan when a large % of rows match', 'PostgreSQL crashes on boolean indexes', 'Boolean values cannot be indexed', 'Indexes double memory usage for every character'],
          correctIndex: 0,
          explanation: 'Low-cardinality indexes provide negligible selectivity while still incurring index write overhead on mutations.'
        }
      }
    }
  ],
  edges: [
    { id: 'esql-1-2', source: 'sql-1', target: 'sql-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'esql-2-3', source: 'sql-2', target: 'sql-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  ]
};
