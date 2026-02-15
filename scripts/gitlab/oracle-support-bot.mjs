#!/usr/bin/env node
import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import OpenAI from 'openai'

const CONFIG = {
  gitlabUrl: (process.env.GITLAB_URL || 'https://gitlab.com').replace(/\/$/, ''),
  projectId: process.env.GITLAB_PROJECT_ID || '',
  token: process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN || '',
  botUsername: process.env.GITLAB_BOT_USERNAME || '',
  pollSeconds: Number(process.env.ORACLE_BOT_POLL_SECONDS || 60),
  maxIssues: Number(process.env.ORACLE_BOT_MAX_ISSUES || 20),
  trigger: (process.env.ORACLE_BOT_TRIGGER || '/oracle').toLowerCase(),
  stateFile:
    process.env.ORACLE_BOT_STATE_FILE ||
    path.join(process.cwd(), '.cline', 'oracle-gitlab-bot-state.json'),
  model:
    process.env.AGENT_MODEL ||
    process.env.DEEPSEEK_MODEL ||
    process.env.OPENAI_MODEL ||
    'deepseek-chat',
}

const aiClient = createAiClient()

function createAiClient() {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY
  const openAiKey = process.env.OPENAI_API_KEY

  if (deepseekApiKey) {
    return new OpenAI({
      apiKey: deepseekApiKey,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    })
  }

  if (openAiKey) {
    return new OpenAI({ apiKey: openAiKey })
  }

  throw new Error('Missing AI credentials: set DEEPSEEK_API_KEY or OPENAI_API_KEY.')
}

async function loadState() {
  try {
    const content = await fs.readFile(CONFIG.stateFile, 'utf8')
    return JSON.parse(content)
  } catch {
    return { lastNoteId: 0, startedAt: new Date().toISOString(), handled: 0 }
  }
}

async function saveState(state) {
  await fs.mkdir(path.dirname(CONFIG.stateFile), { recursive: true })
  await fs.writeFile(CONFIG.stateFile, JSON.stringify(state, null, 2))
}

async function gitlab(pathname, init = {}) {
  const response = await fetch(`${CONFIG.gitlabUrl}/api/v4${pathname}`, {
    ...init,
    headers: {
      'PRIVATE-TOKEN': CONFIG.token,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitLab API error (${response.status}) for ${pathname}: ${text}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function shouldAnswer(note) {
  if (note.system) return false
  const body = (note.body || '').trim()
  if (!body) return false
  const lowerBody = body.toLowerCase()
  return lowerBody.includes(CONFIG.trigger) || lowerBody.includes('?')
}

async function askOracle({ issue, note }) {
  const prompt = [
    'Du bist der 24/7 Oracle Support-Bot für OpenCarBox.',
    'Antworte auf Deutsch, präzise und hilfreich in maximal 8 Bulletpoints.',
    'Wenn Informationen fehlen, stelle am Ende maximal 2 konkrete Rückfragen.',
    '',
    `Issue Titel: ${issue.title}`,
    `Issue Beschreibung: ${(issue.description || 'Keine Beschreibung').slice(0, 3000)}`,
    `Anfrage: ${note.body}`,
  ].join('\n')

  const completion = await aiClient.chat.completions.create({
    model: CONFIG.model,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'Du bist ein technischer Support-Assistent. Gib umsetzbare Schritte, nenne Risiken explizit und vermeide Halluzinationen.',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 700,
  })

  return completion.choices?.[0]?.message?.content?.trim() || 'Ich konnte keine Antwort generieren.'
}

async function processOpenIssues(state) {
  const encodedProject = encodeURIComponent(CONFIG.projectId)
  const issues = await gitlab(
    `/projects/${encodedProject}/issues?state=opened&order_by=updated_at&sort=desc&per_page=${CONFIG.maxIssues}`
  )

  let maxNoteId = state.lastNoteId || 0

  for (const issue of issues) {
    const notes = await gitlab(
      `/projects/${encodedProject}/issues/${issue.iid}/notes?sort=asc&order_by=created_at&per_page=100`
    )

    for (const note of notes) {
      maxNoteId = Math.max(maxNoteId, note.id)

      if (note.id <= state.lastNoteId) continue
      if (CONFIG.botUsername && note.author?.username === CONFIG.botUsername) continue
      if (!shouldAnswer(note)) continue

      console.log(`🤖 Beantworte Issue #${issue.iid}, Note ${note.id}...`)
      const answer = await askOracle({ issue, note })

      await gitlab(`/projects/${encodedProject}/issues/${issue.iid}/notes`, {
        method: 'POST',
        body: JSON.stringify({
          body: `🤖 **Oracle Bot (24/7)**\n\n${answer}\n\n---\n_Antwortmodell: ${CONFIG.model}_`,
        }),
      })

      state.handled += 1
      state.lastHandledAt = new Date().toISOString()
      console.log(`✅ Antwort für Issue #${issue.iid} gesendet.`)
    }
  }

  state.lastNoteId = maxNoteId
  state.lastPollAt = new Date().toISOString()
  await saveState(state)
}

function assertConfig() {
  const missing = []
  if (!CONFIG.projectId) missing.push('GITLAB_PROJECT_ID')
  if (!CONFIG.token) missing.push('GITLAB_TOKEN (oder GITLAB_ACCESS_TOKEN)')
  if (missing.length) {
    throw new Error(`Missing required config: ${missing.join(', ')}`)
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  assertConfig()
  const runOnce = process.argv.includes('--once')
  const state = await loadState()

  console.log('🚀 Oracle GitLab Support Bot gestartet')
  console.log(`📦 Projekt: ${CONFIG.projectId}`)
  console.log(`🧠 Modell: ${CONFIG.model}`)
  console.log(`⏱️ Poll-Intervall: ${CONFIG.pollSeconds}s`)

  do {
    try {
      await processOpenIssues(state)
    } catch (error) {
      console.error('❌ Fehler im Polling-Zyklus:', error.message)
    }

    if (runOnce) break
    await sleep(CONFIG.pollSeconds * 1000)
  } while (true)
}

main().catch((error) => {
  console.error('Fataler Fehler im Oracle Support Bot:', error)
  process.exit(1)
})
