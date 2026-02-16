import { execSync } from 'node:child_process';
import { getAiEnv } from '../src/lib/ai/env';

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function main() {
  getAiEnv();

  const base = parseArg('--base');
  const head = parseArg('--head');

  if (!base || !head) {
    throw new Error('Usage: tsx tools/ai_merge_conflicts.ts --base <base-ref> --head <head-ref>');
  }

  execSync(`git checkout ${head}`, { stdio: 'inherit' });
  execSync(`git merge ${base}`, { stdio: 'inherit' });
}

main();
