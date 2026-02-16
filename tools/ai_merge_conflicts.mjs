#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const markerPattern = /^<{7}|^={7}|^>{7}/m

function trackedFilesWithConflicts() {
  const output = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim()
  return output ? output.split('\n').filter(Boolean) : []
}

function ensureNoMarkers(files) {
  const unresolved = files.filter((file) => markerPattern.test(readFileSync(file, 'utf8')))
  if (unresolved.length > 0) {
    throw new Error(`Unresolved conflict markers remain: ${unresolved.join(', ')}`)
  }
}

async function askAiToResolve(content, filePath) {
  const baseUrl = process.env.OPENAI_COMPAT_BASE_URL
  const apiKey = process.env.OPENAI_COMPAT_API_KEY || process.env.DEEPSEEK_API_KEY

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Missing OPENAI_COMPAT_BASE_URL or compatible API key for AI conflict resolution'
    )
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  if (process.env.NSCALE_API_KEY && process.env.NSCALE_HEADER_NAME) {
    headers[process.env.NSCALE_HEADER_NAME] = process.env.NSCALE_API_KEY
  }

  const body = {
    model: process.env.OPENAI_COMPAT_MODEL || 'deepseek-chat',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You resolve git conflicts conservatively. Return only the fully resolved file content without markdown fences.',
      },
      {
        role: 'user',
        content: `Resolve merge conflict markers in this file safely:\nFILE: ${filePath}\n\n${content}`,
      },
    ],
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`AI provider returned HTTP ${response.status}`)
  }

  const payload = await response.json()
  const text = payload?.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new Error('AI provider returned no content')
  }

  return text
}

async function main() {
  const files = trackedFilesWithConflicts()
  if (files.length === 0) {
    console.log('No conflicted files found.')
    return
  }

  for (const file of files) {
    const original = readFileSync(file, 'utf8')
    const resolved = await askAiToResolve(original, file)

    if (markerPattern.test(resolved)) {
      throw new Error(`AI response for ${file} still contains conflict markers`)
    }

    writeFileSync(file, resolved, 'utf8')
    execSync(`git add ${JSON.stringify(file)}`)
    console.log(`Resolved ${file}`)
  }

  ensureNoMarkers(files)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
