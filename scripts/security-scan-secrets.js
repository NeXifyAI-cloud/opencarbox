#!/usr/bin/env node
const { execSync } = require('node:child_process');

const suspectPatterns = [
  /(ghp|github_pat)_[A-Za-z0-9_]{20,}/,
  /AIza[0-9A-Za-z\-_]{35}/,
  /(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{20,}/,
  /xox[baprs]-[0-9A-Za-z-]{10,}/,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/
];

const allowedPaths = [
  /^\.env(\.example|\.local)?$/,
  /^env\.example$/,
  /^docs\//,
  /^\.github\/SECRETS_SETUP\.md$/
];

function isAllowed(path) {
  return allowedPaths.some((rx) => rx.test(path));
}

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .map((v) => v.trim())
  .filter(Boolean)
  .filter((f) => !isAllowed(f));

const findings = [];
for (const file of files) {
  let content = '';
  try {
    content = execSync(`git show HEAD:${file}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    continue;
  }
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (/placeholder|example|changeme|your[_-]?token/i.test(line)) return;
    for (const pattern of suspectPatterns) {
      if (pattern.test(line)) {
        findings.push({ file, line: index + 1, pattern: String(pattern) });
        break;
      }
    }
  });
}

if (findings.length > 0) {
  console.error('❌ Potential secrets detected in tracked files:');
  findings.forEach((f) => {
    console.error(`- ${f.file}:${f.line} (${f.pattern})`);
  });
  process.exit(1);
}

console.log(`✅ Secret scan passed (${files.length} tracked files checked).`);
