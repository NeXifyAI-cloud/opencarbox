import { describe, it, expect, vi } from 'vitest';
import { formatPrice, formatDate } from './utils';

describe('Intl Formatter Caching (Performance Optimization)', () => {
  it('should format price correctly with de-AT locale', () => {
    const price = 1234.56;
    const formatted = formatPrice(price);
    expect(formatted).toContain('1.234,56');
    expect(formatted).toContain('€');
  });

  it('should format date correctly with de-AT locale', () => {
    const date = new Date('2024-12-05T12:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('5. Dezember 2024');
  });

  it('should format short date correctly', () => {
    const date = new Date('2024-12-05T12:00:00Z');
    const formatted = formatDate(date, { short: true });
    expect(formatted).toBe('05.12.2024');
  });

  it('should reuse formatters (caching check via execution time)', () => {
    const count = 1000;

    // Warm up
    formatPrice(100);
    formatDate(new Date());

    const start = performance.now();
    for (let i = 0; i < count; i++) {
      formatPrice(i);
      formatDate(new Date());
    }
    const end = performance.now();
    const duration = end - start;

    // With caching, 1000 iterations should be very fast (usually < 10ms)
    // Without caching, it would be significantly slower.
    // We use a safe threshold.
    expect(duration).toBeLessThan(100);
  });
});
