/**
 * AI Provider Configuration Module
 * DeepSeek-only configuration with required NSCALE header support
 */

import type { ProviderConfig } from './types';

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
  const providerType = process.env.AI_PROVIDER || 'deepseek';
  if (providerType !== 'deepseek') {
    throw new Error("AI_PROVIDER must be 'deepseek'.");
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('No valid AI provider configuration found. Set DEEPSEEK_API_KEY environment variable.');
  }

  if (!process.env.NSCALE_API_KEY) {
    throw new Error('NSCALE_API_KEY is required for all DeepSeek requests.');
  }

  const autoSelect = process.env.AI_AUTO_SELECT !== 'false';

  const primary: ProviderConfig = {
    type: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    timeout: process.env.AI_TIMEOUT_MS ? parseInt(process.env.AI_TIMEOUT_MS, 10) : 30000,
    customHeaders: {
      [process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY']: process.env.NSCALE_API_KEY,
    },
  };

  return {
    primary,
    fallbacks: [],
    autoSelect,
    healthCheckInterval: process.env.AI_HEALTH_CHECK_INTERVAL_MS
      ? parseInt(process.env.AI_HEALTH_CHECK_INTERVAL_MS, 10)
      : 300000,
  };
}

export function validateProviderConfig(config: ProviderConfig): boolean {
  return config.type === 'deepseek' && Boolean(config.apiKey);
}

export function getAllAvailableProviders(): ProviderConfig[] {
  if (!process.env.DEEPSEEK_API_KEY || !process.env.NSCALE_API_KEY) {
    return [];
  }

  return [
    {
      type: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      customHeaders: {
        [process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY']: process.env.NSCALE_API_KEY,
      },
    },
  ];
}
