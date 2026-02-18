#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const workflowDir = path.join(repoRoot, '.github', 'workflows');
const manifestPath = path.join(repoRoot, 'NOTES', 'automation-manifest.md');

if (!fs.existsSync(manifestPath)) {
  console.error('Missing NOTES/automation-manifest.md');
  process.exit(1);
}

const manifest = fs.readFileSync(manifestPath, 'utf8');
const workflowFiles = fs
  .readdirSync(workflowDir)
  .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))
  .sort();

const missing = workflowFiles.filter((file) => !manifest.includes(`\`${file}\``));

if (missing.length > 0) {
  console.error('Undocumented workflows in NOTES/automation-manifest.md:');
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(`Manifest check passed for ${workflowFiles.length} workflow files.`);
