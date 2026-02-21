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

function createRequest(body: unknown, ip = '203.0.113.10') {
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
    expect(json.error.code).toBe('FEATURE_DISABLED');
  });

  it('returns 422 for invalid payload', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(createRequest({ messages: [] }, '203.0.113.11'));
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('proxies valid payload to deepseek client', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      id: 'cmpl-1',
      choices: [{ message: { role: 'assistant', content: 'Antwort' }, index: 0 }],
    });

    const response = await POST(
      createRequest(
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Frage' }],
        },
        '203.0.113.12'
      )
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(deepseekChatCompletion).toHaveBeenCalledWith({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Frage' }],
    });
    expect(json.success).toBe(true);
    expect(json.data.provider).toBe('deepseek');
    expect(json.data.id).toBe('cmpl-1');
  });

  it('maps provider errors to 502', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockRejectedValue(new Error('DeepSeek error 500: upstream failed'));

    const response = await POST(
      createRequest(
        {
          messages: [{ role: 'user', content: 'Frage' }],
        },
        '203.0.113.13'
      )
    );
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.error.code).toBe('UPSTREAM_ERROR');
    expect(json.error.details.message).toContain('upstream failed');
  });
});
