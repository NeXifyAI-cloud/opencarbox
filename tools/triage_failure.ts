#!/usr/bin/env tsx

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import {
  oracleConsumeCalls,
  oracleEvent,
  oracleFinishRun,
  oracleLoadPolicy,
  oracleStartRun,
} from './oracle'

const TOOL = 'failure_orchestrator'

type Args = { runId: string; workflow: string; headSha: string }
type Classification = { kind: string; hint: string }

function sh(cmd: string, args: string[], allowFail = false): string {
  try {
    return execFileSync(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    }).trim()
  } catch (error) {
    if (allowFail) {
      const e = error as { stdout?: Buffer; stderr?: Buffer }
      return `${e.stdout?.toString() || ''}\n${e.stderr?.toString() || ''}`.trim()
    }
    throw error
  }
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
  const get = (name: string): string => {
    const idx = args.indexOf(`--${name}`)
    if (idx < 0 || !args[idx + 1]) {
      throw new Error(`Missing --${name}`)
    }
    return args[idx + 1]
  }

  return {
    runId: get('run-id'),
    workflow: get('workflow'),
    headSha: get('head-sha'),
  }
}

function collectLogs(maxBytesTotal = 160_000): string {
  const root = '.tmp/logs'
  if (!existsSync(root)) return ''

  const stack = [root]
  const files: string[] = []

  while (stack.length > 0 && files.length < 60) {
    const dir = stack.pop()
    if (!dir) continue

    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      const stats = statSync(full)
      if (stats.isDirectory()) {
        stack.push(full)
      } else if (stats.isFile()) {
        files.push(full)
      }
    }
  }

  let output = ''
  for (const filePath of files.slice(0, 50)) {
    const content = readFileSync(filePath, 'utf8')
    output += `\n\n===== ${filePath} =====\n${content.slice(0, 20_000)}`
    if (output.length >= maxBytesTotal) break
  }

  return output.slice(0, maxBytesTotal)
}

function classify(logText: string): Classification {
  const hit = (re: RegExp): boolean => re.test(logText)

  if (hit(/command not found: rg|rg: not found/i)) {
    return { kind: 'missing_tool', hint: 'ripgrep missing' }
  }
  if (hit(/pnpm: command not found|corepack/i)) {
    return { kind: 'node_tooling', hint: 'pnpm/corepack missing' }
  }
  if (hit(/Missing .*_API_KEY|Missing env:/i)) {
    return { kind: 'missing_secret', hint: 'required env/secret missing' }
  }
  if (hit(/permission denied|Resource not accessible by integration/i)) {
    return { kind: 'permissions', hint: 'token/permissions issue' }
  }
  if (hit(/ESLint|\blint\b/i)) {
    return { kind: 'lint', hint: 'lint errors' }
  }
  if (hit(/TypeScript|\btsc\b|typecheck/i)) {
    return { kind: 'typecheck', hint: 'type errors' }
  }
  if (hit(/\bFAIL\b|Vitest|Jest|Playwright/i)) {
    return { kind: 'tests', hint: 'test failures' }
  }
  if (hit(/next build|Build failed|webpack/i)) {
    return { kind: 'build', hint: 'build failure' }
  }
  return { kind: 'unknown', hint: 'unclassified' }
}

function ensureNotes(): void {
  mkdirSync('NOTES', { recursive: true })
  if (!existsSync('NOTES/backlog.md')) {
    writeFileSync('NOTES/backlog.md', '# Backlog\n\n', 'utf8')
  }
  if (!existsSync('NOTES/runbook.md')) {
    writeFileSync('NOTES/runbook.md', '# Runbook\n\n', 'utf8')
  }
}

function requireEnv(name: string): string {
  const value = (process.env[name] || '').trim()
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

async function deepseek(system: string, user: string): Promise<string> {
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '')

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${requireEnv('DEEPSEEK_API_KEY')}`,
      [process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY']: requireEnv('NSCALE_API_KEY'),
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`DeepSeek error ${response.status}: ${err.slice(0, 500)}`)
  }

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  return body.choices?.[0]?.message?.content?.trim() || 'NO_PATCH'
}

async function main(): Promise<void> {
  if ((process.env.AI_PROVIDER || '').trim() !== 'deepseek') {
    throw new Error('AI_PROVIDER must be deepseek')
  }

  const { runId, workflow, headSha } = parseArgs()
  ensureNotes()

  const oracleEnabled =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().length > 0 &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().length > 0

  let runIdRef: string | null = null

  if (oracleEnabled) {
    const run = await oracleStartRun(TOOL)
    runIdRef = run.id

    const policy = await oracleLoadPolicy(TOOL).catch(() => ({ enabled: true }))
    await oracleEvent(run.id, 'policy_loaded', policy)

    if (policy.enabled === false) {
      throw new Error('Oracle kill-switch disabled failure orchestrator.')
    }

    const budget = await oracleConsumeCalls(TOOL, 1)
    if (!budget.allowed) {
      throw new Error('Oracle daily budget exceeded for failure orchestrator.')
    }
  }

  const logs = collectLogs()
  const cls = classify(logs)

  const systemPrompt = [
    'You are NeXifyAI Master.',
    'Propose a minimal, safe patch to fix the failure.',
    "Return ONLY a git-apply compatible unified diff patch, or the single word 'NO_PATCH'.",
    'Never touch secrets or .env* files.',
    'Do not modify GitHub workflows unless absolutely necessary.',
    'Prefer small script/config fixes over large refactors.',
  ].join('\n')

  const userPrompt = [
    `Workflow: ${workflow}`,
    `Run ID: ${runId}`,
    `Head SHA: ${headSha}`,
    `Classification: ${cls.kind} (${cls.hint})`,
    '',
    'Failure logs (truncated):',
    logs || '(no logs found)',
  ].join('\n')

  const patch = await deepseek(systemPrompt, userPrompt)

  if (patch !== 'NO_PATCH' && patch.includes('diff --git')) {
    mkdirSync('.tmp', { recursive: true })
    writeFileSync('.tmp/ai-fix.patch', patch, 'utf8')
    sh('git', ['apply', '--whitespace=fix', '.tmp/ai-fix.patch'])

    const lintOutput = sh('pnpm', ['lint'], true)
    const typecheckOutput = sh('pnpm', ['typecheck'], true)
    const testOutput = sh('pnpm', ['test'], true)
    const buildOutput = sh('pnpm', ['build'], true)

    const combined = [lintOutput, typecheckOutput, testOutput, buildOutput].join('\n')
    const looksFailed = /(\berror\b|\bfailed\b)/i.test(combined)

    if (!looksFailed) {
      const branch = `ai-fix/${runId}`
      sh('git', ['checkout', '-b', branch])
      sh('git', ['add', '-A'])
      sh('git', ['commit', '-m', `fix: heal failed workflow run ${runId}`])
      sh('git', ['push', 'origin', branch])
      sh('gh', [
        'pr',
        'create',
        '--title',
        `fix: heal failed workflow run ${runId}`,
        '--body',
        `Automated AI fix (DeepSeek+NSCALE) for failure in ${workflow} run ${runId}.`,
        '--base',
        'main',
      ])

      if (oracleEnabled && runIdRef) {
        await oracleFinishRun(runIdRef, true, { runId, workflow, classification: cls })
      }
      return
    }
  }

  const issueTitle = `Failure unhandled automatically: ${workflow} run ${runId}`
  const issueBody = [
    `Workflow: ${workflow}`,
    `Run ID: ${runId}`,
    `Classification: ${cls.kind} (${cls.hint})`,
    '',
    'Logs (truncated):',
    '```',
    logs || '(no logs)',
    '```',
    '',
    'Next actions suggested:',
    '- Check missing secrets/permissions',
    '- Inspect failing step in logs',
    '- If conflict-related, run conflict-resolver workflow',
  ].join('\n')

  sh('gh', ['issue', 'create', '--title', issueTitle, '--body', issueBody], true)

  const backlogPath = 'NOTES/backlog.md'
  const backlog = readFileSync(backlogPath, 'utf8')
  const date = new Date().toISOString().slice(0, 10)
  const entry = `\n- [ ] (${date}) Investigate ${workflow} run ${runId} — ${cls.kind}\n  - Acceptance: CI green for affected workflow\n  - Source: Actions run ${runId}\n`
  writeFileSync(backlogPath, `${backlog}${entry}`, 'utf8')

  if (oracleEnabled && runIdRef) {
    await oracleFinishRun(runIdRef, false, {
      runId,
      workflow,
      classification: cls,
      reason: 'no_patch',
    })
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
