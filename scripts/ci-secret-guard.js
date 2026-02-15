#!/usr/bin/env node

const { execSync } = require('node:child_process');

const patterns = [
  { name: 'Generic API key assignment', regex: /(?:api[_-]?key|token|secret|password)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{16,}/i },
  { name: 'JWT-like token', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}/ },
  { name: 'OpenAI key', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'Supabase key hint', regex: /(?:SUPABASE|supabase).*(?:service_role|anon|key).*[A-Za-z0-9_-]{16,}/ },
  { name: 'Private key block', regex: /-----BEGIN (?:RSA|OPENSSH|EC|DSA) PRIVATE KEY-----/ },
];

const allowlist = [
  /env\.example$/,
  /\.md$/,
  /\.github\/workflows\//,
  /^\.env(\.|$)/,
  /\.env\.local$/,
];

function getTrackedFiles() {
  const out = execSync('git ls-files', { encoding: 'utf8' });
  return out.split('\n').map((x) => x.trim()).filter(Boolean);
}

function isAllowlisted(file) {
  return allowlist.some((re) => re.test(file));
}

function scan() {
  const files = getTrackedFiles();
  const findings = [];

  for (const file of files) {
    if (isAllowlisted(file)) continue;

    let content;
    try {
      content = require('node:fs').readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      patterns.forEach((pattern) => {
        if (pattern.regex.test(line)) {
          findings.push({ file, line: idx + 1, pattern: pattern.name });
        }
      });
    });
  }

  return findings;
}

const findings = scan();
if (findings.length) {
  console.error('Secret guard detected possible secrets:');
  findings.slice(0, 50).forEach((f) => console.error(`- ${f.file}:${f.line} (${f.pattern})`));
  process.exit(1);
}

console.log('Secret guard passed (tracked files scan).');
