#!/usr/bin/env node

/**
 * Vercel deployment script
 * Handles environment setup and deployment to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment...');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Vercel CLI not found. Installing...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Check for required environment variables
const requiredEnvVars = [
  'REACT_APP_EMAILJS_SERVICE_ID',
  'REACT_APP_EMAILJS_TEMPLATE_ID',
  'REACT_APP_EMAILJS_PUBLIC_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
  console.log('💡 Make sure to set these in your Vercel project settings or .env file');
}

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel...');
try {
  const deployCommand = process.argv.includes('--prod') ? 'vercel --prod' : 'vercel';
  execSync(deployCommand, { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

console.log('🎉 Vercel deployment complete!');