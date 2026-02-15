#!/usr/bin/env node
const fs = require('node:fs');

const logPath = process.argv[2] || 'logs/workflow.log';
const text = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';

function has(re) {
  return re.test(text);
}

let kind = 'unknown';
if (has(/ESLint|eslint|next lint failed/i)) kind = 'lint';
else if (has(/Type error|tsc|type-check|TS\d{4}/i)) kind = 'typecheck';
else if (has(/vitest|jest|failing test|Test Files\s+\d+\s+failed/i)) kind = 'test';
else if (has(/next build|Build failed|Failed to compile/i)) kind = 'build';
else if (has(/timed out|ECONNRESET|socket hang up|502|503|Service Unavailable|runner|artifact/i)) kind = 'infra';

const summary = { kind, generatedAt: new Date().toISOString() };
fs.mkdirSync('logs', { recursive: true });
fs.writeFileSync('logs/error-summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
