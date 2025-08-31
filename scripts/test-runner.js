#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Test runner script for portfolio project
const testCommands = {
  all: ['npm', 'test', '--', '--coverage', '--watchAll=false'],
  services: ['npm', 'test', '--', '--testPathPattern=services', '--coverage', '--watchAll=false'],
  contact: ['npm', 'test', '--', '--testPathPattern=Contact', '--coverage', '--watchAll=false'],
  toast: ['npm', 'test', '--', '--testPathPattern=Toast', '--coverage', '--watchAll=false'],
  unit: ['npm', 'test', '--', '--testPathPattern=services|Toast', '--coverage', '--watchAll=false'],
  ci: ['npm', 'run', 'test:ci']
};

const testType = process.argv[2] || 'all';

if (!testCommands[testType]) {
  console.error(`Unknown test type: ${testType}`);
  console.error(`Available options: ${Object.keys(testCommands).join(', ')}`);
  process.exit(1);
}

console.log(`Running ${testType} tests...`);

const child = spawn(testCommands[testType][0], testCommands[testType].slice(1), {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});