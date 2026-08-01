// --- DATA ANALYST COURSE ROADMAP DEFINITION ---
export const DATA_ANALYTICS_COURSE = {
  id: 'data-analytics',
  title: 'Data Analyst',
  icon: 'data-analytics',
  description: 'Master SQL Analytics, Python Data Science (Pandas/NumPy), Data Cleaning, and BI Dashboards.',
  nodes: [
    {
      id: 'da-1',
      position: { x: 350, y: 50 },
      data: {
        label: '1. Advanced SQL & Window Functions',
        category: 'SQL Analytics',
        status: 'completed',
        overview: 'Master ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), CTE subqueries, and multi-table aggregate GROUP BY queries.',
        codeSnippet: `-- SQL Window Aggregation Query\nSELECT user_id, revenue,\n       ROW_NUMBER() OVER (ORDER BY revenue DESC) as rank_position,\n       NTILE(4) OVER (ORDER BY revenue DESC) as spending_quartile\nFROM customer_sales;`,
        tools: ['PostgreSQL', 'SQL Window Functions', 'DBeaver'],
        testQuestion: {
          question: 'Which SQL window function divides rows into a specified number of ranked buckets (e.g. quartiles)?',
          options: ['ROW_NUMBER()', 'NTILE(N)', 'RANK()', 'COUNT()'],
          correctIndex: 1,
          explanation: 'NTILE(N) divides ordered partition rows into N specified quartile or percentile buckets.'
        }
      }
    },
    {
      id: 'da-2',
      position: { x: 350, y: 180 },
      data: {
        label: '2. Python for Data Analysis (Pandas & NumPy)',
        category: 'Data Science',
        status: 'active',
        overview: 'Manipulate DataFrames, filter datasets, clean missing values (fillna/dropna), compute moving averages, and export cleaned CSV payloads.',
        codeSnippet: `# Pandas Data Cleaning Example\nimport pandas as pd\ndf = pd.read_csv('raw_logs.csv')\ndf['timestamp'] = pd.to_datetime(df['timestamp'], utc=True)\nclean_df = df.drop_duplicates().fillna(0)`,
        tools: ['Python 3.11', 'Pandas', 'NumPy', 'Jupyter Notebook'],
        testQuestion: {
          question: 'Which Pandas DataFrame method replaces null/NaN missing values with a specified default?',
          options: ['dropna()', 'fillna()', 'groupby()', 'merge()'],
          correctIndex: 1,
          explanation: '`fillna()` replaces null/NaN missing values with specified fill values.'
        }
      }
    }
  ],
  edges: [
    { id: 'eda-1-2', source: 'da-1', target: 'da-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  ]
};
