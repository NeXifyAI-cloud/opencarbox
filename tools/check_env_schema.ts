#!/usr/bin/env node

/**
 * Env Schema Check — validates environment against .env.example
 *
 * Usage:
 *   npx tsx tools/check_env_schema.ts          # check current env
 *   npx tsx tools/check_env_schema.ts --ci     # CI mode (only build-critical vars)
 *
 * Exits with code 1 if:
 *   - Any OPENAI_* env var is set (forbidden provider)
 *   - Required vars (from .env.example) are missing in non-CI mode
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const FORBIDDEN_ENV_VARS = ['OPENAI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY', 'ANTHROPIC_API_KEY']

// Vars that CI build actually needs (subset of .env.example)
const CI_REQUIRED: string[] = []

// Vars that are optional / have sensible defaults
const OPTIONAL_VARS = new Set([
  'SENTRY_DSN',
  'FEATURE_AI_CHAT',
  'NSCALE_HEADER_NAME',
  'RATE_LIMIT_PER_MINUTE',
  'AI_TIMEOUT_MS',
  'AI_DEFAULT_PROVIDER',
  'AI_DEFAULT_MODEL',
])

function parseEnvExample(path: string): string[] {
  const content = readFileSync(path, 'utf-8')
  const vars: string[] = []
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=/)
    if (match) vars.push(match[1])
  }
  return vars
}

function main() {
  const ciMode = process.argv.includes('--ci')
  const envExamplePath = resolve(process.cwd(), '.env.example')

  let schemaVars: string[]
  try {
    schemaVars = parseEnvExample(envExamplePath)
  } catch {
    console.error('❌ Could not read .env.example')
    process.exit(1)
  }

  const errors: string[] = []

  // Check for forbidden provider env vars
  const envKeys = Object.keys(process.env)
  for (const forbidden of FORBIDDEN_ENV_VARS) {
    const found = envKeys.filter((k) => k.startsWith(forbidden))
    if (found.length > 0) {
      errors.push(`Forbidden env var(s) detected: ${found.join(', ')}`)
    }
  }

  // Additionally reject any OPENAI_ prefixed vars (except OPENAI_COMPAT_*)
  const openAiVars = envKeys.filter((k) => k.startsWith('OPENAI_') && !k.startsWith('OPENAI_COMPAT'))
  if (openAiVars.length > 0) {
    errors.push(`Forbidden OPENAI_* env var(s): ${openAiVars.join(', ')}`)
  }

  // In CI mode, only check CI_REQUIRED
  if (ciMode) {
    for (const v of CI_REQUIRED) {
      if (!process.env[v]) {
        errors.push(`Missing CI-required env var: ${v}`)
      }
    }
  } else {
    // Full mode: check all non-optional vars from .env.example
    for (const v of schemaVars) {
      if (OPTIONAL_VARS.has(v)) continue
      if (!process.env[v]) {
        errors.push(`Missing env var: ${v} (defined in .env.example)`)
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Env schema check failed:')
    for (const e of errors) console.error(`   - ${e}`)
    process.exit(1)
  }

  console.log(`✅ Env schema check passed (mode: ${ciMode ? 'ci' : 'full'}, vars: ${schemaVars.length})`)
}

main()
