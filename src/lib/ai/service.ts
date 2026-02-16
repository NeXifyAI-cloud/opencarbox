import type { ChatMessage } from '@/lib/ai/client'
import { createAiProvider } from '@/lib/ai/client'
import { getEnv } from '@/lib/config/env'

export async function runChatCompletion(messages: ChatMessage[], providerName?: 'deepseek' | 'openai_compat', model?: string): Promise<string> {
  const env = getEnv()
  const provider = createAiProvider(providerName ?? env.AI_DEFAULT_PROVIDER, env)
  return provider.chatCompletion(messages, { model })
}
