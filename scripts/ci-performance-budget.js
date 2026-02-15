#!/usr/bin/env node

const fs = require('node:fs');

const maxFirstLoadKb = Number(process.env.MAX_FIRST_LOAD_JS_KB || 250);
const manifestPath = '.next/build-manifest.json';

if (!fs.existsSync(manifestPath)) {
  console.error(`Missing ${manifestPath}. Run next build before budget check.`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const filesByRoute = manifest.pages || {};
const allFiles = new Set();

function sumSize(files) {
  return files.reduce((total, file) => {
    if (!file.startsWith('static/')) return total;
    const path = `.next/${file}`;
    if (!fs.existsSync(path)) return total;
    allFiles.add(path);
    return total + fs.statSync(path).size;
  }, 0);
}

const failures = [];
for (const [route, files] of Object.entries(filesByRoute)) {
  const kb = sumSize(files) / 1024;
  if (kb > maxFirstLoadKb) {
    failures.push({ route, kb: Number(kb.toFixed(2)) });
  }
}

if (failures.length) {
  console.error(`Performance budget exceeded (${maxFirstLoadKb}KB):`);
  failures.forEach((f) => console.error(`- ${f.route}: ${f.kb}KB`));
  process.exit(1);
}

console.log(`Performance budgets passed. Checked ${Object.keys(filesByRoute).length} routes.`);
