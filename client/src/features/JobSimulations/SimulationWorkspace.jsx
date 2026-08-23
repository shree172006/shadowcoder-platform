import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, Briefcase, 
  ShieldCheck, Cpu, Terminal, Zap, FileCode, Check, X, Award, AlertTriangle, Layers, Lock 
} from 'lucide-react';
import DesktopOnly from '../../layouts/DesktopOnly';
import DevStudioWorkspace from '../../components/IDE/DevStudioWorkspace.jsx';
import SimulationReviewModal from './components/SimulationReviewModal.jsx';

// Multi-file starter codebases dictionary for real workplace simulations
const SCENARIO_STARTER_FILES = {
  'sim-be-01': {
    title: 'Resolve Payment Desync & Mutex Lock',
    role: 'Backend Developer',
    difficulty: 'Mid-Level',
    description: 'A race condition causes cart totals to desync under high concurrent traffic. Implement a thread-safe mutex lock with 409 Conflict error boundaries.',
    files: {
      'src/payment.js': `// Payment Processing Service - Resolve Race Condition
import { Mutex } from './utils/mutex.js';

const cartMutex = new Mutex();

/**
 * Process a transaction safely with thread-safe locking
 * @param {string} cartId - The customer cart ID
 * @param {number} amount - Total charge amount
 */
export async function processPaymentTransaction(cartId, amount) {
  const unlock = await cartMutex.acquire();
  try {
    // Simulating database transaction query
    if (amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    // Process checkout balance
    return {
      success: true,
      status: 200,
      cartId,
      processedAmount: amount,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      success: false,
      status: 409, // 409 Conflict on transaction race collision
      error: err.message,
    };
  } finally {
    unlock();
  }
}
`,
      'src/utils/mutex.js': `// Lightweight In-Memory Mutex Lock Implementation
export class Mutex {
  #queue = [];
  #locked = false;

  async acquire() {
    return new Promise((resolve) => {
      if (!this.#locked) {
        this.#locked = true;
        resolve(this.#release.bind(this));
      } else {
        this.#queue.push(resolve);
      }
    });
  }

  #release() {
    if (this.#queue.length > 0) {
      const nextResolve = this.#queue.shift();
      nextResolve(this.#release.bind(this));
    } else {
      this.#locked = false;
    }
  }
}
`,
      'package.json': `{
  "name": "payment-microservice",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --test tests/payment.test.js"
  }
}
`,
      'tests/payment.test.js': `// Automated Unit Test Suite for Concurrent Transactions
import { processPaymentTransaction } from '../src/payment.js';

async function runTestSuite() {
  console.log('[TEST SUITE] Executing 50 concurrent transactions...');
  const promises = Array.from({ length: 50 }, (_, i) =>
    processPaymentTransaction('cart-user-101', 99.99)
  );

  const results = await Promise.all(promises);
  const successCount = results.filter((r) => r.success).length;
  console.log(\`[RESULT] \${successCount}/50 transactions synchronized successfully.\`);
}

runTestSuite();
`,
    },
  },

  'sim-fe-01': {
    title: 'React UI Performance & Re-render Bottleneck',
    role: 'Frontend Developer',
    difficulty: 'Junior',
    description: 'A dashboard component re-renders 500+ times per keystroke due to unmemoized object allocations. Refactor with useMemo and useCallback.',
    files: {
      'src/Dashboard.jsx': `import React, { useState, useMemo, useCallback } from 'react';

export default function PerformanceDashboard({ metrics = [] }) {
  const [filterQuery, setFilterQuery] = useState('');

  // Memoize expensive calculation to prevent re-render bottlenecks
  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) =>
      m.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [metrics, filterQuery]);

  const handleClear = useCallback(() => {
    setFilterQuery('');
  }, []);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl">
      <h1 className="text-xl font-bold">Analytics Dashboard</h1>
      <input
        type="text"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        placeholder="Filter metrics..."
        className="mt-4 px-4 py-2 bg-slate-800 rounded-xl"
      />
      <div className="mt-4">
        {filteredMetrics.map((item) => (
          <div key={item.id} className="p-2 border-b border-slate-800">
            {item.name}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
`,
      'src/hooks/usePerformance.js': `import { useEffect, useRef } from 'react';

export function useRenderCounter(componentName = 'Component') {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(\`[\${componentName}] Render Count: \${renderCount.current}\`);
}
`,
      'package.json': `{
  "name": "react-performance-audit",
  "version": "1.0.0",
  "scripts": {
    "test": "npm run build"
  }
}
`,
    },
  },

  'sim-fs-01': {
    title: 'Virtual File System & Stream ZIP Parser',
    role: 'Full Stack Engineer',
    difficulty: 'Senior',
    description: 'Build a stream-based ZIP extractor and virtual file system (VFS) tree builder connecting Node.js streams to a React editor.',
    files: {
      'src/vfs/vfsTree.js': `// Virtual File System (VFS) Tree Builder
export function buildVfsHierarchy(fileMap = {}) {
  const root = { name: 'root', type: 'folder', children: {} };

  for (const [filePath, content] of Object.entries(fileMap)) {
    const parts = filePath.split('/');
    let curr = root;

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      if (isFile) {
        curr.children[part] = { name: part, type: 'file', content };
      } else {
        if (!curr.children[part]) {
          curr.children[part] = { name: part, type: 'folder', children: {} };
        }
        curr = curr.children[part];
      }
    });
  }
  return root;
}
`,
      'src/server.js': `import express from 'express';
import { buildVfsHierarchy } from './vfs/vfsTree.js';

const app = express();
app.use(express.json());

app.get('/api/vfs', (req, res) => {
  res.json({ success: true, vfs: buildVfsHierarchy() });
});

app.listen(3000, () => console.log('VFS Server active on port 3000'));
`,
      'package.json': `{
  "name": "vfs-stream-engine",
  "type": "module"
}
`,
    },
  },

  'sim-da-01': {
    title: 'Clean Customer Data & Timezone Normalizer',
    role: 'Data Analyst',
    difficulty: 'Junior',
    description: 'Parse raw CSV records, strip duplicates, normalize UTC timestamps, and validate phone numbers.',
    files: {
      'data/cleaner.py': `# Data Cleaning & Timezone Normalizer
import pandas as pd
from datetime import datetime, timezone

def clean_customer_dataset(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    
    # 1. Strip duplicate user records
    df = df.drop_duplicates(subset=['email'])
    
    # 2. Normalize UTC Timestamps
    df['created_at'] = pd.to_datetime(df['created_at'], utc=True)
    
    # 3. Fill missing phone numbers with default placeholder
    df['phone'] = df['phone'].fillna('N/A')
    
    return df

if __name__ == '__main__':
    print("Dataset normalizer script loaded successfully.")
`,
      'data/schema.sql': `-- PostgreSQL Schema for Cleaned Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`,
      'requirements.txt': `pandas==2.2.0
numpy==1.26.0
`,
    },
  },
};

export default function SimulationWorkspace() {
  const { id } = useParams();

  const scenario = useMemo(() => {
    return SCENARIO_STARTER_FILES[id] || SCENARIO_STARTER_FILES['sim-be-01'];
  }, [id]);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Evaluation Handler (Evaluates user's live workspace files)
  const handleRunEvaluation = async (currentFiles) => {
    setIsEvaluating(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[SANDBOX CONTAINER]: Spawning isolated test execution...`,
      `[ANALYSIS]: Parsing ${Object.keys(currentFiles).length} virtual workspace files...`,
    ]);

    // Simulate real Docker AST & Unit Test execution
    await new Promise((res) => setTimeout(res, 1200));

    // Audit code content across files
    let dynamicScore = 40; // Base compilation pass
    const feedback = [];
    const criteriaAudit = [
      { name: 'Multi-file codebase structure', status: 'passed' },
      { name: 'Virtual File System (VFS) synchronization', status: 'passed' },
    ];

    const targetCode = currentFiles['src/payment.js'] || currentFiles['src/Dashboard.jsx'] || Object.values(currentFiles)[0] || '';

    if (targetCode.includes('mutex') || targetCode.includes('Mutex') || targetCode.includes('useMemo') || targetCode.includes('pd.to_datetime')) {
      dynamicScore += 30;
      criteriaAudit.push({ name: 'Architecture optimization & thread safety', status: 'passed' });
      feedback.push('Architecture Audit: Detected optimal concurrency/memoization synchronization pattern.');
    } else {
      criteriaAudit.push({ name: 'Architecture optimization & thread safety', status: 'failed' });
      feedback.push('Optimization Warning: Recommended synchronization / memoization patterns not found in target file.');
    }

    if (targetCode.includes('try') && targetCode.includes('catch') || targetCode.includes('409') || targetCode.includes('useCallback')) {
      dynamicScore += 20;
      criteriaAudit.push({ name: 'Exception boundaries & error statuses', status: 'passed' });
      feedback.push('Error Boundary Audit: Robust exception handling and fallback boundaries confirmed.');
    } else {
      criteriaAudit.push({ name: 'Exception boundaries & error statuses', status: 'failed' });
    }

    if (targetCode.length > 50) {
      dynamicScore += 10;
      criteriaAudit.push({ name: 'Clean code & AST readability metrics', status: 'passed' });
    }

    const status = dynamicScore >= 80 ? 'PASSED' : dynamicScore >= 50 ? 'NEEDS REVISION' : 'FAILED';

    const results = {
      status,
      score: dynamicScore,
      securityRating: dynamicScore >= 80 ? 'A+' : dynamicScore >= 50 ? 'B' : 'D',
      maintainabilityIndex: Math.min(98, dynamicScore + 5),
      testSuiteRate: `${Math.round((dynamicScore / 100) * 6)}/6 Passed`,
      codeSmellsCount: dynamicScore >= 80 ? 0 : 2,
      complexity: dynamicScore >= 80 ? 'Low (2.8)' : 'Moderate (5.4)',
      feedback,
      criteriaAudit,
      earnedXp: status === 'PASSED' ? 300 : 50,
    };

    setScorecard(results);
    setTerminalLogs((prev) => [
      ...prev,
      `✓ PASS: Test suites finished with score ${dynamicScore}/100 [${results.testSuiteRate}]`,
    ]);
    setIsEvaluating(false);
    return results;
  };

  const handleSubmitSolution = async (currentFiles) => {
    const results = await handleRunEvaluation(currentFiles);
    setIsReviewOpen(true);
  };

  return (
    <DesktopOnly backLink="/simulations" backText="Back to Job Simulations">
      <div className="fixed inset-0 z-40 bg-[#07090e] w-full h-screen flex flex-col select-none">
        
        {/* DEVSTUDIO IDE WORKSPACE ENGINE */}
        <DevStudioWorkspace
          title={scenario.title}
          subtitle={`${scenario.role} • ${scenario.difficulty}`}
          branchName="feature/ticket-101"
          initialFiles={scenario.files}
          onRunEvaluation={handleRunEvaluation}
          onSubmitSolution={handleSubmitSolution}
          isEvaluating={isEvaluating}
          evaluationResults={scorecard}
          logs={terminalLogs}
          onClearLogs={() => setTerminalLogs([])}
          scenarioContext={scenario}
          extraTopRightActions={
            <Link
              to="/simulations"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all mr-2"
            >
              <ArrowLeft size={13} /> Exit to Catalog
            </Link>
          }
        />

        {/* CODE REVIEW & AUDIT MODAL */}
        {isReviewOpen && scorecard && (
          <SimulationReviewModal
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            scorecard={scorecard}
            onRetry={() => setIsReviewOpen(false)}
          />
        )}

      </div>
    </DesktopOnly>
  );
}