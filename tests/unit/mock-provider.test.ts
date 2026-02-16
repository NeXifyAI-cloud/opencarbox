import { describe, expect, it } from 'vitest';
import { MockProvider } from '@/lib/ai/mock-provider';

describe('MockProvider', () => {
  it('lists mock models', async () => {
    const provider = new MockProvider();
    await expect(provider.listModels()).resolves.toEqual(['mock-small', 'mock-large']);
  });

  it('returns deterministic chat response', async () => {
    const provider = new MockProvider();
    const result = await provider.chatCompletion([{ role: 'user', content: 'hello' }], { model: 'mock-small' });

    expect(result).toBe('[mock:mock-small] hello');
  });
});
