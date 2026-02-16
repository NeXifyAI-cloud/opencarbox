import fs from 'node:fs';
import path from 'node:path';

const reportPath = process.argv[2] ?? 'ci-report.log';
const backlogPath = path.resolve('NOTES/backlog.md');

if (!fs.existsSync(reportPath)) {
  console.log(`No report found at ${reportPath}. Nothing to do.`);
  process.exit(0);
}

const report = fs.readFileSync(reportPath, 'utf8');
const tasks: string[] = [];

if (report.includes('eslint') || report.includes('ESLint')) {
  tasks.push('- [ ] Fix linting regressions from latest CI run.');
}
if (report.includes('TypeScript') || report.includes('tsc')) {
  tasks.push('- [ ] Resolve TypeScript type-check errors found in CI.');
}
if (report.includes('FAIL') || report.includes('failed')) {
  tasks.push('- [ ] Stabilize failing tests; isolate flaky test cases.');
}
if (report.includes('build')) {
  tasks.push('- [ ] Investigate build pipeline warnings/errors and reduce build time.');
}

if (tasks.length === 0) {
  console.log('No actionable items detected.');
  process.exit(0);
}

const timestamp = new Date().toISOString();
const appendBlock = `\n\n## Auto-Improve ${timestamp}\n${tasks.join('\n')}\n`;
fs.appendFileSync(backlogPath, appendBlock, 'utf8');
console.log(`Appended ${tasks.length} tasks to ${backlogPath}`);
