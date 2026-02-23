/**
 * DeepSeek AI Provider
 * Implements the existing DeepSeek integration with the new provider interface
 */

import { BaseAIProvider } from './base';
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ProviderCapabilities,
  ProviderConfig,
  ProviderHealthStatus,
  ProviderType,
} from './types';

export class DeepSeekProvider extends BaseAIProvider {
  private static readonly DEFAULT_BASE_URL = 'https://api.deepseek.com';
  private static readonly DEFAULT_MODEL = 'deepseek-chat';

  constructor(config: ProviderConfig) {
    super(config);
    // Set default base URL if not provided
    if (!this.config.baseUrl) {
      this.config.baseUrl = DeepSeekProvider.DEFAULT_BASE_URL;
    }
    // Set default model if not provided
    if (!this.config.model) {
      this.config.model = DeepSeekProvider.DEFAULT_MODEL;
    }
  }

  getType(): ProviderType {
    return 'deepseek';
  }

  getName(): string {
    return 'DeepSeek';
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();
    const baseUrl = this.config.baseUrl!.replace(/\/$/, '');
    const url = `${baseUrl}/v1/chat/completions`;

    const timeout = this.config.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      };

      // Add custom headers (e.g., NSCALE headers)
      if (this.config.customHeaders) {
        Object.assign(headers, this.config.customHeaders);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          model: request.model || this.config.model,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`DeepSeek API error ${response.status}: ${errorText.slice(0, 300)}`);
      }

      const data = (await response.json()) as ChatCompletionResponse;

      // Update health status on success
      this.healthStatus = {
        available: true,
        latency: Date.now() - startTime,
        lastChecked: new Date(),
      };

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Update health status on failure
      this.healthStatus = {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      };

      throw error;
    }
  }

  async checkHealth(): Promise<ProviderHealthStatus> {
    const startTime = Date.now();

    try {
      // Simple health check with minimal token usage
      const response = await this.chatCompletion({
        model: this.config.model || DeepSeekProvider.DEFAULT_MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
        temperature: 0,
      });

      const latency = Date.now() - startTime;

      this.healthStatus = {
        available: !!response.choices?.[0]?.message,
        latency,
        lastChecked: new Date(),
      };

      return this.healthStatus;
    } catch (error) {
      this.healthStatus = {
        available: false,
        error: error instanceof Error ? error.message : 'Health check failed',
        lastChecked: new Date(),
      };

      return this.healthStatus;
    }
  }

  getCapabilities(): ProviderCapabilities {
    return {
      maxTokens: 64000, // DeepSeek context window
      supportedModels: ['deepseek-chat', 'deepseek-coder'],
      supportsStreaming: true,
      costPerMillion: 0.14, // DeepSeek is cost-effective: $0.14 per million tokens
    };
  }
}
