import { describe, expect, it, beforeEach } from 'vitest';

import { __resetRateLimitForTests, checkRateLimit } from '@/lib/server/rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it('allows requests until limit and then blocks', () => {
    let blocked = false;

    for (let i = 0; i < 21; i += 1) {
      const result = checkRateLimit('user:ip');
      if (i < 20) {
        expect(result.ok).toBe(true);
      } else {
        blocked = !result.ok;
      }
    }

    expect(blocked).toBe(true);
  });
});
