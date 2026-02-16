import { serverEnv } from '@/lib/server/env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  provider: 'deepseek' | 'openai_compat';
  messages: ChatMessage[];
  model?: string;
}

interface ChatResult {
  text: string;
  model: string;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('AI request timed out')), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

async function callOpenAICompatible(baseUrl: string, apiKey: string, request: ChatRequest): Promise<ChatResult> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(serverEnv.NSCALE_API_KEY ? { [serverEnv.NSCALE_HEADER_NAME]: serverEnv.NSCALE_API_KEY } : {}),
    },
    body: JSON.stringify({
      model: request.model ?? 'deepseek-chat',
      messages: request.messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Provider failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Provider response missing content');
  }

  return {
    text,
    model: data.model ?? request.model ?? 'unknown',
  };
}

async function executeProviderCall(request: ChatRequest): Promise<ChatResult> {
  if (request.provider === 'deepseek') {
    if (!serverEnv.DEEPSEEK_API_KEY) {
      throw new Error('Missing DEEPSEEK_API_KEY');
    }

    return callOpenAICompatible('https://api.deepseek.com', serverEnv.DEEPSEEK_API_KEY, request);
  }

  if (!serverEnv.OPENAI_COMPAT_API_KEY || !serverEnv.OPENAI_COMPAT_BASE_URL) {
    throw new Error('Missing OPENAI_COMPAT config');
  }

  return callOpenAICompatible(serverEnv.OPENAI_COMPAT_BASE_URL, serverEnv.OPENAI_COMPAT_API_KEY, request);
}

export async function requestChatCompletion(request: ChatRequest): Promise<ChatResult> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= serverEnv.AI_MAX_RETRIES) {
    try {
      return await withTimeout(executeProviderCall(request), serverEnv.AI_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      attempt += 1;
      if (attempt > serverEnv.AI_MAX_RETRIES) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown AI provider failure');
}
