import { logger } from "@/lib/logger";
/**
 * AI Provider Auto-Selection Logic
 * Intelligently selects the optimal AI provider based on availability, cost, and performance
 */

import { BaseAIProvider } from './providers/base';
import { getProviderConfigFromEnv, validateProviderConfig } from './providers/config';
import { getProvider } from './providers/factory';
import type { ChatCompletionRequest, ChatCompletionResponse } from './providers/types';

export interface SelectionResult {
  provider: BaseAIProvider;
  reason: string;
  fallbackUsed: boolean;
}

export interface SelectionStrategy {
  preferCost?: boolean; // Prefer lower cost providers
  preferLatency?: boolean; // Prefer faster providers
  requireHealthCheck?: boolean; // Check health before selection
  maxLatency?: number; // Maximum acceptable latency in ms
}

/**
 * Logger for auto-selector events
 */
function log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
  if (process.env.NODE_ENV !== 'test') {
    const prefix = '[AIAutoSelector]';
    if (level === 'error') {
      logger.error(`${prefix} ${message}`);
    } else if (level === 'warn') {
      logger.warn(`${prefix} ${message}`);
    } else {
      // Only log in development or when AI_DEBUG is enabled
      if (process.env.NODE_ENV === 'development' || process.env.AI_DEBUG === 'true') {
        logger.info(`${prefix} ${message}`);
      }
    }
  }
}

/**
 * Auto-selector class for managing provider selection
 */
export class AIAutoSelector {
  private primaryProvider: BaseAIProvider | null = null;
  private fallbackProviders: BaseAIProvider[] = [];
  private autoSelect: boolean;
  private lastHealthCheck: Date | null = null;
  private healthCheckInterval: number;

  constructor() {
    const config = getProviderConfigFromEnv();
    this.autoSelect = config.autoSelect;
    this.healthCheckInterval = config.healthCheckInterval || 300000;

    // Initialize primary provider
    if (validateProviderConfig(config.primary)) {
      this.primaryProvider = getProvider(config.primary);
    }

    // Initialize fallback providers
    for (const fallbackConfig of config.fallbacks) {
      if (validateProviderConfig(fallbackConfig)) {
        this.fallbackProviders.push(getProvider(fallbackConfig));
      }
    }

    if (!this.primaryProvider && this.fallbackProviders.length === 0) {
      throw new Error('No valid AI providers configured');
    }
  }

  /**
   * Select the optimal provider based on strategy
   */
  async selectProvider(strategy?: SelectionStrategy): Promise<SelectionResult> {
    const effectiveStrategy: SelectionStrategy = {
      preferCost: false,
      preferLatency: true,
      requireHealthCheck: true,
      maxLatency: 10000,
      ...strategy,
    };

    // If auto-select is disabled, always use primary
    if (!this.autoSelect) {
      if (!this.primaryProvider) {
        throw new Error('Primary provider not available and auto-select is disabled');
      }
      return {
        provider: this.primaryProvider,
        reason: 'Auto-select disabled, using primary provider',
        fallbackUsed: false,
      };
    }

    // Check if health check is needed
    const needsHealthCheck =
      effectiveStrategy.requireHealthCheck &&
      (!this.lastHealthCheck ||
        Date.now() - this.lastHealthCheck.getTime() > this.healthCheckInterval);

    if (needsHealthCheck) {
      await this.performHealthChecks();
    }

    // Try primary provider first
    if (this.primaryProvider) {
      const health = this.primaryProvider.getHealthStatus();
      const meetsLatencyRequirement =
        !health.latency || health.latency <= (effectiveStrategy.maxLatency || Infinity);

      if (health.available && meetsLatencyRequirement) {
        log(`Using primary provider: ${this.primaryProvider.getName()}`);
        return {
          provider: this.primaryProvider,
          reason: 'Primary provider available and healthy',
          fallbackUsed: false,
        };
      }
    }

    // Try fallback providers
    for (const provider of this.fallbackProviders) {
      const health = provider.getHealthStatus();
      const meetsLatencyRequirement =
        !health.latency || health.latency <= (effectiveStrategy.maxLatency || Infinity);

      if (health.available && meetsLatencyRequirement) {
        log(
          `Using fallback provider: ${provider.getName()} (reason: ${health.error || 'primary unavailable'})`
        );
        return {
          provider,
          reason: `Fallback to ${provider.getName()}: ${health.error || 'primary unavailable'}`,
          fallbackUsed: true,
        };
      }
    }

    // If all health checks failed, try without health check requirement
    if (this.primaryProvider) {
      log(`Using primary provider without health confirmation: ${this.primaryProvider.getName()}`, 'warn');
      return {
        provider: this.primaryProvider,
        reason: 'Using primary provider despite health check failure',
        fallbackUsed: false,
      };
    }

    throw new Error('No available AI providers found');
  }

  /**
   * Execute a chat completion with automatic provider selection and fallback
   */
  async chatCompletion(
    request: ChatCompletionRequest,
    strategy?: SelectionStrategy
  ): Promise<ChatCompletionResponse> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const selection = await this.selectProvider(strategy);
        const response = await selection.provider.chatCompletion(request);

        // Log successful selection
        if (selection.fallbackUsed) {
          log(`Fallback succeeded: ${selection.provider.getName()} (attempt ${attempt})`);
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        log(`Attempt ${attempt} failed: ${lastError.message}`, 'error');

        // Force health check on next attempt
        this.lastHealthCheck = null;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Brief delay before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw lastError || new Error('All provider attempts failed');
  }

  /**
   * Perform health checks on all providers
   */
  private async performHealthChecks(): Promise<void> {
    const providers = [this.primaryProvider, ...this.fallbackProviders].filter(
      (p): p is BaseAIProvider => p !== null
    );

    await Promise.all(
      providers.map(async (provider) => {
        try {
          await provider.checkHealth();
        } catch (error) {
          log(
            `Health check failed for ${provider.getName()}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'warn'
          );
        }
      })
    );

    this.lastHealthCheck = new Date();
  }

  /**
   * Get all configured providers
   */
  getAllProviders(): BaseAIProvider[] {
    return [this.primaryProvider, ...this.fallbackProviders].filter(
      (p): p is BaseAIProvider => p !== null
    );
  }

  /**
   * Force a health check on all providers
   */
  async forceHealthCheck(): Promise<void> {
    this.lastHealthCheck = null;
    await this.performHealthChecks();
  }
}

/**
 * Singleton instance of the auto-selector
 */
let autoSelectorInstance: AIAutoSelector | null = null;

/**
 * Get the singleton auto-selector instance
 */
export function getAutoSelector(): AIAutoSelector {
  if (!autoSelectorInstance) {
    autoSelectorInstance = new AIAutoSelector();
  }
  return autoSelectorInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetAutoSelector(): void {
  autoSelectorInstance = null;
}
