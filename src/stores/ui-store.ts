import { create } from 'zustand';

/**
 * UI-State Interface
 */
interface UIState {
  /** Ist die mobile Navigation offen? */
  isMobileNavOpen: boolean;
  /** Ist die Suche offen/fokussiert? */
  isSearchOpen: boolean;
  /** Aktueller aktiver Bereich (für Theming) */
  activeSection: 'shop' | 'werkstatt' | 'autohandel' | 'marketing';
  /** Ist gerade eine globale Aktion am Laden? */
  isGlobalLoading: boolean;

  // Actions
  /** Mobile Navigation öffnen/schließen */
  setMobileNavOpen: (isOpen: boolean) => void;
  /** Toggle Mobile Navigation */
  toggleMobileNav: () => void;
  /** Suche öffnen/schließen */
  setSearchOpen: (isOpen: boolean) => void;
  /** Aktiven Bereich setzen (ändert Theming) */
  setActiveSection: (section: UIState['activeSection']) => void;
  /** Globalen Ladezustand setzen */
  setGlobalLoading: (isLoading: boolean) => void;
}

/**
 * UI-Store für globalen UI-State.
 * Nicht persistiert - reset bei jedem Page Load.
 *
 * @example
 * const { isMobileNavOpen, toggleMobileNav, activeSection } = useUIStore();
 *
 * // Navigation togglen
 * toggleMobileNav();
 *
 * // Theming basierend auf Section
 * const primaryColor = activeSection === 'shop' ? 'carvantooo' : 'opencarbox';
 */
export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  activeSection: 'marketing',
  isGlobalLoading: false,

  setMobileNavOpen: (isOpen) => {
    set({ isMobileNavOpen: isOpen });
    // Body-Scroll sperren wenn Nav offen
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  },

  toggleMobileNav: () => {
    set((state) => {
      const newState = !state.isMobileNavOpen;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = newState ? 'hidden' : '';
      }
      return { isMobileNavOpen: newState };
    });
  },

  setSearchOpen: (isOpen) => {
    set({ isSearchOpen: isOpen });
  },

  setActiveSection: (section) => {
    set({ activeSection: section });
  },

  setGlobalLoading: (isLoading) => {
    set({ isGlobalLoading: isLoading });
  },
}));

