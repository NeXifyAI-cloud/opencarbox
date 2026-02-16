import { execFileSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import process from 'node:process';
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

type EnvConfig = {
  aiMaxCalls: number;
  aiMaxConflictFiles: number;
  aiMaxFileBytes: number;
};

const TOOL = 'ai_merge_conflicts';

function getArg(name: string): string | undefined {
  const idx = process.argv.findIndex((arg) => arg === `--${name}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

function parseIntEnv(name: string, fallback: number): number {
  const raw = (process.env[name] || '').trim();
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getEnv(): EnvConfig {
  return {
    aiMaxCalls: parseIntEnv('AI_MAX_CALLS', 10),
    aiMaxConflictFiles: parseIntEnv('AI_MAX_CONFLICT_FILES', 10),
    aiMaxFileBytes: parseIntEnv('AI_MAX_FILE_BYTES', 2_000_000),
  };
}

function sh(cmd: string, args: string[], opts?: { allowFail?: boolean }): string {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8' }).toString().trim();
  } catch (error) {
    if (opts?.allowFail) {
      return '';
    }
    throw error;
  }
}

function hasConflictMarkers(text: string): boolean {
  return text.includes('<<<<<<<') && text.includes('=======') && text.includes('>>>>>>>');
}

function isBinaryHeuristic(text: string): boolean {
  return text.includes('\u0000');
}

function unwrapContent(content: string): string {
  const fenced = content.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
  return fenced ? fenced[1] : content;
}

function globToRegExp(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '___DOUBLE_WILDCARD___')
    .replace(/\*/g, '[^/]*')
    .replace(/___DOUBLE_WILDCARD___/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function isForbiddenFile(filePath: string, denyGlobs: string[]): boolean {
  const normalized = filePath.replaceAll('\\', '/');
  const builtInPatterns = ['.env*', 'node_modules/**', '.next/**', 'dist/**'];
  const patterns = [...builtInPatterns, ...denyGlobs];
  return patterns.some((pattern) => globToRegExp(pattern).test(normalized));
}

async function deepseekResolveFile(base: string, head: string, path: string, conflicted: string): Promise<string> {
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

  return unwrapContent(content);
}

async function main() {
  const env = getEnv();
  const base = getArg('base');
  const head = getArg('head');

  if (!base || !head) {
    throw new Error('Usage: tsx tools/ai_merge_conflicts.ts --base <ref> --head <ref>');
  }

  const run = await oracleStartRun(TOOL);

  try {
    const loadedPolicy = await oracleLoadPolicy(TOOL);
    const policy = {
      ...loadedPolicy,
      max_ai_calls: loadedPolicy.max_ai_calls || env.aiMaxCalls,
      max_conflict_files: loadedPolicy.max_conflict_files || env.aiMaxConflictFiles,
      max_file_bytes: loadedPolicy.max_file_bytes || env.aiMaxFileBytes,
    };
    await oracleEvent(run.id, 'policy_loaded', policy);

    if (!policy.enabled) {
      await oracleEvent(run.id, 'guardrail_block', { reason: 'tool_disabled' });
      throw new Error('Oracle policy disabled this tool (kill-switch).');
    }

    sh('git', ['merge', '--no-commit', '--no-ff', base], { allowFail: true });

    const conflictedFiles = sh('git', ['diff', '--name-only', '--diff-filter=U'], { allowFail: true })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (conflictedFiles.length === 0) {
      await oracleFinishRun(run.id, true, { note: 'no_conflicts' });
      process.stdout.write('No conflicted files detected.\n');
      return;
    }

    if (policy.max_conflict_files > 0 && conflictedFiles.length > policy.max_conflict_files) {
      await oracleEvent(run.id, 'guardrail_block', {
        reason: 'too_many_conflict_files',
        count: conflictedFiles.length,
        max: policy.max_conflict_files,
      });
      throw new Error(`Too many conflicted files: ${conflictedFiles.length} > ${policy.max_conflict_files}`);
    }

    const changed: string[] = [];
    let aiCalls = 0;

    for (const fp of conflictedFiles) {
      const normalized = fp.replaceAll('\\', '/');

      if (policy.forbid_workflows && normalized.startsWith('.github/workflows/')) {
        await oracleEvent(run.id, 'guardrail_block', { reason: 'workflow_file_forbidden', file: fp });
        throw new Error(`Forbidden to edit workflow file via AI: ${fp}`);
      }

      if (isForbiddenFile(normalized, policy.deny_globs ?? [])) {
        await oracleEvent(run.id, 'guardrail_block', { reason: 'forbidden_file', file: fp });
        throw new Error(`Conflict in forbidden file "${fp}". Refusing.`);
      }

      const st = statSync(fp);
      if (st.size > policy.max_file_bytes) {
        await oracleEvent(run.id, 'guardrail_block', {
          reason: 'file_too_large',
          file: fp,
          size: st.size,
          max: policy.max_file_bytes,
        });
        throw new Error(`File too large for AI resolution: ${fp} (${st.size} > ${policy.max_file_bytes})`);
      }

      const original = readFileSync(fp, 'utf8').replace(/\r\n/g, '\n');
      if (isBinaryHeuristic(original)) {
        await oracleEvent(run.id, 'guardrail_block', { reason: 'binary_detected', file: fp });
        throw new Error(`Binary-like content detected (\\0). Refusing: ${fp}`);
      }

      if (!hasConflictMarkers(original)) {
        continue;
      }

      if (aiCalls + 1 > policy.max_ai_calls) {
        await oracleEvent(run.id, 'guardrail_block', {
          reason: 'max_ai_calls_exceeded',
          used: aiCalls,
          max: policy.max_ai_calls,
        });
        throw new Error(`AI_MAX_CALLS exceeded: ${aiCalls} >= ${policy.max_ai_calls}`);
      }

      const budget = await oracleConsumeCalls(TOOL, 1);
      if (!budget.allowed) {
        await oracleEvent(run.id, 'guardrail_block', {
          reason: 'daily_budget_exceeded',
          remaining: budget.remaining,
        });
        throw new Error(`Oracle daily budget exceeded. Remaining: ${budget.remaining}`);
      }

      aiCalls += 1;
      await oracleEvent(run.id, 'ai_call', { file: fp, aiCalls, remainingDaily: budget.remaining });

      const resolved = await deepseekResolveFile(base, head, fp, original);
      writeFileSync(fp, resolved, 'utf8');
      changed.push(fp);

      await oracleEvent(run.id, 'file_resolved', { file: fp });
    }

    if (changed.length > 0) {
      sh('git', ['add', '--', ...changed]);
    }

    await oracleFinishRun(run.id, true, { changedCount: changed.length, aiCalls });
    process.stdout.write(`Resolved and staged ${changed.length} file(s).\n`);
  } catch (error) {
    await oracleFinishRun(run.id, false, {
      reason: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}

void main();
