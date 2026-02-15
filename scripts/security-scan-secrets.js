#!/usr/bin/env node

const { execSync } = require('node:child_process');

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean)
  .filter((file) => !file.startsWith('node_modules/'))
  .filter((file) => !file.startsWith('docs/'))
  .filter((file) => !file.endsWith('.md'))
  .filter((file) => !file.startsWith('.env'));


const patterns = [
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'GitHub token', regex: /ghp_[A-Za-z0-9]{36}/g },
  { name: 'Stripe live key', regex: /sk_live_[A-Za-z0-9]{24,}/g },
  { name: 'Supabase service role key', regex: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g },
  { name: 'Private key marker', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
];

const fs = require('node:fs');
let findings = [];

for (const file of files) {
  if (file.startsWith('.git/')) continue;

  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const pattern of patterns) {
    const matches = [...content.matchAll(pattern.regex)];
    for (const match of matches) {
      const index = match.index ?? 0;
      const line = content.slice(0, index).split('\n').length;
      findings.push(`${file}:${line} ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error('Potential secrets detected:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Secret scan passed (${files.length} tracked files scanned).`);
