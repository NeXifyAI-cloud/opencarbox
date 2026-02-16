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

function createRequest(body: unknown, ip = '127.0.0.1') {
  return new Request('http://localhost/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
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
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.code).toBe('FEATURE_DISABLED');
  });

  it('returns 400 for invalid payload', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(createRequest({ messages: [] }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Validation failed.');
    expect(json.code).toBe('VALIDATION_ERROR');
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
    expect(json.code).toBe('AI_UPSTREAM_ERROR');
  });

  it('returns 429 when rate limit is exceeded for same client', async () => {
    process.env.FEATURE_AI_CHAT = 'true';
    process.env.AI_CHAT_RATE_LIMIT_PER_MINUTE = '1';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      id: 'cmpl-1',
      choices: [{ message: { role: 'assistant', content: 'Antwort' } }],
    });

    const first = await POST(createRequest({ messages: [{ role: 'user', content: 'Hallo' }] }, '1.2.3.4'));
    const second = await POST(createRequest({ messages: [{ role: 'user', content: 'Nochmal' }] }, '1.2.3.4'));
    const json = await second.json();

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect(json.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(second.headers.get('Retry-After')).toBeTruthy();
  });
});
