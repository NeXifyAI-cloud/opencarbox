/**
 * CI AI Decision Helper
 *
 * Provider priority:
 * 1) NSCALE (OpenAI-compatible; ideal for OSS models like gpt-oss)
 * 2) DeepSeek
 * 3) deterministic fallback text
 */

type Mode = 'oracle' | 'autofix' | 'ci-health'

interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

interface CliArgs {
  mode: Mode
  input: string
}

function parseArgs(): CliArgs {
  const [, , mode, ...rest] = process.argv
  if (!mode || !['oracle', 'autofix', 'ci-health'].includes(mode)) {
    throw new Error('Usage: tsx scripts/ci/ai-decision.ts <oracle|autofix|ci-health> <input>')
  }

  return {
    mode: mode as Mode,
    input: rest.join(' ').trim(),
  }
}

function promptForMode(mode: Mode, input: string): ChatMessage[] {
  if (mode === 'oracle') {
    return [
      {
        role: 'system',
        content:
          'Du bist ein CI-Orakel. Antworte auf Deutsch, präzise, in genau 2 Bullet-Points: 1) Fehlerklassifikation, 2) Fix-Reason.',
      },
      { role: 'user', content: `Oracle-Input:\n${input}` },
    ]
  }

  if (mode === 'autofix') {
    return [
      {
        role: 'system',
        content:
          'Du bewertest Autofix-Diffs. Antworte auf Deutsch, genau 2 Bullet-Points: 1) Risikoklasse, 2) Empfehlung.',
      },
      { role: 'user', content: `Autofix-Input:\n${input}` },
    ]
  }

  return [
    {
      role: 'system',
      content:
        'Du bist CI Reliability Analyst. Antworte auf Deutsch in maximal 4 Bullet-Points mit Trends, Flake-Hinweisen und 1 konkreten Optimierung.',
    },
    { role: 'user', content: `CI-Health-Input:\n${input}` },
  ]
}

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<string | null> {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      messages,
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
  return data.choices?.[0]?.message?.content?.trim() || null
}

function fallbackText(mode: Mode): string {
  if (mode === 'oracle') {
    return '- Fehlerklassifikation: Required checks nicht vollständig grün auf PR-Head.\n- Fix-Reason: Fast+Full Gate müssen auf dem aktuellen Head-SHA erfolgreich sein.'
  }

  if (mode === 'autofix') {
    return '- Risikoklasse: regelbasiert bewertet.\n- Empfehlung: Verbotene Pfade niemals automatisch mergen.'
  }

  return '- Trend: Keine KI-Analyse verfügbar.\n- Empfehlung: CI-Ausfälle nach Workflow clustern und Flake-Kandidaten priorisieren.'
}

async function main() {
  const { mode, input } = parseArgs()
  const messages = promptForMode(mode, input || '(kein Input übergeben)')

  const nscaleKey = process.env.NSCALE_API_KEY
  const deepseekKey = process.env.DEEPSEEK_API_KEY

  const nscaleBaseUrl = process.env.NSCALE_BASE_URL || 'https://inference.api.nscale.com/v1'
  const nscaleModel = process.env.NSCALE_MODEL || 'openai/gpt-oss-120b'

  const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  const deepseekModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

  let result: string | null = null

  if (nscaleKey) {
    result = await callOpenAiCompatible(nscaleBaseUrl, nscaleKey, nscaleModel, messages)
  }

  if (!result && deepseekKey) {
    result = await callOpenAiCompatible(deepseekBaseUrl, deepseekKey, deepseekModel, messages)
  }

  process.stdout.write((result || fallbackText(mode)).trim())
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(
    `- KI-Analyse fehlgeschlagen: ${message}\n- Empfehlung: Fallback-Regeln anwenden.`
  )
  process.exit(0)
})
