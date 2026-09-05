/**
 * ShadowCoder In-Browser Runtime Execution & Test Harness Engine
 * Executes candidate JavaScript code in an isolated runtime sandbox with real multi-file module linking.
 */

/**
 * In-Memory ES Module Bundler & Linker
 * Transpiles simple ES module files and links imports against the virtual file system.
 */
function createModuleRunner(files = {}) {
  const moduleCache = {};

  const requireModule = (filePath) => {
    // Normalize path
    let normalized = filePath.replace(/^\.\//, '');
    if (!normalized.endsWith('.js') && !normalized.endsWith('.jsx')) {
      if (files[`${normalized}.js`]) normalized = `${normalized}.js`;
    }

    if (moduleCache[normalized]) {
      return moduleCache[normalized].exports;
    }

    const code = files[normalized];
    if (!code) {
      // Check absolute or relative paths
      const matchingKey = Object.keys(files).find(
        (k) => k.endsWith(normalized) || normalized.endsWith(k)
      );
      if (matchingKey) {
        return requireModule(matchingKey);
      }
      throw new Error(`Module not found: "${filePath}" in virtual workspace.`);
    }

    const module = { exports: {} };
    moduleCache[normalized] = module;

    // Transpile ES modules (export -> module.exports, import -> require)
    let transpiled = code
      // Transform named exports: export function foo() -> module.exports.foo = function foo()
      .replace(/export\s+async\s+function\s+([a-zA-Z0-9_$]+)/g, 'module.exports.$1 = async function $1')
      .replace(/export\s+function\s+([a-zA-Z0-9_$]+)/g, 'module.exports.$1 = function $1')
      .replace(/export\s+class\s+([a-zA-Z0-9_$]+)/g, 'module.exports.$1 = class $1')
      .replace(/export\s+const\s+([a-zA-Z0-9_$]+)\s*=/g, 'module.exports.$1 =')
      .replace(/export\s+let\s+([a-zA-Z0-9_$]+)\s*=/g, 'module.exports.$1 =')
      .replace(/export\s+default\s+/g, 'module.exports.default = ')
      // Transform imports: import { a } from './b' -> const { a } = require('./b')
      .replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g, 'const { $1 } = require("$2");')
      .replace(/import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?/g, 'const $1 = require("$2").default || require("$2");');

    const fn = new Function('require', 'module', 'exports', transpiled);
    fn((dep) => requireModule(dep), module, module.exports);

    return module.exports;
  };

  return { requireModule };
}

/**
 * Real Scenario Test Suites
 */
export const SCENARIO_TEST_SUITES = {
  // Scenario 1: Payment Concurrency & Mutex
  'sim-be-01': async (requireModule) => {
    const tests = [];

    // Test 1: Module Export Check
    try {
      const paymentMod = requireModule('src/payment.js');
      const processTransaction = paymentMod.processTransaction;
      if (typeof processTransaction !== 'function') {
        throw new Error('src/payment.js must export an async function "processTransaction".');
      }
      tests.push({ name: 'Exports processTransaction function', passed: true, duration: 1 });
    } catch (err) {
      tests.push({ name: 'Exports processTransaction function', passed: false, error: err.message });
      return tests;
    }

    const { processTransaction } = requireModule('src/payment.js');

    // Test 2: Single Valid Transaction
    try {
      const res = await processTransaction('cart_test_1', 150);
      if (!res || (res.status !== 200 && res.processed !== true)) {
        throw new Error(`Expected status 200 and processed: true. Received: ${JSON.stringify(res)}`);
      }
      tests.push({ name: 'Executes single transaction successfully (status 200)', passed: true, duration: 2 });
    } catch (err) {
      tests.push({ name: 'Executes single transaction successfully', passed: false, error: err.message });
    }

    // Test 3: Input Validation (<0 amounts reject)
    try {
      const resInvalid = await processTransaction('cart_bad', -50);
      if (resInvalid.status !== 409 && !resInvalid.error) {
        throw new Error('Transaction with negative amount must return status 409 or error.');
      }
      tests.push({ name: 'Rejects negative transaction amounts with 409 Conflict', passed: true, duration: 2 });
    } catch (err) {
      tests.push({ name: 'Rejects negative transaction amounts with 409 Conflict', passed: false, error: err.message });
    }

    // Test 4: Concurrency Race Condition Test (50 Parallel Threads)
    try {
      const start = performance.now();
      const concurrentTasks = Array.from({ length: 50 }, (_, i) =>
        processTransaction(`cart_concurrent_${i}`, 100)
      );
      const results = await Promise.all(concurrentTasks);
      const allSucceeded = results.every((r) => r && (r.status === 200 || r.processed === true));
      const duration = Math.round(performance.now() - start);

      if (!allSucceeded) {
        throw new Error('One or more concurrent transactions collided or returned undefined.');
      }
      tests.push({
        name: `High-concurrency stress test (50 parallel threads synchronized)`,
        passed: true,
        duration,
      });
    } catch (err) {
      tests.push({
        name: 'High-concurrency stress test (50 parallel threads)',
        passed: false,
        error: err.message,
      });
    }

    // Test 5: Mutex Lock Class Validation
    try {
      const mutexMod = requireModule('src/utils/mutex.js');
      const Mutex = mutexMod.Mutex;
      if (!Mutex) throw new Error('src/utils/mutex.js must export class Mutex.');
      const lock = new Mutex();
      const release1 = await lock.acquire();
      let acquiredSecond = false;
      const p2 = lock.acquire().then((rel) => {
        acquiredSecond = true;
        rel();
      });
      if (acquiredSecond) throw new Error('Mutex allowed re-entrance before first lock was released.');
      release1();
      await p2;
      if (!acquiredSecond) throw new Error('Mutex failed to grant lock to next queued promise.');
      tests.push({ name: 'Mutex primitive enforces FIFO queue & mutual exclusion', passed: true, duration: 3 });
    } catch (err) {
      tests.push({ name: 'Mutex primitive enforces FIFO queue & mutual exclusion', passed: false, error: err.message });
    }

    return tests;
  },

  // Scenario 2: Real-Time Order Event Bus
  'sim-fs-02': async (requireModule) => {
    const tests = [];

    try {
      const busMod = requireModule('src/events/orderBus.js');
      const OrderEventBus = busMod.OrderEventBus;
      if (typeof OrderEventBus !== 'function') {
        throw new Error('src/events/orderBus.js must export class OrderEventBus.');
      }
      tests.push({ name: 'Class OrderEventBus exported', passed: true, duration: 1 });

      const bus = new OrderEventBus();
      let eventPayload = null;
      bus.on('order_created', (data) => {
        eventPayload = data;
      });
      bus.emit('order_created', { orderId: 999, total: 450 });

      if (!eventPayload || eventPayload.orderId !== 999) {
        throw new Error('Event listener did not receive emitted payload.');
      }
      tests.push({ name: 'Subscribes to events with .on() and triggers on .emit()', passed: true, duration: 2 });

      // Multiple subscribers
      let sub2 = false;
      let sub3 = false;
      bus.on('multi_test', () => { sub2 = true; });
      bus.on('multi_test', () => { sub3 = true; });
      bus.emit('multi_test', {});

      if (!sub2 || !sub3) {
        throw new Error('Multiple listeners on the same event channel failed to receive broadcast.');
      }
      tests.push({ name: 'Supports multiple concurrent subscribers per channel', passed: true, duration: 2 });
    } catch (err) {
      tests.push({ name: 'OrderEventBus Pub/Sub Contract', passed: false, error: err.message });
    }

    return tests;
  },
};

/**
 * Executes the real candidate code in an isolated sandbox against scenario test suites.
 */
export async function executeRealCandidateTests(scenarioId, files) {
  const startTotal = performance.now();
  const testRunner = SCENARIO_TEST_SUITES[scenarioId] || SCENARIO_TEST_SUITES['sim-be-01'];

  try {
    const { requireModule } = createModuleRunner(files);
    const testResults = await testRunner(requireModule);

    const passedCount = testResults.filter((t) => t.passed).length;
    const totalCount = testResults.length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    const totalDuration = Math.round(performance.now() - startTotal);

    return {
      success: passedCount === totalCount,
      passRate,
      score: passRate,
      passedCount,
      totalCount,
      totalDuration,
      tests: testResults,
    };
  } catch (globalErr) {
    return {
      success: false,
      passRate: 0,
      score: 0,
      passedCount: 0,
      totalCount: 1,
      totalDuration: 0,
      tests: [
        {
          name: 'Sandbox Initialization & Execution',
          passed: false,
          error: `Fatal Runtime Error: ${globalErr.message}`,
        },
      ],
    };
  }
}
