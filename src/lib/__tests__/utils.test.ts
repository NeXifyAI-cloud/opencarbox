import { describe, expect, it, vi } from 'vitest';

import {
  debounce,
  formatFileSize,
  formatPrice,
  groupBy,
  isEmpty,
  isValidHSN,
  isValidTSN,
  slugify,
  truncate,
} from '../utils';

describe('utils', () => {
  it('formats prices and text values', () => {
    expect(formatPrice(1234.56)).toContain('1.234,56');
    expect(slugify('Ölfilter für Straße')).toBe('olfilter-fur-strasse');
    expect(truncate('kurz', 10)).toBe('kurz');
    expect(truncate('ein sehr langer text', 5)).toBe('ein s...');
  });

  it('validates empty values and vehicle identifiers', () => {
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('wert')).toBe(false);

    expect(isValidHSN('0603')).toBe(true);
    expect(isValidHSN('603')).toBe(false);
    expect(isValidTSN('ADO')).toBe(true);
    expect(isValidTSN('AB12')).toBe(false);
  });

  it('debounces function calls and groups arrays', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('A');
    debounced('B');
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('B');

    const grouped = groupBy(
      [
        { id: 1, category: 'a' },
        { id: 2, category: 'b' },
        { id: 3, category: 'a' },
      ],
      'category'
    );

    expect(grouped.a).toHaveLength(2);
    expect(grouped.b).toHaveLength(1);
    expect(formatFileSize(1024)).toContain('KB');

    vi.useRealTimers();
  });
});
