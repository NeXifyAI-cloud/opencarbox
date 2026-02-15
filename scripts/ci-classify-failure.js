#!/usr/bin/env node

const fs = require('node:fs');

const logPath = process.argv[2] || 'logs/workflow.log';
const text = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';

const infraPatterns = [/ECONNRESET/i, /timed out/i, /ENOTFOUND/i, /429/i, /503/i, /network/i];
const lintPatterns = [/eslint/i, /lint/i];
const typePatterns = [/tsc/i, /type check/i, /typescript/i];
const testPatterns = [/vitest/i, /test failed/i, /failing test/i];
const buildPatterns = [/next build/i, /build failed/i, /webpack/i];

const has = (patterns) => patterns.some((p) => p.test(text));

let classification = 'unknown';
if (has(infraPatterns)) classification = 'infra';
else if (has(lintPatterns)) classification = 'lint';
else if (has(typePatterns)) classification = 'typecheck';
else if (has(testPatterns)) classification = 'test';
else if (has(buildPatterns)) classification = 'build';

const summary = {
  classification,
  actionable: classification !== 'infra',
  targetedCommands:
    classification === 'lint'
      ? ['npm run lint']
      : classification === 'typecheck'
        ? ['npm run type-check', 'npm run build']
        : classification === 'test'
          ? ['npm run test -- --shard=1/2', 'npm run test -- --shard=2/2']
          : classification === 'build'
            ? ['npm run type-check', 'npm run build']
            : ['npm run lint', 'npm run type-check', 'npm run test', 'npm run build'],
};

fs.mkdirSync('logs', { recursive: true });
fs.writeFileSync('logs/error-summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
