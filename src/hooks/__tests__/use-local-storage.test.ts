// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLocalStorage } from '../use-local-storage';

describe('useLocalStorage', () => {
  it('reads, writes and removes values from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('vehicle', 'golf'));

    expect(result.current[0]).toBe('golf');

    act(() => {
      result.current[1]('passat');
    });

    expect(result.current[0]).toBe('passat');
    expect(window.localStorage.getItem('vehicle')).toBe('"passat"');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('golf');
    expect(window.localStorage.getItem('vehicle')).toBeNull();
  });

  it('syncs updates from storage event', () => {
    const { result } = renderHook(() => useLocalStorage('service', 'inspektion'));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'service',
          newValue: JSON.stringify('reifenwechsel'),
        })
      );
    });

    expect(result.current[0]).toBe('reifenwechsel');

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'service',
          newValue: null,
        })
      );
    });

    expect(result.current[0]).toBe('inspektion');
  });
});
