import { env } from '@/lib/config/env';
import { MockProvider } from '@/lib/ai/mock-provider';
import { AIChatOptions, AIMessage, AIProvider, AIProviderName } from '@/lib/ai/types';

class OpenAICompatibleProvider implements AIProvider {
  constructor(
    readonly name: 'deepseek' | 'openai_compat',
    private readonly baseUrl: string,
    private readonly apiKey?: string,
    private readonly nscaleApiKey?: string,
  ) {}

  async listModels(): Promise<string[]> {
    if (!this.apiKey) {
      return ['missing-api-key'];
    }

    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        ...(this.nscaleApiKey ? { 'X-NSCALE-API-KEY': this.nscaleApiKey } : {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`listModels failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { data?: Array<{ id: string }> };
    return payload.data?.map((entry) => entry.id) ?? [];
  }

  async chatCompletion(messages: AIMessage[], options: AIChatOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error(`Missing API key for provider ${this.name}`);
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...(this.nscaleApiKey ? { 'X-NSCALE-API-KEY': this.nscaleApiKey } : {}),
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature ?? 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`chatCompletion failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return payload.choices?.[0]?.message?.content ?? '';
  }
}

export const getProvider = (providerName: AIProviderName): AIProvider => {
  if (providerName === 'mock') {
    return new MockProvider();
  }

  if (providerName === 'deepseek') {
    return new OpenAICompatibleProvider('deepseek', env.DEEPSEEK_BASE_URL, env.DEEPSEEK_API_KEY, env.NSCALE_API_KEY);
  }

  return new OpenAICompatibleProvider(
    'openai_compat',
    env.OPENAI_COMPAT_BASE_URL,
    env.OPENAI_COMPAT_API_KEY,
    env.NSCALE_API_KEY,
  );
};
