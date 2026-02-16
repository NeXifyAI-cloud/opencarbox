// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';

import { useUIStore } from '../ui-store';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isMobileNavOpen: false,
      isSearchOpen: false,
      activeSection: 'marketing',
      isGlobalLoading: false,
    });

    document.body.style.overflow = '';
  });

  it('toggles mobile nav and body scroll lock', () => {
    useUIStore.getState().setMobileNavOpen(true);
    expect(useUIStore.getState().isMobileNavOpen).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    useUIStore.getState().toggleMobileNav();
    expect(useUIStore.getState().isMobileNavOpen).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('sets search, section and global loading flags', () => {
    useUIStore.getState().setSearchOpen(true);
    useUIStore.getState().setActiveSection('shop');
    useUIStore.getState().setGlobalLoading(true);

    const state = useUIStore.getState();
    expect(state.isSearchOpen).toBe(true);
    expect(state.activeSection).toBe('shop');
    expect(state.isGlobalLoading).toBe(true);
  });
});
