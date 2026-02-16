import { readFileSync, writeFileSync } from 'node:fs';
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';
import {
  oracleConsumeCalls,
  oracleEvent,
  oracleFinishRun,
  oracleLoadPolicy,
  oracleStartRun,
} from './oracle';

type ChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

const TOOL = 'auto_improve';
const START_MARKER = '<!-- AUTO-IMPROVE:START -->';
const END_MARKER = '<!-- AUTO-IMPROVE:END -->';

function upsertSection(doc: string, section: string): string {
  const block = `${START_MARKER}\n${section}\n${END_MARKER}`;
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);
  return pattern.test(doc) ? doc.replace(pattern, block) : `${doc.trimEnd()}\n\n${block}\n`;
}

async function askDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const result = (await deepseekChatCompletion({
    model: 'deepseek-chat',
    temperature: 0.2,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })) as ChatResponse;

  return result.choices?.[0]?.message?.content?.trim() ?? '- Keine Vorschläge von DeepSeek zurückgegeben.';
}

async function main() {
  const run = await oracleStartRun(TOOL);

  try {
    const policy = await oracleLoadPolicy(TOOL);
    await oracleEvent(run.id, 'policy_loaded', policy);

    if (!policy.enabled) {
      throw new Error('Oracle policy disabled this tool.');
    }

    const plannedCalls = 2;
    if (plannedCalls > policy.max_ai_calls) {
      throw new Error(`Oracle max_ai_calls too low for auto_improve: ${policy.max_ai_calls}`);
    }

    const budget = await oracleConsumeCalls(TOOL, plannedCalls);
    if (!budget.allowed) {
      throw new Error(`Oracle daily budget exceeded. Remaining: ${budget.remaining}`);
    }

    await oracleEvent(run.id, 'ai_call', { plannedCalls, remainingDaily: budget.remaining });

    const backlogPath = 'NOTES/backlog.md';
    const backlog = readFileSync(backlogPath, 'utf8');
    const backlogSuggestions = await askDeepSeek(
      'Propose exactly 3 concise, low-risk backlog/doc improvements in markdown bullet list. German language.',
      backlog.slice(0, 8000),
    );

    const backlogSection = `## Auto-Improve Vorschläge\n\n_Generated: ${new Date().toISOString()}_\n\n${backlogSuggestions}`;
    const updatedBacklog = upsertSection(backlog, backlogSection);

    if (updatedBacklog !== backlog) {
      writeFileSync(backlogPath, updatedBacklog);
    }

    const runbookPath = 'NOTES/runbook.md';
    const runbook = readFileSync(runbookPath, 'utf8');
    const runbookSuggestions = await askDeepSeek(
      'Propose exactly 3 concise, low-risk operational runbook improvements in markdown bullet list. German language.',
      runbook.slice(0, 8000),
    );

    const runbookSection = `## Auto-Improve Vorschläge\n\n_Generated: ${new Date().toISOString()}_\n\n${runbookSuggestions}`;
    const updatedRunbook = upsertSection(runbook, runbookSection);

    if (updatedRunbook !== runbook) {
      writeFileSync(runbookPath, updatedRunbook);
    }

    await oracleFinishRun(run.id, true, {
      plannedCalls,
      filesTouched: [
        ...(updatedBacklog !== backlog ? [backlogPath] : []),
        ...(updatedRunbook !== runbook ? [runbookPath] : []),
      ],
    });

    process.stdout.write('Auto-improve completed.\n');
  } catch (error) {
    await oracleFinishRun(run.id, false, {
      reason: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}

void main();
