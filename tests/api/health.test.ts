import { afterEach, describe, expect, it } from 'vitest';

import { GET } from '../../src/app/api/health/route';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('GET /api/health', () => {
  it('returns ok when required env vars are present', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(json.status).toBe('ok');
    expect(typeof json.timestamp).toBe('string');
    expect(json.checks.env.ok).toBe(true);
  });

  it('returns degraded when required env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.status).toBe('degraded');
    expect(json.checks.env.ok).toBe(false);
    expect(json.checks.env.missing).toContain('NEXT_PUBLIC_SUPABASE_URL');
    expect(json.checks.env.missing).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });
});
