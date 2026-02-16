import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '../../src/app/api/ai/chat/route';

vi.mock('../../src/lib/ai/deepseekClient', () => ({
  deepseekChatCompletion: vi.fn(),
}));

import { deepseekChatCompletion } from '../../src/lib/ai/deepseekClient';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.clearAllMocks();
});

function createRequest(body: unknown) {
  return new Request('http://localhost/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/ai/chat', () => {
  it('returns 503 when feature flag disables AI chat', async () => {
    process.env.FEATURE_AI_CHAT = 'false';

    const response = await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Hallo' }],
      })
    );

    expect(response.status).toBe(503);
  });

  it('returns 400 for invalid payload', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(createRequest({ messages: [] }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Validation failed.');
  });

  it('returns 400 when body is not valid JSON', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(
      new Request('http://localhost/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{invalid',
      })
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid JSON body.');
  });

  it('proxies valid payload to deepseek client', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      id: 'cmpl-1',
      choices: [{ message: { role: 'assistant', content: 'Antwort' } }],
    });

    const response = await POST(
      createRequest({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Frage' }],
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(deepseekChatCompletion).toHaveBeenCalledWith({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Frage' }],
    });
    expect(json.provider).toBe('deepseek');
    expect(json.id).toBe('cmpl-1');
  });

  it('maps provider errors to 502', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockRejectedValue(new Error('upstream failed'));

    const response = await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Frage' }],
      })
    );
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.error).toBe('AI provider request failed.');
    expect(json.message).toContain('upstream failed');
  });

  it('maps non-Error provider failures to fallback message', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockRejectedValue('provider unavailable');

    const response = await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Frage' }],
      })
    );
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.error).toBe('AI provider request failed.');
    expect(json.message).toBe('Unknown AI provider error.');
  });
});
