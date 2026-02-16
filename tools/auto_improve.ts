import { readFileSync, writeFileSync } from 'node:fs';
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

type ChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

const START_MARKER = '<!-- AUTO-IMPROVE:START -->';
const END_MARKER = '<!-- AUTO-IMPROVE:END -->';

function upsertSection(doc: string, section: string): string {
  const block = `${START_MARKER}\n${section}\n${END_MARKER}`;
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);
  return pattern.test(doc) ? doc.replace(pattern, block) : `${doc.trimEnd()}\n\n${block}\n`;
}

async function main() {
  const backlogPath = 'NOTES/backlog.md';
  const backlog = readFileSync(backlogPath, 'utf8');

  const result = (await deepseekChatCompletion({
    model: 'deepseek-chat',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'Propose exactly 3 concise, low-risk backlog/doc improvements in markdown bullet list. German language.',
      },
      {
        role: 'user',
        content: backlog.slice(0, 8000),
      },
    ],
  })) as ChatResponse;

  const suggestions =
    result.choices?.[0]?.message?.content?.trim() ?? '- Keine Vorschläge von DeepSeek zurückgegeben.';

  const section = `## Auto-Improve Vorschläge\n\n_Generated: ${new Date().toISOString()}_\n\n${suggestions}`;
  const updated = upsertSection(backlog, section);

  if (updated !== backlog) {
    writeFileSync(backlogPath, updated);
    console.log('Updated NOTES/backlog.md with auto-improve suggestions.');
  } else {
    console.log('No backlog changes were necessary.');
  }
}

void main();
