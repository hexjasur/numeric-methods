import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`Syncing version v${version}...`);

const filesToUpdate = [
  {
    path: 'index.html',
    regex: /(SONLI\s+USULLAR\s*<span[^>]*>)v[\d.]+(<\/span>)/i,
    replacement: `$1v${version}$2`
  },
  {
    path: 'src/about.html',
    regex: /(color:#00f2ff">)v[\d.]+(<\/div>)/i,
    replacement: `$1v${version}$2`
  },
  {
    path: 'sw.js',
    regex: /(const CACHE_VERSION = ')v[\d.]+(';)/i,
    replacement: `$1v${version}$2`
  }
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(file.regex, file.replacement);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Updated ${file.path}`);
    } else {
      console.log(`ℹ️ ${file.path} is already up to date or pattern not found.`);
    }
  } else {
    console.warn(`⚠️ File not found: ${file.path}`);
  }
});
