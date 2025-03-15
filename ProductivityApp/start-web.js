// Load polyfills first
require('./polyfills');

// Then start the Expo CLI
const { spawn } = require('child_process');
const path = require('path');

const expo = spawn('npx', ['expo', 'start', '--web'], {
  stdio: 'inherit',
  shell: true
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
  process.exit(1);
});

expo.on('close', (code) => {
  process.exit(code);
}); 