#!/usr/bin/env node

/**
 * Build optimization script for portfolio-react
 * This script runs after the build process to optimize the output
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, '..', 'build');

/**
 * Analyze bundle size if requested
 */
function analyzeBundleSize() {
  if (process.env.ANALYZE_BUNDLE === 'true') {
    console.log('📊 Analyzing bundle size...');
    try {
      execSync('npx webpack-bundle-analyzer build/static/js/*.js --mode server --port 8888', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      console.warn('⚠️  Bundle analysis failed:', error.message);
    }
  }
}

/**
 * Generate build report
 */
function generateBuildReport() {
  const staticDir = path.join(buildDir, 'static');
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    files: {}
  };

  if (fs.existsSync(staticDir)) {
    // Analyze JS files
    const jsDir = path.join(staticDir, 'js');
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
      report.files.js = jsFiles.map(file => {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        };
      });
    }

    // Analyze CSS files
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
      report.files.css = cssFiles.map(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024 * 100) / 100
        };
      });
    }
  }

  fs.writeFileSync(path.join(buildDir, 'build-report.json'), JSON.stringify(report, null, 2));
  console.log('📋 Generated build report');
}

function optimizeBuild() {
  console.log('🚀 Starting build optimization...');

  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Add security headers to index.html
  const indexPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add meta tags for security and performance
    const securityMetas = `
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">`;
    
    indexContent = indexContent.replace('<head>', `<head>${securityMetas}`);
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Added security headers to index.html');
  }

  // Create _headers file for Netlify
  const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  
/static/js/*
  Cache-Control: public, max-age=31536000, immutable
  
/static/css/*
  Cache-Control: public, max-age=31536000, immutable
  
/static/media/*
  Cache-Control: public, max-age=31536000, immutable`;

  fs.writeFileSync(path.join(buildDir, '_headers'), headersContent);
  console.log('✅ Created _headers file for Netlify');

  // Create .htaccess file for Apache servers
  const htaccessContent = `# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache Control
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</filesMatch>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Fallback for React Router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

  fs.writeFileSync(path.join(buildDir, '.htaccess'), htaccessContent);
  console.log('✅ Created .htaccess file for Apache servers');

  console.log('🎉 Build optimization completed successfully!');
}

// Run optimization
optimizeBuild();

// Generate build report
generateBuildReport();

// Analyze bundle size if requested
analyzeBundleSize();