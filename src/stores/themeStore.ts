import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  /** Cycles light -> dark -> system, for the header toggle. */
  cycleMode: () => void
}

const STORAGE_KEY = 'theme-preference'

/**
 * Applies the mode to the document root.
 *
 * `system` removes the attribute entirely so the `prefers-color-scheme` media
 * query in theme.css takes over; an explicit mode stamps the attribute so it
 * wins over the media query in both directions.
 */
function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'system') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = mode
  }
}

const CYCLE: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => {
        applyTheme(mode)
        set({ mode })
      },
      cycleMode: () => {
        get().setMode(CYCLE[get().mode])
      },
    }),
    {
      name: STORAGE_KEY,
      // Re-apply on hydration: the inline script in index.html handles the
      // pre-paint case, this covers navigations and storage edge cases.
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.mode)
      },
    },
  ),
)

/** Selector hooks — subscribing to one field avoids re-rendering on unrelated changes. */
export const useThemeMode = () => useThemeStore((s) => s.mode)
export const useCycleTheme = () => useThemeStore((s) => s.cycleMode)
