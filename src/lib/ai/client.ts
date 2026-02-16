import { getEnv } from '@/lib/config/env'

export type AiProviderName = 'deepseek' | 'openai_compat'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  provider?: AiProviderName
  model?: string
  timeoutMs?: number
  retries?: number
  baseUrl?: string
}

export interface AiProvider {
  listModels(): Promise<string[]>
  chatCompletion(messages: ChatMessage[], options?: ChatOptions): Promise<string>
}

const circuitState = new Map<AiProviderName, { failures: number; openedAt?: number }>()

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number): Promise<Response> {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), timeoutMs)

  try {
    return await fetch(input, { ...init, signal: abortController.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function isCircuitOpen(provider: AiProviderName): boolean {
  const state = circuitState.get(provider)
  if (!state?.openedAt) {
    return false
  }

  return Date.now() - state.openedAt < 60_000
}

function registerCircuitResult(provider: AiProviderName, success: boolean): void {
  const current = circuitState.get(provider) ?? { failures: 0 }
  if (success) {
    circuitState.set(provider, { failures: 0 })
    return
  }

  const failures = current.failures + 1
  circuitState.set(provider, {
    failures,
    openedAt: failures >= 5 ? Date.now() : undefined,
  })
}

async function postChatCompletions(
  endpoint: string,
  headers: Record<string, string>,
  payload: Record<string, unknown>,
  provider: AiProviderName,
  retries: number,
  timeoutMs: number
): Promise<string> {
  if (isCircuitOpen(provider)) {
    throw new Error('CIRCUIT_OPEN')
  }

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
        },
        timeoutMs
      )

      if (!response.ok) {
        throw new Error(`UPSTREAM_${response.status}`)
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('EMPTY_RESPONSE')
      }

      registerCircuitResult(provider, true)
      return content
    } catch (error) {
      registerCircuitResult(provider, false)
      if (attempt >= retries) {
        throw error
      }

      const jitterMs = Math.floor(Math.random() * 120)
      await sleep(200 * (attempt + 1) + jitterMs)
    }
  }

  throw new Error('RETRY_EXHAUSTED')
}

class DeepSeekProvider implements AiProvider {
  constructor(private readonly env = getEnv()) {}

  async listModels(): Promise<string[]> {
    return ['deepseek-chat', 'deepseek-reasoner']
  }

  async chatCompletion(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const endpoint = `${options?.baseUrl ?? 'https://api.deepseek.com'}/v1/chat/completions`
    return postChatCompletions(
      endpoint,
      { Authorization: `Bearer ${this.env.DEEPSEEK_API_KEY ?? ''}` },
      {
        model: options?.model ?? this.env.AI_DEFAULT_MODEL,
        messages,
      },
      'deepseek',
      options?.retries ?? 2,
      options?.timeoutMs ?? 12_000
    )
  }
}

class OpenAiCompatProvider implements AiProvider {
  constructor(private readonly env = getEnv()) {}

  async listModels(): Promise<string[]> {
    return ['gpt-4o-mini', 'gpt-4.1-mini']
  }

  async chatCompletion(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const endpoint = `${options?.baseUrl ?? this.env.OPENAI_COMPAT_BASE_URL ?? 'https://api.openai.com'}/v1/chat/completions`
    return postChatCompletions(
      endpoint,
      {
        Authorization: `Bearer ${this.env.OPENAI_COMPAT_API_KEY ?? ''}`,
        'X-NSCALE-API-KEY': this.env.NSCALE_API_KEY ?? '',
      },
      {
        model: options?.model ?? this.env.AI_DEFAULT_MODEL,
        messages,
      },
      'openai_compat',
      options?.retries ?? 2,
      options?.timeoutMs ?? 12_000
    )
  }
}

export function createAiProvider(provider: AiProviderName, env = getEnv()): AiProvider {
  if (provider === 'deepseek') {
    return new DeepSeekProvider(env)
  }

  return new OpenAiCompatProvider(env)
}
