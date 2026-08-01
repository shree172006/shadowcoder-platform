import { spawn } from 'child_process';
import path from 'path';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\n======================================================');
console.log('🚀 Starting ShadowCoder Platform Services...');
console.log('======================================================\n');

/**
 * Spawns a child process with color-coded prefix formatting
 */
function runService(name, command, args, cwd, colorCode) {
  const fullCommand = `${command} ${args.join(' ')}`;
  const child = spawn(fullCommand, {
    cwd: path.resolve(process.cwd(), cwd),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m`;

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line) console.log(`${prefix} ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line) console.error(`${prefix} ${line}`);
    });
  });

  child.on('close', (code) => {
    console.log(`${prefix} Service exited with code ${code}`);
  });

  return child;
}

// 1. Start Server (Express API & WebSockets - Port 5000)
const serverProc = runService('SERVER', npmCmd, ['run', 'dev'], 'server', '36'); // Cyan

// 2. Start Client (Vite React - Port 5173)
const clientProc = runService('CLIENT', npmCmd, ['run', 'dev'], 'client', '32'); // Green

// Handle graceful termination (Ctrl + C)
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ShadowCoder Platform services...');
  serverProc.kill();
  clientProc.kill();
  process.exit();
});
