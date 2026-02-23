/**
 * Common types for AI provider system
 */

export type ProviderType = 'github-models' | 'deepseek';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface ChatCompletionChoice {
  message?: {
    role: string;
    content?: string;
  };
  finish_reason?: string;
  index: number;
}

export interface ChatCompletionResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  timeout?: number;
  maxRetries?: number;
  customHeaders?: Record<string, string>;
}

export interface ProviderHealthStatus {
  available: boolean;
  latency?: number;
  error?: string;
  lastChecked: Date;
}

export interface ProviderMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageLatency: number;
  totalCost?: number;
}

export interface ProviderCapabilities {
  maxTokens: number;
  supportedModels: string[];
  supportsStreaming: boolean;
  costPerMillion?: number;
}
