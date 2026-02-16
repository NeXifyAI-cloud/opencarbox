import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '../../src/app/api/health/route';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe('GET /api/health', () => {
  it('returns ok when database and ai dependencies are healthy', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    process.env.AI_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'secret';
    process.env.NSCALE_API_KEY = 'nscale';

    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 } as Response);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe('ok');
    expect(json.dependencies.database.status).toBe('up');
    expect(json.dependencies.aiService.status).toBe('up');
  });

  it('returns degraded when dependencies are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.AI_PROVIDER;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.NSCALE_API_KEY;

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.status).toBe('degraded');
    expect(json.dependencies.database.status).toBe('down');
    expect(json.dependencies.aiService.status).toBe('degraded');
  });
});
