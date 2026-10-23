// Simple zero-dependency development runner that starts backend and frontend simultaneously
const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[35m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[33m%s\x1b[0m', '  👑 Royal Vastra — Premium Men\'s Ethnic Wear');
console.log('\x1b[36m%s\x1b[0m', '  Starting Express Backend (Port 5000) & Vite Frontend (Port 5173)...');
console.log('\x1b[35m%s\x1b[0m', '═══════════════════════════════════════════════════════════\n');

// Start backend
const backend = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

// Start frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down Royal Vastra services...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
