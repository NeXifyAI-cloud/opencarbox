#!/usr/bin/env node
const fs = require('node:fs');

const maxBundleKb = Number(process.env.MAX_BUNDLE_KB || 900);
const statsPath = '.next/analyze/client.json';
if (!fs.existsSync(statsPath)) {
  console.log('No bundle stats found, skipping performance budget check.');
  process.exit(0);
}
const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
const totalBytes = (stats.assets || []).reduce((sum, a) => sum + (a.size || 0), 0);
const totalKb = totalBytes / 1024;
if (totalKb > maxBundleKb) {
  console.error(`Bundle budget exceeded: ${totalKb.toFixed(1)}kb > ${maxBundleKb}kb`);
  process.exit(1);
}
console.log(`Bundle budget ok: ${totalKb.toFixed(1)}kb <= ${maxBundleKb}kb`);
