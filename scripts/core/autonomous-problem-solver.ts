#!/usr/bin/env tsx

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

type CheckStatus = 'pass' | 'fail';

interface CheckResult {
  name: string;
  command: string;
  status: CheckStatus;
  exitCode: number;
  output: string;
  durationMs: number;
}

interface DeepSeekActionPlan {
  summary: string;
  actions: Array<{
    reason: string;
    command: string;
  }>;
  residualRisks: string[];
}

const CONFIG = {
  model: process.env.AGENT_MODEL || 'deepseek-chat',
  baseUrl: (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, ''),
  maxIterations: Number(process.env.AUTO_SOLVER_MAX_ITERATIONS || 3),
  commandTimeoutMs: Number(process.env.AUTO_SOLVER_COMMAND_TIMEOUT_MS || 6 * 60 * 1000),
  reportPath: path.join(process.cwd(), '.cline', 'autonomous-problem-report.json'),
  allowlist: new Set([
    'npm run lint:fix',
    'npm run format',
    'npm run lint',
    'npm run typecheck',
    'npm run test -- --run',
    'npm run build',
    'npm install',
    'pnpm install',
  ]),
};

const CHECKS: Array<{ name: string; command: string }> = [
  { name: 'lint', command: 'npm run lint' },
  { name: 'typecheck', command: 'npm run typecheck' },
  { name: 'test', command: 'npm run test -- --run' },
  { name: 'build', command: 'npm run build' },
];

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function runCommand(command: string): Promise<{ exitCode: number; output: string; durationMs: number }> {
  const startedAt = Date.now();

  return new Promise((resolve) => {
    exec(command, { cwd: process.cwd(), timeout: CONFIG.commandTimeoutMs, maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
      const durationMs = Date.now() - startedAt;
      const output = `${stdout || ''}\n${stderr || ''}`.trim();

      if (error) {
        const exitCode = typeof (error as any).code === 'number' ? (error as any).code : 1;
        resolve({ exitCode, output, durationMs });
        return;
      }

      resolve({ exitCode: 0, output, durationMs });
    });
  });
}

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  for (const check of CHECKS) {
    console.log(`\n🔍 Running check: ${check.name} (${check.command})`);
    const result = await runCommand(check.command);
    const status: CheckStatus = result.exitCode === 0 ? 'pass' : 'fail';

    console.log(status === 'pass' ? `✅ ${check.name} passed` : `❌ ${check.name} failed (exit ${result.exitCode})`);

    results.push({
      name: check.name,
      command: check.command,
      status,
      exitCode: result.exitCode,
      output: result.output.slice(-16000),
      durationMs: result.durationMs,
    });
  }

  return results;
}

function buildIssueSummary(results: CheckResult[]): string {
  const failing = results.filter((r) => r.status === 'fail');
  if (failing.length === 0) {
    return 'No failing checks. System currently healthy.';
  }

  return failing
    .map(
      (r) => `CHECK: ${r.name}\nCOMMAND: ${r.command}\nEXIT: ${r.exitCode}\nOUTPUT:\n${r.output.slice(-4000)}`
    )
    .join('\n\n---\n\n');
}

async function askDeepSeekForPlan(issueSummary: string, iteration: number): Promise<DeepSeekActionPlan> {
  const apiKey = requireEnv('DEEPSEEK_API_KEY');
  const nscaleApiKey = requireEnv('NSCALE_API_KEY');
  const nscaleHeaderName = process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY';

  const prompt = `You are an autonomous reliability engineer.\n\nIteration: ${iteration}\n\nCurrent failures:\n${issueSummary}\n\nReturn STRICT JSON with this schema:\n{\n  "summary": "short explanation",\n  "actions": [{ "reason": "why", "command": "one shell command" }],\n  "residualRisks": ["risk 1"]\n}\n\nRules:\n- Prefer deterministic fixes first.\n- Keep commands minimal.\n- Do not include destructive commands.`;

  const response = await fetch(`${CONFIG.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      [nscaleHeaderName]: nscaleApiKey,
    },
    body: JSON.stringify({
      model: CONFIG.model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You output valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`DeepSeek request failed: ${response.status} ${body.slice(0, 400)}`);
  }

  const payload = (await response.json()) as any;
  const content = payload?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek returned empty content.');
  }

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error(`DeepSeek did not return JSON: ${content.slice(0, 200)}`);
  }

  const parsed = JSON.parse(match[0]);
  return {
    summary: parsed.summary || 'No summary from model.',
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    residualRisks: Array.isArray(parsed.residualRisks) ? parsed.residualRisks : [],
  };
}

async function executePlan(plan: DeepSeekActionPlan): Promise<CheckResult[]> {
  const executionResults: CheckResult[] = [];

  for (const action of plan.actions) {
    if (!CONFIG.allowlist.has(action.command)) {
      console.log(`⚠️ Skipping non-allowlisted command: ${action.command}`);
      executionResults.push({
        name: 'plan-action',
        command: action.command,
        status: 'fail',
        exitCode: 126,
        output: 'Command not in allowlist',
        durationMs: 0,
      });
      continue;
    }

    console.log(`\n🛠️ Executing: ${action.command}`);
    const result = await runCommand(action.command);
    executionResults.push({
      name: 'plan-action',
      command: action.command,
      status: result.exitCode === 0 ? 'pass' : 'fail',
      exitCode: result.exitCode,
      output: result.output.slice(-12000),
      durationMs: result.durationMs,
    });

    if (result.exitCode === 0) {
      console.log(`✅ Action succeeded (${action.reason})`);
    } else {
      console.log(`❌ Action failed (${action.reason})`);
    }
  }

  return executionResults;
}

function saveReport(report: unknown): void {
  const reportDir = path.dirname(CONFIG.reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  fs.writeFileSync(CONFIG.reportPath, JSON.stringify(report, null, 2));
}

async function main(): Promise<void> {
  if ((process.env.AI_PROVIDER || 'deepseek') !== 'deepseek') {
    throw new Error('AI_PROVIDER must be set to "deepseek" for autonomous solver.');
  }

  requireEnv('DEEPSEEK_API_KEY');
  requireEnv('NSCALE_API_KEY');

  const timeline: unknown[] = [];

  for (let iteration = 1; iteration <= CONFIG.maxIterations; iteration++) {
    console.log(`\n══════════ AUTONOMOUS SOLVER ITERATION ${iteration}/${CONFIG.maxIterations} ══════════`);

    const checkResults = await runChecks();
    timeline.push({ iteration, checkResults });

    const failing = checkResults.filter((r) => r.status === 'fail');
    if (failing.length === 0) {
      const healthyPlan = await askDeepSeekForPlan('No failures found. Provide concise hardening suggestions.', iteration);
      timeline.push({ iteration, healthyPlan });
      saveReport({ status: 'healthy', timeline, generatedAt: new Date().toISOString() });
      console.log('\n✅ All checks are passing. Report written to .cline/autonomous-problem-report.json');
      return;
    }

    const issueSummary = buildIssueSummary(checkResults);
    const plan = await askDeepSeekForPlan(issueSummary, iteration);
    timeline.push({ iteration, plan });

    console.log(`\n🧠 DeepSeek summary: ${plan.summary}`);
    if (plan.residualRisks.length > 0) {
      console.log(`⚠️ Residual risks: ${plan.residualRisks.join(' | ')}`);
    }

    const actionResults = await executePlan(plan);
    timeline.push({ iteration, actionResults });
  }

  const finalChecks = await runChecks();
  const remaining = finalChecks.filter((r) => r.status === 'fail');
  const status = remaining.length === 0 ? 'resolved' : 'partial';
  timeline.push({ finalChecks, remainingFailures: remaining.length });

  saveReport({ status, timeline, generatedAt: new Date().toISOString() });

  if (remaining.length > 0) {
    console.log(`\n⚠️ Solver finished with ${remaining.length} remaining failing check(s).`);
    process.exit(1);
  }

  console.log('\n✅ Solver resolved all failing checks.');
}

main().catch((error) => {
  console.error('\n❌ Autonomous solver failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
