import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

// 1. Read package.json
const pkgPath = path.join(rootDir, 'package.json');
const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const pkgVersion: string = pkgContent.version;

// 2. Read src-tauri/tauri.conf.json
const tauriPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
const tauriContent = JSON.parse(fs.readFileSync(tauriPath, 'utf8'));
const tauriVersion: string = tauriContent.version;

// 3. Read src-tauri/Cargo.toml
const cargoPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');
const cargoContent = fs.readFileSync(cargoPath, 'utf8');
const cargoMatch = cargoContent.match(/\[package\][\s\S]*?version\s*=\s*["']([^"']+)["']/);
const cargoVersion: string | null = cargoMatch ? cargoMatch[1] : null;

const args = process.argv.slice(2);

if (args.includes('--print')) {
  if (pkgVersion === tauriVersion && pkgVersion === cargoVersion) {
    console.log(pkgVersion);
    process.exit(0);
  }
}

console.log('--- Multi-Target Version Verification ---');
console.log(`package.json:            ${pkgVersion}`);
console.log(`src-tauri/tauri.conf.json: ${tauriVersion}`);
console.log(`src-tauri/Cargo.toml:     ${cargoVersion ?? 'NOT FOUND'}`);

if (!cargoVersion) {
  console.error('❌ Could not extract version from src-tauri/Cargo.toml');
  process.exit(1);
}

if (pkgVersion !== tauriVersion || pkgVersion !== cargoVersion) {
  console.error('❌ Version mismatch detected! All three configuration files must have identical versions.');
  process.exit(1);
}

console.log(`✅ All target versions are synchronized: v${pkgVersion}`);
process.exit(0);
