import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

type ChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function getArg(name: string): string | undefined {
  const idx = process.argv.findIndex((arg) => arg === `--${name}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

function unwrapContent(content: string): string {
  const fenced = content.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
  return fenced ? fenced[1] : content;
}

async function resolveFile(path: string, base: string, head: string) {
  const conflicted = readFileSync(path, 'utf8');

  const result = (await deepseekChatCompletion({
    model: 'deepseek-chat',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'Resolve git merge conflicts. Return only the final merged file content without markdown fences and without explanations.',
      },
      {
        role: 'user',
        content: `base=${base}\nhead=${head}\nfile=${path}\n\n${conflicted}`,
      },
    ],
  })) as ChatResponse;

  const content = result.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error(`DeepSeek returned empty content for ${path}`);
  }

  const merged = unwrapContent(content);
  writeFileSync(path, merged);
  execSync(`git add -- ${JSON.stringify(path)}`);
}

async function main() {
  const base = getArg('base');
  const head = getArg('head');

  if (!base || !head) {
    throw new Error('Usage: tsx tools/ai_merge_conflicts.ts --base <ref> --head <ref>');
  }

  const conflicts = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (conflicts.length === 0) {
    console.log('No unresolved conflicts found.');
    return;
  }

  for (const file of conflicts) {
    console.log(`Resolving ${file} via DeepSeek...`);
    await resolveFile(file, base, head);
  }

  const remaining = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim();
  if (remaining) {
    throw new Error(`Unresolved conflicts remain:\n${remaining}`);
  }

  console.log('All conflicts resolved and staged.');
}

void main();
