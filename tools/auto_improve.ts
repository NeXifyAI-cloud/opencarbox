import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAiEnv } from '../src/lib/ai/env';

function main() {
  getAiEnv();

  const timestamp = new Date().toISOString();
  const backlogPath = resolve(process.cwd(), 'NOTES/backlog.md');

  appendFileSync(
    backlogPath,
    `\n- [ ] Auto-improve run ${timestamp}: review latest CI failures and update docs/runbook accordingly.\n`,
  );

  console.log(`Updated backlog: ${backlogPath}`);
}

main();
