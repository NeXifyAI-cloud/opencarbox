import { execSync } from 'node:child_process';

const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main';
let diff = '';
try {
  diff = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' });
} catch {
  diff = execSync('git diff --name-only HEAD~1...HEAD', { encoding: 'utf8' });
}
const files = diff.split('\n').map((f) => f.trim()).filter(Boolean);
const forbidden = /^(prisma\/migrations\/|supabase\/migrations\/|\.env(\.|$))/;
const bad = files.filter((f) => forbidden.test(f));
if (bad.length) {
  console.error(`Forbidden paths modified: ${bad.join(', ')}`);
  process.exit(1);
}
console.log('Forbidden path guard passed');
