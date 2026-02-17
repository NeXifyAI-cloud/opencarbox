/**
 * Backlog Sync (Auftrag 26)
 *
 * Pulls open issues from GitHub API and updates a clearly marked auto-block
 * in NOTES/backlog.md without overwriting manual content.
 */

export interface Issue {
  number: number;
  title: string;
  html_url: string;
  labels: Array<{ name: string }>;
  state: string;
  assignees: Array<{ login: string }>;
  created_at: string;
}

const AUTO_BLOCK_START = '<!-- AUTO:LIVE_ISSUES_START -->';
const AUTO_BLOCK_END = '<!-- AUTO:LIVE_ISSUES_END -->';

/** Priority order for sorting (lower = higher priority) */
const LABEL_PRIORITY: Record<string, number> = {
  'priority:critical': 0,
  security: 1,
  'priority:high': 2,
  'ci-failure': 3,
  'type:bug': 4,
  'priority:medium': 5,
  'type:feature': 6,
  'priority:low': 7,
};

function issuePriority(issue: Issue): number {
  let best = 99;
  for (const label of issue.labels) {
    const p = LABEL_PRIORITY[label.name];
    if (p !== undefined && p < best) {
      best = p;
    }
  }
  return best;
}

/**
 * Format a list of issues into a markdown table.
 */
export function formatIssuesBlock(issues: Issue[]): string {
  const sorted = [...issues].sort((a, b) => {
    const prioDiff = issuePriority(a) - issuePriority(b);
    if (prioDiff !== 0) return prioDiff;
    return a.number - b.number;
  });

  const lines: string[] = [
    AUTO_BLOCK_START,
    '',
    '## Live Issues Index',
    '',
    '> Auto-generated — do not edit this section manually.',
    '> Last updated: ' + new Date().toISOString().split('T')[0],
    '',
    '| # | Title | Labels | Assignees |',
    '|---|-------|--------|-----------|',
  ];

  for (const issue of sorted) {
    const labels = issue.labels.map((l) => '`' + l.name + '`').join(' ');
    const assignees = issue.assignees.map((a) => '@' + a.login).join(', ') || '—';
    lines.push(
      `| [#${issue.number}](${issue.html_url}) | ${issue.title} | ${labels} | ${assignees} |`
    );
  }

  if (sorted.length === 0) {
    lines.push('| — | No open issues | — | — |');
  }

  lines.push('', AUTO_BLOCK_END);
  return lines.join('\n');
}

/**
 * Replace the auto-block in existing content, or append it.
 */
export function updateBacklogContent(
  existingContent: string,
  issuesBlock: string
): string {
  const startIdx = existingContent.indexOf(AUTO_BLOCK_START);
  const endIdx = existingContent.indexOf(AUTO_BLOCK_END);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = existingContent.substring(0, startIdx);
    const after = existingContent.substring(endIdx + AUTO_BLOCK_END.length);
    return before + issuesBlock + after;
  }

  // Append if no auto-block exists
  return existingContent.trimEnd() + '\n\n' + issuesBlock + '\n';
}
