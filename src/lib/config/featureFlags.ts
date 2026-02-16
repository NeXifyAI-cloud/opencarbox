import { env } from '@/lib/config/env';

export const featureFlags = {
  aiChat: env.server.FEATURE_AI_CHAT !== 'false',
  sentryEnabled: Boolean(env.server.SENTRY_DSN),
};

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}
