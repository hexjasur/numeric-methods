import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const patchSrc = path.join(rootDir, 'src-tauri', 'android-patches', 'MainActivity.kt');
const androidTargetDir = path.join(
  rootDir,
  'src-tauri',
  'gen',
  'android',
  'app',
  'src',
  'main',
  'java',
  'com',
  'numericmethods',
  'jksoftware',
);
const androidTargetFile = path.join(androidTargetDir, 'MainActivity.kt');

if (!fs.existsSync(patchSrc)) {
  console.error(`[patch-android] Error: Source patch file not found at ${patchSrc}`);
  process.exit(1);
}

// Ensure target directory exists
fs.mkdirSync(androidTargetDir, { recursive: true });

// Copy patched MainActivity.kt
fs.copyFileSync(patchSrc, androidTargetFile);

console.log(`[patch-android] Successfully applied status bar & window insets patch to:`);
console.log(`  -> ${androidTargetFile}`);
