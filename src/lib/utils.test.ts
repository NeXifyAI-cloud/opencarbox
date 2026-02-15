import { describe, expect, it } from 'vitest';

import {
  calculateDiscountPercentage,
  formatFileSize,
  groupBy,
  isEmpty,
  isValidAustrianUID,
  slugify,
  truncate,
} from './utils';

describe('utils', () => {
  it('slugify converts german text into URL slug', () => {
    expect(slugify('Bremsbeläge für VW Golf')).toBe('bremsbelage-fur-vw-golf');
  });

  it('truncate shortens long text and keeps short text', () => {
    expect(truncate('OpenCarBox Plattform', 10)).toBe('OpenCarBox...');
    expect(truncate('Kurz', 10)).toBe('Kurz');
  });

  it('isEmpty validates common empty and non-empty values', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('ok')).toBe(false);
    expect(isEmpty(['x'])).toBe(false);
  });

  it('validates austrian UID structure', () => {
    expect(isValidAustrianUID('ATU12345678')).toBe(true);
    expect(isValidAustrianUID('DE123456789')).toBe(false);
  });

  it('formatFileSize formats bytes in german locale', () => {
    expect(formatFileSize(1536)).toBe('1,5 KB');
  });

  it('groupBy creates grouped object by key', () => {
    const grouped = groupBy(
      [
        { id: 1, type: 'service' },
        { id: 2, type: 'service' },
        { id: 3, type: 'product' },
      ],
      'type'
    );

    expect(grouped.service).toHaveLength(2);
    expect(grouped.product).toHaveLength(1);
  });

  it('calculateDiscountPercentage returns rounded discount', () => {
    expect(calculateDiscountPercentage(100, 79)).toBe(21);
    expect(calculateDiscountPercentage(0, 10)).toBe(0);
  });
});
