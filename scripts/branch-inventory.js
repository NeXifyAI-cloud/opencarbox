#!/usr/bin/env node
const { execSync } = require('node:child_process');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function safeRun(cmd) {
  try {
    return run(cmd);
  } catch {
    return '';
  }
}

safeRun('git fetch --all --prune');
const refsRaw = safeRun("git for-each-ref --format='%(refname:short)' refs/remotes/origin");
const refs = refsRaw ? refsRaw.split('\n').filter(Boolean) : [];
const branches = refs
  .filter((b) => b !== 'origin/HEAD')
  .filter((b) => !['origin/main', 'origin/master'].includes(b))
  .filter((b) => !b.startsWith('origin/dependabot/'));

const mainRef = refs.includes('origin/main') ? 'origin/main' : refs.includes('origin/master') ? 'origin/master' : '';
const now = new Date();
const report = [];

for (const branch of branches) {
  const lastCommitDate = safeRun(`git log -1 --format=%cI ${branch}`);
  const daysOld = lastCommitDate
    ? Math.floor((now.getTime() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const activity = daysOld !== null && daysOld <= 30 ? 'active' : 'inactive';
  const type = branch.replace('origin/', '').split('/')[0] || 'other';

  let behindMain = null;
  if (mainRef) {
    const distance = safeRun(`git rev-list --left-right --count ${branch}...${mainRef}`);
    const parts = distance.split('\t');
    behindMain = parts.length === 2 ? Number(parts[1]) : null;
  }

  report.push({ branch, type, activity, daysOld, behindMain });
}

report.sort((a, b) => {
  const aBehind = a.behindMain ?? Number.MAX_SAFE_INTEGER;
  const bBehind = b.behindMain ?? Number.MAX_SAFE_INTEGER;
  return aBehind - bBehind;
});

console.log(JSON.stringify({ generatedAt: now.toISOString(), mainRef, branches: report }, null, 2));
