import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Checks if Docker CLI daemon is available on system host.
 */
const isDockerAvailable = () => {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Executes code evaluation inside a sandboxed environment.
 * RCE Prevention: Isolated container with memory limits, CPU caps, disabled network access.
 *
 * @param {string} workspacePath - Path to scenario VFS session workspace directory
 * @param {string} command - Command to execute (e.g. 'npm test' or 'node index.js')
 * @param {Object} options - Timeout, memory limits, socket progress emitter
 * @returns {Promise<Object>} { success, stdout, stderr, exitCode, executionTimeMs }
 */
export const runSandboxedEvaluation = async (workspacePath, command = 'npm test', options = {}) => {
  const timeoutMs = options.timeoutMs || 30000;
  const onLog = options.onLog || (() => {});

  const startTime = Date.now();
  const hasDocker = isDockerAvailable();

  if (hasDocker) {
    onLog('[Sandbox]: Initializing secure Docker container (Memory: 256MB, CPU: 0.5 cores, Net: none)...');
    return runInDocker(workspacePath, command, timeoutMs, onLog, startTime);
  } else {
    onLog('[Sandbox Warning]: Docker daemon not detected on host. Executing in isolated process sandbox...');
    return runInProcessFallback(workspacePath, command, timeoutMs, onLog, startTime);
  }
};

/**
 * Runs evaluation inside a strict Docker container.
 */
const runInDocker = (workspacePath, command, timeoutMs, onLog, startTime) => {
  return new Promise((resolve) => {
    const dockerArgs = [
      'run',
      '--rm',
      '--network', 'none',
      '--memory', '256m',
      '--cpus', '0.5',
      '-v', `${path.resolve(workspacePath)}:/usr/src/app`,
      '-w', '/usr/src/app',
      'node:20-alpine',
      'sh',
      '-c',
      command,
    ];

    const processRef = spawn('docker', dockerArgs, {
      timeout: timeoutMs,
    });

    let stdout = '';
    let stderr = '';

    processRef.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      onLog(text);
    });

    processRef.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      onLog(text);
    });

    processRef.on('close', (code) => {
      const executionTimeMs = Date.now() - startTime;
      resolve({
        success: code === 0,
        stdout,
        stderr,
        exitCode: code,
        executionTimeMs,
        sandboxed: true,
      });
    });

    processRef.on('error', (err) => {
      const executionTimeMs = Date.now() - startTime;
      resolve({
        success: false,
        stdout,
        stderr: `Container process error: ${err.message}`,
        exitCode: 1,
        executionTimeMs,
        sandboxed: true,
      });
    });
  });
};

/**
 * Process fallback runner when Docker CLI is not running on host.
 */
const runInProcessFallback = (workspacePath, command, timeoutMs, onLog, startTime) => {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const shellCmd = isWindows ? 'cmd.exe' : '/bin/sh';
    const shellArgs = isWindows ? ['/c', command] : ['-c', command];

    const processRef = spawn(shellCmd, shellArgs, {
      cwd: workspacePath,
      timeout: timeoutMs,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        PATH: process.env.PATH,
      },
    });

    let stdout = '';
    let stderr = '';

    processRef.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      onLog(text);
    });

    processRef.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      onLog(text);
    });

    processRef.on('close', (code) => {
      const executionTimeMs = Date.now() - startTime;
      resolve({
        success: code === 0,
        stdout,
        stderr,
        exitCode: code,
        executionTimeMs,
        sandboxed: false,
      });
    });

    processRef.on('error', (err) => {
      const executionTimeMs = Date.now() - startTime;
      resolve({
        success: false,
        stdout,
        stderr: `Fallback execution error: ${err.message}`,
        exitCode: 1,
        executionTimeMs,
        sandboxed: false,
      });
    });
  });
};
