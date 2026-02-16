import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MASTER_PLAN_PATH = resolve(process.cwd(), 'docs/tasks/master_plan.md');
const STATUS_REPORT_PATH = resolve(process.cwd(), 'STATUS_REPORT.md');

const masterPlanContent = readFileSync(MASTER_PLAN_PATH, 'utf8');
const statusLines = masterPlanContent.match(/- \*\*Status:\*\* .+/g) ?? [];

const counts = statusLines.reduce(
  (acc, line) => {
    if (line.includes('ERLEDIGT')) acc.done += 1;
    else if (line.includes('IN ARBEIT')) acc.inProgress += 1;
    else if (line.includes('OFFEN')) acc.open += 1;

    return acc;
  },
  { done: 0, inProgress: 0, open: 0 }
);

const total = counts.done + counts.inProgress + counts.open;
const completionRate = total > 0 ? Math.round((counts.done / total) * 100) : 0;
const generatedAt = new Date().toISOString().slice(0, 10);

const generatedSection = [
  '<!-- plan-status:start -->',
  '## 📌 Plan-Status (automatisch aus `docs/tasks/master_plan.md`)',
  '',
  `- ✅ **Erledigt:** ${counts.done}`,
  `- 🔄 **In Arbeit:** ${counts.inProgress}`,
  `- ⬜ **Offen:** ${counts.open}`,
  `- 📊 **Gesamtfortschritt:** ${completionRate}% (${counts.done}/${total})`,
  `- 🗓️ **Zuletzt aktualisiert:** ${generatedAt}`,
  '',
  '> Quelle: `docs/tasks/master_plan.md` ist die einzige Truth-Quelle für Task-Status.',
  '<!-- plan-status:end -->',
].join('\n');

const statusReportContent = readFileSync(STATUS_REPORT_PATH, 'utf8');
const sectionRegex = /<!-- plan-status:start -->[\s\S]*?<!-- plan-status:end -->/;

const nextStatusReportContent = sectionRegex.test(statusReportContent)
  ? statusReportContent.replace(sectionRegex, generatedSection)
  : statusReportContent.replace(
      /^# .*\n\n/,
      (header) => `${header}${generatedSection}\n\n`
    );

writeFileSync(STATUS_REPORT_PATH, nextStatusReportContent, 'utf8');

console.log(
  `Plan-Status aktualisiert: erledigt=${counts.done}, in_arbeit=${counts.inProgress}, offen=${counts.open}`
);
