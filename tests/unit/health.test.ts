import { describe, expect, it } from 'vitest';
import { buildHealthPayload } from '@/lib/health';

describe('buildHealthPayload', () => {
  it('returns expected health shape', () => {
    const payload = buildHealthPayload();

    expect(payload.status).toBe('ok');
    expect(payload.service).toBe('opencarbox');
    expect(typeof payload.timestamp).toBe('string');
    expect(payload.timestamp).toContain('T');
  });
});
