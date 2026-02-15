#!/usr/bin/env tsx

import { execSync } from 'node:child_process';

interface BranchInfo {
  name: string;
  mergedIntoCurrent: boolean;
}

function runGit(command: string): string {
  return execSync(`git ${command}`, { encoding: 'utf-8' }).trim();
}

function getCurrentBranch(): string {
  return runGit('rev-parse --abbrev-ref HEAD');
}

function getLocalBranches(currentBranch: string): BranchInfo[] {
  const branches = runGit("for-each-ref --format='%(refname:short)' refs/heads")
    .split('\n')
    .map((branch) => branch.trim().replace(/^'+|'+$/g, ''))
    .filter((branch) => branch.length > 0 && branch !== currentBranch);

  return branches.map((name) => {
    let mergedIntoCurrent = false;

    try {
      execSync(`git merge-base --is-ancestor ${name} ${currentBranch}`);
      mergedIntoCurrent = true;
    } catch {
      mergedIntoCurrent = false;
    }

    return { name, mergedIntoCurrent };
  });
}

function main(): void {
  const applyChanges = process.argv.includes('--apply');
  const currentBranch = getCurrentBranch();
  const inactiveBranches = getLocalBranches(currentBranch);

  console.log(`🌿 Aktiver Branch: ${currentBranch}`);

  if (inactiveBranches.length === 0) {
    console.log('✅ Keine nicht-aktiven lokalen Branches gefunden.');
    return;
  }

  console.log(`🔎 Gefundene nicht-aktive Branches: ${inactiveBranches.length}`);

  const mergedBranches = inactiveBranches.filter((branch) => branch.mergedIntoCurrent);
  const unmergedBranches = inactiveBranches.filter((branch) => !branch.mergedIntoCurrent);

  if (mergedBranches.length > 0) {
    console.log(`🧹 Bereits gemergte Branches: ${mergedBranches.map((branch) => branch.name).join(', ')}`);

    if (applyChanges) {
      mergedBranches.forEach((branch) => {
        runGit(`branch -d ${branch.name}`);
        console.log(`  🗑️  Gelöscht: ${branch.name}`);
      });
    } else {
      console.log('  ℹ️  Dry-Run: Mit --apply werden diese Branches gelöscht.');
    }
  }

  if (unmergedBranches.length > 0) {
    console.log('⚠️ Nicht gemergte Branches (manuelle Prüfung erforderlich):');
    unmergedBranches.forEach((branch) => {
      console.log(`  - ${branch.name}`);
    });
  }

  if (!applyChanges) {
    console.log('💡 Keine Änderungen durchgeführt (Dry-Run).');
  }
}

main();
