#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const budgetMb = Number(process.env.CI_PERF_BUDGET_MB || '350');
const targetDir = path.join(process.cwd(), '.next');

function directorySizeBytes(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += directorySizeBytes(fullPath);
    } else if (entry.isFile()) {
      total += fs.statSync(fullPath).size;
    }
  }
  return total;
}

if (!fs.existsSync(targetDir)) {
  console.warn('⚠️ .next directory not found. Run build before performance budget check.');
  process.exit(0);
}

const sizeMb = directorySizeBytes(targetDir) / (1024 * 1024);
console.log(`ℹ️ Build artifact size: ${sizeMb.toFixed(2)} MB (budget ${budgetMb} MB)`);

if (sizeMb > budgetMb) {
  console.error(`❌ Performance budget exceeded by ${(sizeMb - budgetMb).toFixed(2)} MB.`);
  process.exit(1);
}

console.log('✅ Performance budget passed.');
