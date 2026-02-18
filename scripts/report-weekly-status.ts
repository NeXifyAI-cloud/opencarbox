import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type TaskStatus =
  | 'OFFEN'
  | 'IN ARBEIT'
  | 'ERLEDIGT'
  | 'REVIEW'
  | 'ABGEBROCHEN'
  | 'PAUSIERT'
  | 'UNBEKANNT';

type Priority = 'KRITISCH' | 'HOCH' | 'MITTEL' | 'NIEDRIG' | 'UNBEKANNT';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
}

const MASTER_PLAN_PATH = resolve(process.cwd(), 'docs/tasks/master_plan.md');
const STATUS_REPORT_PATH = resolve(process.cwd(), 'STATUS_REPORT.md');

function normalizeStatus(rawStatus: string): TaskStatus {
  if (rawStatus.includes('ERLEDIGT')) return 'ERLEDIGT';
  if (rawStatus.includes('IN ARBEIT')) return 'IN ARBEIT';
  if (rawStatus.includes('OFFEN')) return 'OFFEN';
  if (rawStatus.includes('REVIEW')) return 'REVIEW';
  if (rawStatus.includes('ABGEBROCHEN')) return 'ABGEBROCHEN';
  if (rawStatus.includes('PAUSIERT')) return 'PAUSIERT';

  return 'UNBEKANNT';
}

function normalizePriority(rawPriority: string): Priority {
  if (rawPriority.includes('KRITISCH')) return 'KRITISCH';
  if (rawPriority.includes('HOCH')) return 'HOCH';
  if (rawPriority.includes('MITTEL')) return 'MITTEL';
  if (rawPriority.includes('NIEDRIG')) return 'NIEDRIG';

  return 'UNBEKANNT';
}

function parseTasks(markdown: string): Task[] {
  const headingRegex = /^### (TASK-\d+):\s*(.+)$/gm;
  const headingMatches = [...markdown.matchAll(headingRegex)];
  const tasks: Task[] = [];

  for (let i = 0; i < headingMatches.length; i += 1) {
    const currentMatch = headingMatches[i];
    const nextMatch = headingMatches[i + 1];

    const [, id, title] = currentMatch;
    const start = currentMatch.index ?? 0;
    const bodyStart = start + currentMatch[0].length;
    const bodyEnd = nextMatch?.index ?? markdown.length;
    const body = markdown.slice(bodyStart, bodyEnd);

    const statusMatch = body.match(/- \*\*Status:\*\*\s*(.+)/);
    const priorityMatch = body.match(/- \*\*Priorität:\*\*\s*(.+)/);

    tasks.push({
      id,
      title: title.trim(),
      status: normalizeStatus(statusMatch?.[1] ?? ''),
      priority: normalizePriority(priorityMatch?.[1] ?? ''),
    });
  }

  return tasks;
}

function toStatusEmoji(status: TaskStatus): string {
  switch (status) {
    case 'ERLEDIGT':
      return '✅';
    case 'IN ARBEIT':
      return '🔄';
    case 'OFFEN':
      return '⬜';
    case 'REVIEW':
      return '🔍';
    case 'ABGEBROCHEN':
      return '❌';
    case 'PAUSIERT':
      return '⏸️';
    default:
      return '❓';
  }
}

function toPriorityWeight(priority: Priority): number {
  switch (priority) {
    case 'KRITISCH':
      return 0;
    case 'HOCH':
      return 1;
    case 'MITTEL':
      return 2;
    case 'NIEDRIG':
      return 3;
    default:
      return 4;
  }
}

function toTaskNumber(taskId: string): number {
  return Number(taskId.replace('TASK-', ''));
}

const masterPlanContent = readFileSync(MASTER_PLAN_PATH, 'utf8');
const tasks = parseTasks(masterPlanContent);

const counts = tasks.reduce(
  (acc, task) => {
    if (task.status === 'ERLEDIGT') acc.done += 1;
    if (task.status === 'IN ARBEIT') acc.inProgress += 1;
    if (task.status === 'OFFEN') acc.open += 1;

    return acc;
  },
  { done: 0, inProgress: 0, open: 0 }
);

const total = tasks.length;
const completionRate = total > 0 ? Math.round((counts.done / total) * 100) : 0;

const criticalPathTasks = tasks.filter((task) => task.priority === 'KRITISCH');

const nextPriorities = tasks
  .filter((task) => task.status !== 'ERLEDIGT')
  .sort((a, b) => {
    const priorityDiff = toPriorityWeight(a.priority) - toPriorityWeight(b.priority);
    if (priorityDiff !== 0) return priorityDiff;

    return toTaskNumber(a.id) - toTaskNumber(b.id);
  })
  .slice(0, 5);

const generatedAt = new Date().toISOString().slice(0, 10);

const generatedSection = [
  '<!-- weekly-status:start -->',
  '## 📈 Weekly-Status (automatisch aus `docs/tasks/master_plan.md`)',
  '',
  '### Kennzahlen',
  `- ✅ **Erledigt:** ${counts.done}`,
  `- 🔄 **In Arbeit:** ${counts.inProgress}`,
  `- ⬜ **Offen:** ${counts.open}`,
  `- 📊 **Gesamtfortschritt:** ${completionRate}% (${counts.done}/${total})`,
  `- 🗓️ **Zuletzt aktualisiert:** ${generatedAt}`,
  '',
  '### Kritischer Pfad (Priorität: KRITISCH)',
  ...criticalPathTasks.map(
    (task) =>
      `- ${toStatusEmoji(task.status)} **${task.id}** – ${task.title} (${task.status})`
  ),
  '',
  '### Nächste 5 Prioritäten',
  ...nextPriorities.map(
    (task) =>
      `- ${toStatusEmoji(task.status)} **${task.id}** – ${task.title} [${task.priority}]`
  ),
  '',
  '> Quelle: `docs/tasks/master_plan.md` ist die einzige Truth-Quelle für Task-Status.',
  '<!-- weekly-status:end -->',
].join('\n');

const statusReportContent = readFileSync(STATUS_REPORT_PATH, 'utf8');
const sectionRegex = /<!-- weekly-status:start -->[\s\S]*?<!-- weekly-status:end -->/;

const nextStatusReportContent = sectionRegex.test(statusReportContent)
  ? statusReportContent.replace(sectionRegex, generatedSection)
  : statusReportContent.replace(
      /<!-- plan-status:end -->\n/,
      (planSectionEnd) => `${planSectionEnd}\n${generatedSection}\n`
    );

writeFileSync(STATUS_REPORT_PATH, nextStatusReportContent, 'utf8');

const compactMarkdown = [
  '### 📈 Weekly Status Update',
  `- Erledigt: **${counts.done}** | In Arbeit: **${counts.inProgress}** | Offen: **${counts.open}** | Fortschritt: **${completionRate}%**`,
  `- Kritischer Pfad: ${criticalPathTasks
    .map((task) => `${task.id} (${task.status})`)
    .join(', ')}`,
  `- Nächste 5: ${nextPriorities
    .map((task) => `${task.id} (${task.priority}/${task.status})`)
    .join(', ')}`,
].join('\n');

console.log('STATUS_REPORT.md wurde mit Weekly-Status aktualisiert.');
console.log('\n--- Compact Markdown ---\n');
console.log(compactMarkdown);
