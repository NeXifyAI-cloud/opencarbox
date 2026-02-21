/**
 * Base AI Provider interface
 * All AI providers must implement this interface
 */

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ProviderCapabilities,
  ProviderConfig,
  ProviderHealthStatus,
  ProviderType,
} from './types';

export abstract class BaseAIProvider {
  protected config: ProviderConfig;
  protected healthStatus: ProviderHealthStatus;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.healthStatus = {
      available: false,
      lastChecked: new Date(),
    };
  }

  /**
   * Get the provider type
   */
  abstract getType(): ProviderType;

  /**
   * Get the provider name for display/logging
   */
  abstract getName(): string;

  /**
   * Execute a chat completion request
   */
  abstract chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;

  /**
   * Check if the provider is available and healthy
   */
  abstract checkHealth(): Promise<ProviderHealthStatus>;

  /**
   * Get provider capabilities
   */
  abstract getCapabilities(): ProviderCapabilities;

  /**
   * Get the current health status (cached)
   */
  getHealthStatus(): ProviderHealthStatus {
    return this.healthStatus;
  }

  /**
   * Get the provider configuration
   */
  getConfig(): ProviderConfig {
    return this.config;
  }

  /**
   * Estimate cost for a given token count
   */
  estimateCost(tokens: number): number {
    const capabilities = this.getCapabilities();
    if (!capabilities.costPerMillion) return 0;
    return (tokens / 1_000_000) * capabilities.costPerMillion;
  }
}
