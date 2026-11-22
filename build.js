const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Building Happy Birthday Celebration Website for Vercel ===');

const projectRoot = __dirname;
const frontendDir = path.join(projectRoot, 'frontend');
const frontendDist = path.join(frontendDir, 'dist');
const rootDist = path.join(projectRoot, 'dist');

// Determine package manager (prefer pnpm, fallback to npm)
let usePnpm = false;
try {
  execSync('pnpm --version', { stdio: 'ignore' });
  usePnpm = true;
} catch (e) {
  usePnpm = false;
}

console.log(`Using package manager: ${usePnpm ? 'pnpm' : 'npm'}`);

try {
  if (usePnpm) {
    console.log('Running pnpm install in frontend...');
    execSync('pnpm install', { cwd: frontendDir, stdio: 'inherit' });
    console.log('Running pnpm run build in frontend...');
    execSync('pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
  } else {
    console.log('Running npm install in frontend...');
    execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
    console.log('Running npm run build in frontend...');
    execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
  }

  // Copy dist to project root for universal static hosting
  if (fs.existsSync(frontendDist)) {
    console.log('Copying frontend/dist to root dist/ for static hosting...');
    if (fs.existsSync(rootDist)) {
      fs.rmSync(rootDist, { recursive: true, force: true });
    }
    fs.cpSync(frontendDist, rootDist, { recursive: true });
    console.log('Root dist/ created successfully with index.html and assets!');
  } else {
    console.error('Warning: frontend/dist was not found after build!');
  }

  console.log('=== Build completed successfully! ===');
} catch (err) {
  console.error('Build failed with error:', err.message);
  process.exit(1);
}
