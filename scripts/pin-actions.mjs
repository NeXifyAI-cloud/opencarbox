import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const wfDir = '.github/workflows';
const files = fs.readdirSync(wfDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
const actionRef = /uses:\s*((?:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?))@([A-Za-z0-9_.\/-]+)/g;

for (const file of files) {
  const full = path.join(wfDir, file);
  let content = fs.readFileSync(full, 'utf8');
  const replacements = [];
  let match;
  while ((match = actionRef.exec(content)) !== null) {
    const [, action, ref] = match;
    if (/^[a-f0-9]{40}$/i.test(ref)) continue;
    const repo = action.split('/').slice(0, 2).join('/');
    const sha = execSync(`git ls-remote https://github.com/${repo} refs/tags/${ref} refs/heads/${ref}`, { encoding: 'utf8' })
      .split('\n')[0]
      .split('\t')[0]
      .trim();
    if (!sha) continue;
    replacements.push({ from: `${action}@${ref}`, to: `${action}@${sha}` });
  }
  for (const r of replacements) {
    content = content.replaceAll(r.from, r.to);
  }
  fs.writeFileSync(full, content);
}
console.log('Pinned actions update complete.');
