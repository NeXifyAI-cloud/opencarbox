export type AIProviderName = 'mock' | 'deepseek' | 'openai_compat';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatOptions {
  model: string;
  temperature?: number;
}

export interface AIProvider {
  readonly name: AIProviderName;
  listModels(): Promise<string[]>;
  chatCompletion(messages: AIMessage[], options: AIChatOptions): Promise<string>;
}

export interface ProviderSettings {
  provider: AIProviderName;
  model: string;
  baseUrl?: string;
}
