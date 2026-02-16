#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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

function sh(cmd: string, args: string[], opts?: { allowFail?: boolean }): string {
  try {
    const out = execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return out.trim();
  } catch (error: any) {
    if (opts?.allowFail) {
      const stdout = error?.stdout?.toString?.() ?? '';
      const stderr = error?.stderr?.toString?.() ?? '';
      return `${stdout}\n${stderr}`.trim();
    }
    throw error;
  }
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    i += 1;
  }

  if (!args.base) {
    throw new Error('Usage: --base <git-ref> [--head <git-ref>]');
  }

  return { base: args.base, head: args.head };
}

function isForbiddenFile(filePath: string): boolean {
  const normalized = filePath.replaceAll('\\', '/');
  const forbiddenPrefixes = ['.github/workflows/'];
  const forbiddenNames = ['.env', '.env.local', '.env.production', '.env.example'];
  const forbiddenSuffixes = ['.pem', '.key', '.p12'];

  if (forbiddenNames.includes(path.basename(normalized))) return true;
  if (forbiddenSuffixes.some((suffix) => normalized.endsWith(suffix))) return true;
  if (forbiddenPrefixes.some((prefix) => normalized.startsWith(prefix))) return true;

  if (normalized.startsWith('node_modules/') || normalized.startsWith('.next/') || normalized.startsWith('dist/')) return true;

  return false;
}

function hasConflictMarkers(content: string): boolean {
  return content.includes('<<<<<<<') && content.includes('=======') && content.includes('>>>>>>>');
}

async function deepseekResolveFile(env: Env, filePath: string, conflictedText: string): Promise<string> {
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
        {
          role: 'system',
          content: [
            'You are a cautious merge assistant.',
            'Resolve Git conflict markers in one file.',
            'Output only the full resolved file content without markdown fences or explanations.',
            'Never include conflict markers in output.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: `File path: ${filePath}\nResolve conflicts in the following content:\n----- FILE START -----\n${conflictedText}\n----- FILE END -----`,
        },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`DeepSeek error ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('DeepSeek response missing content.');

  const normalized = content.replace(/\r\n/g, '\n');
  if (hasConflictMarkers(normalized)) {
    throw new Error(`AI output still contains conflict markers for ${filePath}`);
  }

  return normalized;
}

async function main() {
  const env = getEnv();
  const { base } = parseArgs(process.argv.slice(2));

  sh('git', ['merge', '--no-commit', '--no-ff', base], { allowFail: true });

  const conflictedFiles = sh('git', ['diff', '--name-only', '--diff-filter=U'], { allowFail: true })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (conflictedFiles.length === 0) {
    console.log('No conflicted files detected.');
    return;
  }

  const changed: string[] = [];

  for (const filePath of conflictedFiles) {
    if (isForbiddenFile(filePath)) {
      throw new Error(`Conflict in forbidden file "${filePath}". Manual resolution required.`);
    }

    if (!existsSync(filePath)) {
      throw new Error(`Conflicted file not found on disk: ${filePath}`);
    }

    const original = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    if (!hasConflictMarkers(original)) continue;

    const resolved = await deepseekResolveFile(env, filePath, original);

    if (resolved.trim().length === 0 && original.trim().length > 0) {
      throw new Error(`Resolved output is empty for non-empty file: ${filePath}`);
    }

    writeFileSync(filePath, resolved, 'utf8');
    changed.push(filePath);
  }

  if (changed.length === 0) {
    console.log('No files resolved (nothing to stage).');
    return;
  }

  sh('git', ['add', '--', ...changed]);

  for (const filePath of changed) {
    if (hasConflictMarkers(readFileSync(filePath, 'utf8'))) {
      throw new Error(`Conflict markers remain after resolution: ${filePath}`);
    }
  }

  console.log(`Resolved and staged ${changed.length} file(s):`);
  for (const filePath of changed) {
    console.log(`- ${filePath}`);
  }
}

main().catch((error) => {
  console.error(String((error as Error)?.message || error));
  process.exit(1);
});
