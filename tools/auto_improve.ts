#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type Env = {
  AI_PROVIDER: 'deepseek';
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL: string;
  NSCALE_API_KEY: string;
  NSCALE_HEADER_NAME: string;
  DEEPSEEK_MODEL: string;
};

function getEnv(): Env {
  const AI_PROVIDER = (process.env.AI_PROVIDER || '').trim();
  if (AI_PROVIDER !== 'deepseek') {
    throw new Error("AI_PROVIDER must be 'deepseek' (DeepSeek-only repo).");
  }

  const DEEPSEEK_API_KEY = (process.env.DEEPSEEK_API_KEY || '').trim();
  const NSCALE_API_KEY = (process.env.NSCALE_API_KEY || '').trim();
  if (!DEEPSEEK_API_KEY) throw new Error('Missing DEEPSEEK_API_KEY');
  if (!NSCALE_API_KEY) throw new Error('Missing NSCALE_API_KEY');

  return {
    AI_PROVIDER: 'deepseek',
    DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').trim(),
    NSCALE_API_KEY,
    NSCALE_HEADER_NAME: (process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY').trim(),
    DEEPSEEK_MODEL: (process.env.DEEPSEEK_MODEL || 'deepseek-chat').trim(),
  };
}

function sh(cmd: string, args: string[], opts?: { allowFail?: boolean; maxLen?: number }): string {
  try {
    const out = execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return out.slice(0, opts?.maxLen ?? 200_000);
  } catch (error: any) {
    if (!opts?.allowFail) throw error;

    const stdout = (error?.stdout?.toString?.() ?? '').slice(0, 120_000);
    const stderr = (error?.stderr?.toString?.() ?? '').slice(0, 120_000);
    return `${stdout}\n${stderr}`.trim();
  }
}

function ensureFile(filePath: string, initial: string) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(filePath)) writeFileSync(filePath, initial, 'utf8');
}

function parseArgs(argv: string[]) {
  const flags = new Set(argv);
  return { withChecks: flags.has('--with-checks') };
}

function upsertSection(markdown: string, sectionTitle: string, newBody: string): string {
  const start = `<!-- AUTO:${sectionTitle}:START -->`;
  const end = `<!-- AUTO:${sectionTitle}:END -->`;
  const block = `${start}\n${newBody.trimEnd()}\n${end}`;

  if (markdown.includes(start) && markdown.includes(end)) {
    return markdown.replace(new RegExp(`${start}[\\s\\S]*?${end}`, 'm'), block);
  }

  return `${markdown.trimEnd()}\n\n${block}\n`;
}

async function deepseekGenerate(env: Env, system: string, user: string): Promise<string> {
  const baseUrl = env.DEEPSEEK_BASE_URL.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      [env.NSCALE_HEADER_NAME]: env.NSCALE_API_KEY,
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`DeepSeek error ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('DeepSeek response missing content.');

  return content.replace(/\r\n/g, '\n').trim();
}

function collectSignals(withChecks: boolean): Record<string, string> {
  const signals: Record<string, string> = {};

  signals.repoStatus = sh('git', ['status', '--porcelain'], { allowFail: true, maxLen: 50_000 });
  signals.recentCommits = sh('git', ['log', '-20', '--pretty=format:%h %s'], { allowFail: true, maxLen: 50_000 });
  signals.packageJson = existsSync('package.json') ? readFileSync('package.json', 'utf8').slice(0, 80_000) : '';
  signals.readme = existsSync('README.md') ? readFileSync('README.md', 'utf8').slice(0, 80_000) : '';
  signals.notesBrain = existsSync('NOTES/brain.md') ? readFileSync('NOTES/brain.md', 'utf8').slice(0, 120_000) : '';
  signals.notesBacklog = existsSync('NOTES/backlog.md') ? readFileSync('NOTES/backlog.md', 'utf8').slice(0, 120_000) : '';
  signals.notesRunbook = existsSync('NOTES/runbook.md') ? readFileSync('NOTES/runbook.md', 'utf8').slice(0, 120_000) : '';
  signals.todoScan = sh('bash', ['-lc', 'rg -n "\\b(TODO|FIXME|HACK)\\b" -S app lib components tools NOTES docs || true'], {
    allowFail: true,
    maxLen: 120_000,
  });

  if (withChecks) {
    signals.lint = sh('pnpm', ['lint'], { allowFail: true, maxLen: 120_000 });
    signals.typecheck = sh('pnpm', ['typecheck'], { allowFail: true, maxLen: 120_000 });
    signals.test = sh('pnpm', ['test'], { allowFail: true, maxLen: 120_000 });
    signals.build = sh('pnpm', ['build'], { allowFail: true, maxLen: 120_000 });
  }

  return signals;
}

async function main() {
  const env = getEnv();
  const { withChecks } = parseArgs(process.argv.slice(2));

  ensureFile('NOTES/brain.md', '# Brain\n\nArchitecture decisions (ADRs), security posture, and long-term roadmap.\n');
  ensureFile('NOTES/backlog.md', '# Backlog\n\nPrioritized tasks with acceptance criteria.\n');
  ensureFile('NOTES/runbook.md', '# Runbook\n\nOperations, debugging, releases, incident steps.\n');

  const signals = collectSignals(withChecks);
  const system = [
    'You are a cautious engineering manager + tech lead.',
    'Goal: improve project quality iteratively (tests, docs, CI, reliability).',
    'Hard rules:',
    '- Do not propose using any AI provider other than DeepSeek.',
    '- Do not suggest storing secrets in code or logs.',
    '- Prefer minimal, high-impact changes.',
    '- Output must be concise, actionable, and testable.',
  ].join('\n');

  const user = [
    'Given the following repo signals, produce:',
    '1) A prioritized backlog (max 10 items) with acceptance criteria and file hints.',
    '2) Runbook improvements: troubleshooting steps for the top 5 likely failures.',
    'Constraints:',
    '- Keep it consistent with Next.js + Supabase + Vercel + GitHub Actions.',
    '- Assume deployments are automatic via Vercel Git integration.',
    '- Avoid speculative claims; rely only on the signals.',
    '',
    'REPO SIGNALS (truncated):',
    JSON.stringify(signals, null, 2),
  ].join('\n');

  const generated = await deepseekGenerate(env, system, user);

  const backlogPath = 'NOTES/backlog.md';
  const runbookPath = 'NOTES/runbook.md';

  const backlogMd = readFileSync(backlogPath, 'utf8').replace(/\r\n/g, '\n');
  const runbookMd = readFileSync(runbookPath, 'utf8').replace(/\r\n/g, '\n');

  const newBacklog = upsertSection(backlogMd, 'BACKLOG', `## Auto-generated priorities\n\n${generated}`);

  const runbookGenerated = await deepseekGenerate(
    env,
    system,
    [
      'Create a troubleshooting runbook section in markdown with:',
      '- Symptom',
      '- Likely cause',
      '- Commands to run',
      '- Fix steps',
      'Focus on CI failures, Supabase auth issues, env misconfig, Vercel deploy errors, AI provider errors.',
      '',
      'Signals:',
      JSON.stringify(
        {
          lint: signals.lint,
          typecheck: signals.typecheck,
          test: signals.test,
          build: signals.build,
          todoScan: signals.todoScan,
          packageJson: signals.packageJson,
        },
        null,
        2,
      ),
    ].join('\n'),
  );

  const newRunbook = upsertSection(
    runbookMd,
    'RUNBOOK_TROUBLESHOOTING',
    `## Auto-generated troubleshooting\n\n${runbookGenerated}\n`,
  );

  writeFileSync(backlogPath, newBacklog, 'utf8');
  writeFileSync(runbookPath, newRunbook, 'utf8');

  console.log('Updated:');
  console.log(`- ${backlogPath}`);
  console.log(`- ${runbookPath}`);
}

main().catch((error) => {
  console.error(String((error as Error)?.message || error));
  process.exit(1);
});
