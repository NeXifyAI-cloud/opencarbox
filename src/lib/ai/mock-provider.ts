import { AIChatOptions, AIMessage, AIProvider } from '@/lib/ai/types';

const DEFAULT_MODELS = ['mock-small', 'mock-large'];

export class MockProvider implements AIProvider {
  readonly name = 'mock' as const;

  async listModels(): Promise<string[]> {
    return DEFAULT_MODELS;
  }

  async chatCompletion(messages: AIMessage[], options: AIChatOptions): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const prompt = lastUserMessage?.content ?? 'Hello from mock provider';

    return `[mock:${options.model}] ${prompt}`;
  }
}
