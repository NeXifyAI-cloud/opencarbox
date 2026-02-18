/**
 * AI Provider Factory
 * Creates and manages AI provider instances with health checks and failover
 */

import { BaseAIProvider } from './base';
import { DeepSeekProvider } from './deepseek';
import type { ProviderConfig, ProviderType } from './types';

/**
 * Create an AI provider instance from configuration
 */
export function createProvider(config: ProviderConfig): BaseAIProvider {
  switch (config.type) {
    case 'deepseek':
      return new DeepSeekProvider(config);
    default:
      throw new Error(`Unknown provider type: ${config.type}`);
  }
}

/**
 * Provider cache to reuse instances
 */
const providerCache = new Map<string, BaseAIProvider>();

/**
 * Get a cached provider instance or create a new one
 */
export function getProvider(config: ProviderConfig): BaseAIProvider {
  const cacheKey = `${config.type}-${config.apiKey.slice(0, 8)}`;

  if (!providerCache.has(cacheKey)) {
    providerCache.set(cacheKey, createProvider(config));
  }

  return providerCache.get(cacheKey)!;
}

/**
 * Clear the provider cache
 */
export function clearProviderCache(): void {
  providerCache.clear();
}

/**
 * Check health of multiple providers in parallel
 */
export async function checkProvidersHealth(
  providers: BaseAIProvider[]
): Promise<Map<ProviderType, boolean>> {
  const healthChecks = providers.map(async (provider) => {
    try {
      const status = await provider.checkHealth();
      return { type: provider.getType(), available: status.available };
    } catch {
      return { type: provider.getType(), available: false };
    }
  });

  const results = await Promise.all(healthChecks);
  const healthMap = new Map<ProviderType, boolean>();

  for (const result of results) {
    healthMap.set(result.type, result.available);
  }

  return healthMap;
}

/**
 * Find the first available provider from a list
 */
export async function findFirstAvailableProvider(
  configs: ProviderConfig[]
): Promise<BaseAIProvider | null> {
  for (const config of configs) {
    try {
      const provider = getProvider(config);
      const status = await provider.checkHealth();
      if (status.available) {
        return provider;
      }
    } catch {
      // Continue to next provider
      continue;
    }
  }

  return null;
}
