#!/usr/bin/env node

/**
 * GitHub Pages deployment script
 * Handles environment setup and deployment to GitHub Pages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

// Check if gh-pages is installed
try {
  require.resolve('gh-pages');
} catch (error) {
  console.error('❌ gh-pages not found. Installing...');
  execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
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
  console.log('💡 Make sure to set these in your repository secrets or .env file');
}

// Check package.json for homepage field
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.homepage) {
  console.warn('⚠️  No homepage field found in package.json');
  console.log('💡 Add "homepage": "https://yourusername.github.io/repository-name" to package.json');
}

// Build the project
console.log('🔨 Building project...');
try {
  // Set PUBLIC_URL for GitHub Pages
  process.env.PUBLIC_URL = packageJson.homepage || '';
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Deploy to GitHub Pages
console.log('🚀 Deploying to GitHub Pages...');
try {
  const ghPages = require('gh-pages');
  
  await new Promise((resolve, reject) => {
    ghPages.publish('build', {
      branch: 'gh-pages',
      message: `Deploy ${new Date().toISOString()}`,
      dotfiles: true
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  
  console.log('✅ Deployment completed successfully');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('🎉 GitHub Pages deployment complete!');