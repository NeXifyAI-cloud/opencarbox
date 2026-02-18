/**
 * Legacy DeepSeek client
 * @deprecated This module is maintained for backward compatibility only.
 * Use the new provider system: import { aiChatCompletion } from '@/lib/ai/client'
 */

import { getAutoSelector } from './auto-selector';
import type { ChatCompletionRequest } from './providers/types';

/**
 * Execute a chat completion request
 * Now uses the new auto-selector system with fallback support
 * @deprecated Use aiChatCompletion from @/lib/ai/client instead
 */
export async function deepseekChatCompletion(payload: unknown) {
  // Use the new auto-selector system for better reliability
  const autoSelector = getAutoSelector();
  return autoSelector.chatCompletion(payload as ChatCompletionRequest);
}
