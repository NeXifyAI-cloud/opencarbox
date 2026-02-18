/**
 * Unified AI Client
 * Provides a backward-compatible interface while using the new provider system
 */

import { getAutoSelector } from './auto-selector';
import type { ChatCompletionRequest, ChatCompletionResponse } from './providers/types';

/**
 * Execute a chat completion using the auto-selector
 * This is the new recommended way to interact with AI providers
 */
export async function aiChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const autoSelector = getAutoSelector();
  return autoSelector.chatCompletion(request);
}

/**
 * Legacy deepseekChatCompletion function for backward compatibility
 * @deprecated Use aiChatCompletion instead
 */
export async function deepseekChatCompletion(payload: unknown): Promise<unknown> {
  if (process.env.NODE_ENV === 'development') {
    // Only warn in development, not in tests
    console.warn(
      '[DEPRECATED] deepseekChatCompletion is deprecated. Use aiChatCompletion from @/lib/ai/client instead.'
    );
  }

  const autoSelector = getAutoSelector();
  return autoSelector.chatCompletion(payload as ChatCompletionRequest);
}
