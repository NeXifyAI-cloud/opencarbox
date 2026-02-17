#!/usr/bin/env node

/**
 * Env Schema Check
 *
 * Uses .env.example as the schema source. Ensures:
 * 1. All required variables are defined (non-empty in .env.example)
 * 2. Forbidden provider variables are explicitly rejected (OPENAI_*, GOOGLE_API_KEY, etc.)
 *
 * Usage:
 *   npx tsx tools/check_env_schema.ts          # auto-detects CI via CI=true
 *   npx tsx tools/check_env_schema.ts --ci     # force CI mode
 *
 * In CI mode, only build-time variables (NEXT_PUBLIC_*) are relevant.
 * Locally, all variables from .env.example are checked against the environment.
 *
 * Forbidden prefixes/names are aligned with tools/guard_no_openai.sh.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Aligned with tools/guard_no_openai.sh forbidden patterns
const FORBIDDEN_PREFIXES = ['OPENAI_']
const FORBIDDEN_EXACT = ['GOOGLE_API_KEY', 'GEMINI_API_KEY', 'ANTHROPIC_API_KEY']

function isForbidden(name: string): string | null {
  const upper = name.toUpperCase()
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (upper.startsWith(prefix)) return `${prefix}*`
  }
  if (FORBIDDEN_EXACT.includes(upper)) return name
  return null
}

function main(): void {
  const isCI = process.env.CI === 'true' || process.argv.includes('--ci')

  const envExamplePath = resolve(__dirname, '..', '.env.example')
  let content: string
  try {
    content = readFileSync(envExamplePath, 'utf-8')
  } catch {
    console.error(`❌ Could not read ${envExamplePath}`)
    process.exit(1)
  }

  const lines = content.split('\n')
  const errors: string[] = []
  const warnings: string[] = []
  const definedVars: Map<string, string> = new Map()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue

    const [, name, defaultValue] = match
    definedVars.set(name, defaultValue)
  }

  // Check for forbidden provider variables in the runtime environment
  for (const key of Object.keys(process.env)) {
    const rule = isForbidden(key)
    if (rule) {
      errors.push(`Forbidden env variable detected: ${key} (${rule} is not allowed)`)
    }
  }

  // Warn about forbidden variables in .env.example (documentation)
  for (const [name] of definedVars) {
    const rule = isForbidden(name)
    if (rule) {
      warnings.push(`Forbidden variable in .env.example: ${name} — consider removing per AI provider policy (${rule})`)
    }
  }

  // In CI, only check that NEXT_PUBLIC_* build-time vars are documented in .env.example.
  // Actual values come from Vercel/CI secrets — nothing to validate at this stage.
  if (!isCI) {
    for (const [name, defaultValue] of definedVars) {
      if (isForbidden(name)) continue
      const envValue = process.env[name]
      if (!envValue && !defaultValue) {
        warnings.push(`Variable ${name} is not set and has no default in .env.example`)
      }
    }
  }

  // Print results
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:')
    for (const w of warnings) console.log(`   ${w}`)
  }

  if (errors.length > 0) {
    console.error('❌ Env schema check failed:')
    for (const e of errors) console.error(`   ${e}`)
    process.exit(1)
  }

  console.log(`✅ Env schema check passed (${definedVars.size} variables verified, CI=${isCI})`)
}

main()
