#!/usr/bin/env node
const { execSync } = require('node:child_process');

const output = execSync('git ls-files', { encoding: 'utf8' });
const files = output.split('\n').map((f) => f.trim()).filter(Boolean);
const deny = [
  /BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY/,
  /ghp_[A-Za-z0-9]{36}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN PRIVATE KEY-----/,
];

let failed = false;
for (const file of files) {
  if (/^(node_modules|\.next|dist|coverage)\//.test(file)) continue;
  let content = '';
  try {
    content = require('node:fs').readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const rule of deny) {
    if (rule.test(content)) {
      console.error(`Potential secret detected in ${file} via ${rule}`);
      failed = true;
      break;
    }
  }
}

if (failed) process.exit(1);
console.log('Secret guard passed');
