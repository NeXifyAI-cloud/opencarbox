/**
 * AI Provider Configuration Module
 * Manages configuration for different AI providers with priority-based selection
 */

import type { ProviderConfig, ProviderType } from './types';

export interface AIProviderConfiguration {
  primary: ProviderConfig;
  fallbacks: ProviderConfig[];
  autoSelect: boolean;
  healthCheckInterval?: number;
}

/**
 * Get provider configuration from environment variables
 */
export function getProviderConfigFromEnv(): AIProviderConfiguration {
  const providerType = (process.env.AI_PROVIDER || 'deepseek') as ProviderType;
  const autoSelect = process.env.AI_AUTO_SELECT !== 'false'; // Default to true

  // GitHub Models configuration
  const githubModelsConfig: ProviderConfig | null =
    process.env.GITHUB_TOKEN || process.env.GITHUB_MODELS_API_KEY
      ? {
          type: 'github-models',
          apiKey: process.env.GITHUB_TOKEN || process.env.GITHUB_MODELS_API_KEY || '',
          baseUrl: process.env.GITHUB_MODELS_BASE_URL,
          model: process.env.GITHUB_MODELS_MODEL || 'gpt-4o',
          timeout: process.env.AI_TIMEOUT_MS ? parseInt(process.env.AI_TIMEOUT_MS, 10) : 30000,
        }
      : null;

  // DeepSeek configuration
  const deepseekConfig: ProviderConfig | null = process.env.DEEPSEEK_API_KEY
    ? {
        type: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        timeout: process.env.AI_TIMEOUT_MS ? parseInt(process.env.AI_TIMEOUT_MS, 10) : 30000,
        customHeaders: {
          ...(process.env.NSCALE_API_KEY && process.env.NSCALE_HEADER_NAME
            ? { [process.env.NSCALE_HEADER_NAME]: process.env.NSCALE_API_KEY }
            : {}),
        },
      }
    : null;

  // Determine primary provider based on AI_PROVIDER env var
  let primary: ProviderConfig | null = null;
  const fallbacks: ProviderConfig[] = [];

  if (providerType === 'github-models') {
    if (githubModelsConfig) {
      primary = githubModelsConfig;
    }
    if (deepseekConfig) {
      fallbacks.push(deepseekConfig);
    }
  } else {
    // Default to deepseek
    if (deepseekConfig) {
      primary = deepseekConfig;
    }
    if (githubModelsConfig) {
      fallbacks.push(githubModelsConfig);
    }
  }

  if (!primary) {
    throw new Error(
      `No valid AI provider configuration found. Set GITHUB_TOKEN/GITHUB_MODELS_API_KEY or DEEPSEEK_API_KEY environment variable.`
    );
  }

  return {
    primary,
    fallbacks,
    autoSelect,
    healthCheckInterval: process.env.AI_HEALTH_CHECK_INTERVAL_MS
      ? parseInt(process.env.AI_HEALTH_CHECK_INTERVAL_MS, 10)
      : 300000, // 5 minutes default
  };
}

/**
 * Validate provider configuration
 */
export function validateProviderConfig(config: ProviderConfig): boolean {
  if (!config.apiKey || config.apiKey.length === 0) {
    return false;
  }

  if (config.type !== 'github-models' && config.type !== 'deepseek') {
    return false;
  }

  return true;
}

/**
 * Get all available provider configurations
 */
export function getAllAvailableProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // GitHub Models
  if (process.env.GITHUB_TOKEN || process.env.GITHUB_MODELS_API_KEY) {
    providers.push({
      type: 'github-models',
      apiKey: process.env.GITHUB_TOKEN || process.env.GITHUB_MODELS_API_KEY || '',
      baseUrl: process.env.GITHUB_MODELS_BASE_URL,
      model: process.env.GITHUB_MODELS_MODEL || 'gpt-4o',
    });
  }

  // DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    providers.push({
      type: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      customHeaders: {
        ...(process.env.NSCALE_API_KEY && process.env.NSCALE_HEADER_NAME
          ? { [process.env.NSCALE_HEADER_NAME]: process.env.NSCALE_API_KEY }
          : {}),
      },
    });
  }

  return providers;
}
