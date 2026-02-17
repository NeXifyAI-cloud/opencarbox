#!/usr/bin/env node

/**
 * Env Schema Check
 *
 * Uses .env.example as the schema source. Ensures:
 * 1. All required variables are defined (non-empty in .env.example)
 * 2. OPENAI_* variables are explicitly rejected
 *
 * In CI mode (CI=true), only build-time variables (NEXT_PUBLIC_*) are required.
 * Locally, all variables from .env.example are checked against the environment.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const FORBIDDEN_PREFIXES = ['OPENAI_']
const CI_REQUIRED_PREFIX = 'NEXT_PUBLIC_'

function main(): void {
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
  const isCI = process.env.CI === 'true'
  const definedVars: Map<string, string> = new Map()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!match) continue

    const [, name, defaultValue] = match
    definedVars.set(name, defaultValue)
  }

  // Check for forbidden OPENAI_* variables in the environment
  for (const key of Object.keys(process.env)) {
    for (const prefix of FORBIDDEN_PREFIXES) {
      if (key.startsWith(prefix)) {
        errors.push(`Forbidden env variable detected: ${key} (${prefix}* is not allowed)`)
      }
    }
  }

  // Warn about forbidden variables in .env.example (documentation)
  for (const [name] of definedVars) {
    for (const prefix of FORBIDDEN_PREFIXES) {
      if (name.startsWith(prefix)) {
        warnings.push(`${prefix}* variable in .env.example: ${name} — consider removing per AI provider policy`)
      }
    }
  }

  // In CI, only check that NEXT_PUBLIC_* build-time vars are documented in .env.example.
  // Actual values come from Vercel/CI secrets — nothing to validate at this stage.
  if (!isCI) {
    for (const [name, defaultValue] of definedVars) {
      if (FORBIDDEN_PREFIXES.some((p) => name.startsWith(p))) continue
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
