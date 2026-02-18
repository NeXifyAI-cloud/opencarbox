/**
 * GitHub Models AI Provider
 * Uses GitHub's native AI models via the GitHub Models API
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

export class GitHubModelsProvider extends BaseAIProvider {
  private static readonly DEFAULT_BASE_URL = 'https://models.inference.ai.azure.com';
  private static readonly DEFAULT_MODEL = 'gpt-4o';

  constructor(config: ProviderConfig) {
    super(config);
    // Set default base URL if not provided
    if (!this.config.baseUrl) {
      this.config.baseUrl = GitHubModelsProvider.DEFAULT_BASE_URL;
    }
    // Set default model if not provided
    if (!this.config.model) {
      this.config.model = GitHubModelsProvider.DEFAULT_MODEL;
    }
  }

  getType(): ProviderType {
    return 'github-models';
  }

  getName(): string {
    return 'GitHub Models';
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();
    const baseUrl = this.config.baseUrl!.replace(/\/$/, '');
    const url = `${baseUrl}/chat/completions`;

    const timeout = this.config.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          ...this.config.customHeaders,
        },
        body: JSON.stringify({
          ...request,
          model: request.model || this.config.model,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `GitHub Models API error ${response.status}: ${errorText.slice(0, 300)}`
        );
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
        model: this.config.model || GitHubModelsProvider.DEFAULT_MODEL,
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
      maxTokens: 128000, // GPT-4o context window
      supportedModels: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4',
        'gpt-3.5-turbo',
        'claude-3-5-sonnet',
        'claude-3-opus',
        'claude-3-haiku',
      ],
      supportsStreaming: true,
      costPerMillion: 2.5, // Approximate cost per million tokens (varies by model)
    };
  }
}
