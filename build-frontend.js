
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting frontend-only build...');

// Create backup directory
const backupDir = path.join(__dirname, 'backend-backup');
const apiDir = path.join(__dirname, 'src', 'api');

// Check if API directory exists
if (fs.existsSync(apiDir)) {
  console.log('📦 Backing up backend files...');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Move API directory to backup
  fs.renameSync(apiDir, path.join(backupDir, 'api'));
  
  try {
    console.log('🔨 Building frontend...');
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Frontend build successful!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  } finally {
    console.log('🔄 Restoring backend files...');
    // Restore API directory
    fs.renameSync(path.join(backupDir, 'api'), apiDir);
    
    // Clean up backup directory
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
  }
} else {
  console.log('🔨 Building frontend (no backend files found)...');
  try {
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Frontend build successful!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}
