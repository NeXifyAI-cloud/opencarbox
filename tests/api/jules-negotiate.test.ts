import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '../../src/app/api/ai/jules/negotiate/route';

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
  return new Request('http://localhost/api/ai/jules/negotiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/ai/jules/negotiate', () => {
  it('returns 503 when FEATURE_AI_CHAT is disabled', async () => {
    process.env.FEATURE_AI_CHAT = 'false';

    const response = await POST(
      createRequest({ messages: [{ role: 'user', content: 'Spreche dich mit JULES ab.' }] })
    );
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.error.code).toBe('FEATURE_DISABLED');
  });

  it('returns 400 for non-JSON body', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(
      new Request('http://localhost/api/ai/jules/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      })
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe('INVALID_JSON');
  });

  it('returns 422 for missing messages field', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(createRequest({ language: 'de' }));
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 for empty messages array', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    const response = await POST(createRequest({ messages: [] }));
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns clarifying plan for initial German request (default language)', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [
        {
          message: {
            role: 'assistant',
            content:
              '**Klärungsplan**\n1. JULES ist das interne Ereignis-System.\n2. Agenda: ...\n3. Bitte nennen Sie Ihre Rahmenbedingungen.',
          },
          index: 0,
        },
      ],
    });

    const response = await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Spreche dich mit JULES ab.' }],
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.provider).toBe('deepseek');
    expect(json.data.message.role).toBe('assistant');
    expect(json.data.message.content).toContain('JULES');
    expect(json.data.language).toBe('de');

    const callArgs = vi.mocked(deepseekChatCompletion).mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    expect(callArgs.messages[0].role).toBe('system');
    expect(callArgs.messages[0].content).toContain('JULES');
    expect(callArgs.messages[1]).toMatchObject({ role: 'user', content: 'Spreche dich mit JULES ab.' });
  });

  it('uses English system prompt when language is "en"', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { role: 'assistant', content: 'Clarifying plan ...' }, index: 0 }],
    });

    await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Negotiate with JULES.' }],
        language: 'en',
      })
    );

    const callArgs = vi.mocked(deepseekChatCompletion).mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    expect(callArgs.messages[0].content).toContain('Clarifying Plan');
    expect(callArgs.messages[0].content).not.toContain('Klärungsplan');
  });

  it('injects active constraints into the system prompt', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { role: 'assistant', content: 'Antwort mit Rahmenbedingungen.' }, index: 0 }],
    });

    await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Lass uns beginnen.' }],
        language: 'de',
        constraints: { tone: 'formal', timeLimit: '30 Minuten', privacy: 'keine personenbezogenen Daten' },
      })
    );

    const callArgs = vi.mocked(deepseekChatCompletion).mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    const systemContent = callArgs.messages[0].content;
    expect(systemContent).toContain('Ton: formal');
    expect(systemContent).toContain('Zeitlimit: 30 Minuten');
    expect(systemContent).toContain('Datenschutz: keine personenbezogenen Daten');
  });

  it('injects English constraints when language is "en"', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { role: 'assistant', content: 'Response with constraints.' }, index: 0 }],
    });

    await POST(
      createRequest({
        messages: [{ role: 'user', content: 'Let us begin.' }],
        language: 'en',
        constraints: { tone: 'professional', timeLimit: '30 minutes' },
      })
    );

    const callArgs = vi.mocked(deepseekChatCompletion).mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    const systemContent = callArgs.messages[0].content;
    expect(systemContent).toContain('Tone: professional');
    expect(systemContent).toContain('Time limit: 30 minutes');
  });

  it('preserves multi-turn conversation history in AI call', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { role: 'assistant', content: 'Fortsetze Gespräch...' }, index: 0 }],
    });

    const history = [
      { role: 'user', content: 'Spreche dich mit JULES ab.' },
      { role: 'assistant', content: 'Klärungsplan: ...' },
      { role: 'user', content: 'Bestätigt. Beginnen wir.' },
    ];

    await POST(createRequest({ messages: history, language: 'de' }));

    const callArgs = vi.mocked(deepseekChatCompletion).mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>;
    };
    // system + 3 history messages
    expect(callArgs.messages).toHaveLength(4);
    expect(callArgs.messages[0].role).toBe('system');
    expect(callArgs.messages[1]).toMatchObject({ role: 'user', content: 'Spreche dich mit JULES ab.' });
    expect(callArgs.messages[3]).toMatchObject({ role: 'user', content: 'Bestätigt. Beginnen wir.' });
  });

  it('returns 502 when the AI provider throws', async () => {
    process.env.FEATURE_AI_CHAT = 'true';

    vi.mocked(deepseekChatCompletion).mockRejectedValue(new Error('DeepSeek error 500: upstream'));

    const response = await POST(
      createRequest({ messages: [{ role: 'user', content: 'Spreche dich mit JULES ab.' }] })
    );
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.error.code).toBe('UPSTREAM_ERROR');
    expect(json.error.details.message).toContain('upstream');
  });
});
