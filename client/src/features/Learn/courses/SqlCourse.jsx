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
        codeSnippet: `-- Create Normalized Orders Table with Foreign Key
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`,
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
        codeSnippet: `-- Aggregate Total Sales per Customer with LEFT JOIN
SELECT 
  u.id, 
  u.name, 
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING SUM(o.amount) > 1000
ORDER BY total_spent DESC;
`,
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
        label: '3. Window Functions & CTEs (Common Table Expressions)',
        category: 'Advanced Querying',
        status: 'active',
        overview: 'Master ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), PARTITION BY, and WITH (CTE) subqueries.',
        codeSnippet: `-- Top 3 Highest Spending Customers Per Region using Window Functions
WITH RankedCustomers AS (
  SELECT 
    user_id,
    region,
    total_spent,
    DENSE_RANK() OVER (PARTITION BY region ORDER BY total_spent DESC) AS rank_in_region
  FROM customer_analytics
)
SELECT * FROM RankedCustomers WHERE rank_in_region <= 3;
`,
        tools: ['PostgreSQL Window Planner', 'CTEs'],
        testQuestion: {
          question: 'What is the primary advantage of a Window Function compared to a regular GROUP BY?',
          options: ['Window functions calculate aggregated values without collapsing individual rows into a single summary row', 'Window functions run only on weekends', 'Window functions require no database index', 'Window functions change table schemas'],
          correctIndex: 0,
          explanation: 'Window functions perform calculations across a set of table rows that are related to the current row without grouping them into a single row.'
        }
      }
    },
    {
      id: 'sql-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. B-Tree Indexes & Query Optimization',
        category: 'Performance',
        status: 'unlocked',
        overview: 'Analyze query execution plans with EXPLAIN ANALYZE, build compound B-Tree indexes, and eliminate costly sequential table scans.',
        codeSnippet: `-- Create Compound Index for High-Throughput Lookup
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Inspect Cost Plan with EXPLAIN ANALYZE
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 42 AND status = 'completed';
`,
        tools: ['pg_stat_statements', 'B-Tree Indexes', 'GIN / GiST Indexes'],
        testQuestion: {
          question: 'Why should you avoid creating indexes on columns with very low cardinality (e.g. boolean flags)?',
          options: ['Indexes slow down INSERT/UPDATE/DELETE queries and the planner will prefer a sequential scan when a large % of rows match', 'PostgreSQL crashes on boolean indexes', 'Boolean values cannot be indexed', 'Indexes double memory usage for every character'],
          correctIndex: 0,
          explanation: 'Low-cardinality indexes provide negligible selectivity while still incurring index write overhead on mutations.'
        }
      }
    },
    {
      id: 'sql-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. ACID Transactions & Isolation Levels',
        category: 'Architecture',
        status: 'unlocked',
        overview: 'Understand Atomicity, Consistency, Isolation, Durability, dirty reads, phantom reads, and SELECT FOR UPDATE row-level locking.',
        codeSnippet: `-- Safe Financial Transfer with Row-Level Lock
BEGIN;
  -- Lock sender row to prevent concurrent overdraft
  SELECT balance FROM accounts WHERE id = 101 FOR UPDATE;
  
  UPDATE accounts SET balance = balance - 250 WHERE id = 101;
  UPDATE accounts SET balance = balance + 250 WHERE id = 202;
COMMIT;
`,
        tools: ['Transaction Isolation Levels', 'PostgreSQL WAL'],
        testQuestion: {
          question: 'What problem does `SELECT ... FOR UPDATE` solve in a high-concurrency relational database?',
          options: ['It locks the selected rows against concurrent modification until the current transaction commits or rolls back', 'It deletes the rows permanently', 'It speeds up SELECT queries by skipping the disk', 'It automatically converts SQL to JSON'],
          correctIndex: 0,
          explanation: '`SELECT FOR UPDATE` acquires an exclusive row-level lock, ensuring other transactions cannot modify or overwrite the rows until the transaction finishes.'
        }
      }
    }
  ],
  edges: [
    { id: 'esql-1-2', source: 'sql-1', target: 'sql-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'esql-2-3', source: 'sql-2', target: 'sql-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'esql-3-4', source: 'sql-3', target: 'sql-4', type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'esql-4-5', source: 'sql-4', target: 'sql-5', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 3 } },
  ]
};
