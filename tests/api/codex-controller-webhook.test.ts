import crypto from 'node:crypto';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '../../src/app/api/webhooks/codex-controller/route';

vi.mock('../../src/lib/ai/deepseekClient', () => ({
  deepseekChatCompletion: vi.fn(),
}));

import { deepseekChatCompletion } from '../../src/lib/ai/deepseekClient';

const ORIGINAL_ENV = { ...process.env };
const fetchMock = vi.fn();

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function signedRequest(body: Record<string, unknown>, eventType = 'workflow_run.failed') {
  const rawBody = JSON.stringify(body);
  const signature = `sha256=${crypto
    .createHmac('sha256', process.env.CODEX_WEBHOOK_SECRET ?? '')
    .update(rawBody)
    .digest('hex')}`;

  return new Request('http://localhost/api/webhooks/codex-controller', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-codex-signature-256': signature,
      'x-codex-event': eventType,
    },
    body: rawBody,
  });
}

describe('POST /api/webhooks/codex-controller', () => {
  it('rejects requests with invalid signature', async () => {
    process.env.CODEX_WEBHOOK_SECRET = 'secret';

    const response = await POST(
      new Request('http://localhost/api/webhooks/codex-controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-codex-signature-256': 'sha256=invalid',
        },
        body: JSON.stringify({ hello: 'world' }),
      })
    );

    expect(response.status).toBe(401);
  });

  it('routes to repository dispatch when DeepSeek selects an action', async () => {
    process.env.CODEX_WEBHOOK_SECRET = 'secret';
    process.env.GITHUB_REPOSITORY = 'acme/opencarbox';
    process.env.GH_PAT = 'ghp_test';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ action: 'run_autofix', reason: 'CI failure detected' }) } }],
    });

    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({ ok: true, status: 204, text: async () => '' });

    const response = await POST(signedRequest({ workflow: 'ci', conclusion: 'failure' }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.provider).toBe('deepseek');
    expect(fetchMock).toHaveBeenCalledWith('https://api.github.com/repos/acme/opencarbox/dispatches', expect.any(Object));
  });

  it('returns 502 when dispatch target is missing', async () => {
    process.env.CODEX_WEBHOOK_SECRET = 'secret';

    vi.mocked(deepseekChatCompletion).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ action: 'run_autofix', reason: 'CI failure detected' }) } }],
    });

    const response = await POST(signedRequest({ workflow: 'ci', conclusion: 'failure' }));
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json.error.code).toBe('ROUTING_FAILED');
  });
});
