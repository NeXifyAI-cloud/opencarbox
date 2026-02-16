import { execSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';

const DEFAULT_MAX_CALLS = 1;
const DEFAULT_MAX_FILES = 8;
const DEFAULT_MAX_FILE_BYTES = 200_000;

const ALLOWED_PREFIXES = ['app/', 'lib/', 'components/', 'tools/', 'supabase/'];
const FORBIDDEN_PREFIXES = ['.github/workflows/', '.env', 'secrets/'];

type TriageReply = {
  confidence?: number;
  rationale?: string;
  patch?: string;
};

function req(name: string): string {
  const value = (process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function num(name: string, fallback: number): number {
  const raw = (process.env[name] || '').trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function parsePatchedFiles(patch: string): string[] {
  const files = new Set<string>();
  for (const line of patch.split('\n')) {
    if (line.startsWith('+++ b/')) {
      files.add(line.slice('+++ b/'.length).trim());
    }
  }
  return [...files].filter((file) => file !== '/dev/null');
}

function isPathAllowed(file: string, forbidWorkflowEdits: boolean): boolean {
  if (forbidWorkflowEdits && file.startsWith('.github/workflows/')) {
    return false;
  }
  if (FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix))) {
    return false;
  }
  return ALLOWED_PREFIXES.some((prefix) => file.startsWith(prefix));
}

async function callDeepseek(messages: Array<{ role: 'system' | 'user'; content: string }>): Promise<TriageReply> {
  const apiKey = req('DEEPSEEK_API_KEY');
  const nscaleApiKey = req('NSCALE_API_KEY');
  const nscaleHeader = (process.env.NSCALE_HEADER_NAME || 'X-NScale-Key').trim();
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      [nscaleHeader]: nscaleApiKey,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`DeepSeek request failed (${response.status}): ${body.slice(0, 240)}`);
  }

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('DeepSeek returned empty content');
  }

  return JSON.parse(content) as TriageReply;
}

async function main() {
  const maxCalls = num('AI_MAX_CALLS', DEFAULT_MAX_CALLS);
  const maxFiles = num('MAX_CONFLICT_FILES', DEFAULT_MAX_FILES);
  const maxFileBytes = num('MAX_FILE_BYTES', DEFAULT_MAX_FILE_BYTES);
  const forbidWorkflowEdits = (process.env.FORBID_WORKFLOW_EDITS || 'true').toLowerCase() !== 'false';

  const failureSummary = readFileSync('.tmp/failure-summary.txt', 'utf8').slice(0, 16000);
  const failedLogs = readFileSync('.tmp/failed-logs.txt', 'utf8').slice(0, 50000);

  let callCount = 0;
  const result = await (async () => {
    if (callCount >= maxCalls) {
      throw new Error('AI_MAX_CALLS exhausted before triage');
    }
    callCount += 1;

    return callDeepseek([
      {
        role: 'system',
        content:
          'Du bist ein vorsichtiger CI-Triage-Assistent. Antworte NUR als JSON Objekt mit Feldern confidence (0..1), rationale (kurz), patch (unified diff oder leer). Erlaube NUR Pfade in app/, lib/, components/, tools/, supabase/. Keine Workflow-, Secret- oder Env-Dateien ändern. Wenn unsicher: confidence < 0.75 und patch leer.',
      },
      {
        role: 'user',
        content: `Failed workflow context:\n${failureSummary}\n\nFailed logs:\n${failedLogs}`,
      },
    ]);
  })();

  const confidence = Number(result.confidence ?? 0);
  const patch = (result.patch || '').trim();

  if (!patch || confidence < 0.75) {
    writeFileSync('.tmp/triage-status.json', JSON.stringify({ success: false, reason: 'low-confidence-or-empty-patch', confidence }, null, 2));
    console.log('No safe AI patch generated.');
    return;
  }

  if (patch.includes('\u0000')) {
    throw new Error('Patch appears binary; refusing to apply');
  }

  const touchedFiles = parsePatchedFiles(patch);
  if (touchedFiles.length === 0) {
    writeFileSync('.tmp/triage-status.json', JSON.stringify({ success: false, reason: 'patch-has-no-files' }, null, 2));
    console.log('Patch contained no files.');
    return;
  }

  if (touchedFiles.length > maxFiles) {
    throw new Error(`Patch exceeds MAX_CONFLICT_FILES (${maxFiles})`);
  }

  for (const file of touchedFiles) {
    if (!isPathAllowed(file, forbidWorkflowEdits)) {
      throw new Error(`Patch touches forbidden path: ${file}`);
    }
    try {
      const size = statSync(file).size;
      if (size > maxFileBytes) {
        throw new Error(`File exceeds MAX_FILE_BYTES guardrail: ${file}`);
      }
    } catch {
      // New file is acceptable as long as path is allowed.
    }
  }

  writeFileSync('.tmp/ai.patch', `${patch}\n`);
  execSync('git apply --whitespace=nowarn .tmp/ai.patch', { stdio: 'inherit' });

  if (execSync('git diff --name-only').toString().trim().length === 0) {
    writeFileSync('.tmp/triage-status.json', JSON.stringify({ success: false, reason: 'no-effective-change' }, null, 2));
    console.log('Patch applied but no effective changes were detected.');
    return;
  }

  writeFileSync(
    '.tmp/triage-status.json',
    JSON.stringify({ success: true, confidence, files: touchedFiles, rationale: result.rationale || '' }, null, 2),
  );
  console.log(`Applied AI patch across ${touchedFiles.length} file(s).`);
}

void main();
