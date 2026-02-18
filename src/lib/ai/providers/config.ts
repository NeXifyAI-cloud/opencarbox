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

  if (providerType !== 'deepseek') {
    throw new Error('AI_PROVIDER must be deepseek. Other providers are disabled by policy.');
  }

  // DeepSeek configuration
  const nscaleHeaderName = process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY';
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  const nscaleApiKey = process.env.NSCALE_API_KEY;

  if (!deepseekApiKey || !nscaleApiKey) {
    throw new Error(
      'DeepSeek configuration is incomplete. DEEPSEEK_API_KEY and NSCALE_API_KEY are required.'
    );
  }

  const primary: ProviderConfig = {
    type: 'deepseek',
    apiKey: deepseekApiKey,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    timeout: process.env.AI_TIMEOUT_MS ? parseInt(process.env.AI_TIMEOUT_MS, 10) : 30000,
    customHeaders: {
      [nscaleHeaderName]: nscaleApiKey,
    },
  };

  return {
    primary,
    fallbacks: [],
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

  if (config.type !== 'deepseek') {
    return false;
  }

  if (!config.customHeaders || Object.keys(config.customHeaders).length === 0) {
    return false;
  }

  return true;
}

/**
 * Get all available provider configurations
 */
export function getAllAvailableProviders(): ProviderConfig[] {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  const nscaleApiKey = process.env.NSCALE_API_KEY;
  if (!deepseekApiKey || !nscaleApiKey) {
    return [];
  }

  const nscaleHeaderName = process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY';
  return [
    {
      type: 'deepseek',
      apiKey: deepseekApiKey,
      baseUrl: process.env.DEEPSEEK_BASE_URL,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      customHeaders: {
        [nscaleHeaderName]: nscaleApiKey,
      },
    },
  ];
}
