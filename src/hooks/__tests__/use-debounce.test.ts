// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  it('updates value after the configured delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'start' },
    });

    expect(result.current).toBe('start');

    rerender({ value: 'updated' });
    expect(result.current).toBe('start');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated');
    vi.useRealTimers();
  });
});
