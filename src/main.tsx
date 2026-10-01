import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { queryClient } from '@/lib/query/client'
import { router } from '@/app/routes'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { initAnalytics, reportWebVitals, setUserProperties } from '@/lib/analytics'
import { initAuth } from '@/lib/auth/session'
import { useLibraryStore } from '@/stores/libraryStore'
import { useThemeStore } from '@/stores/themeStore'
import '@/styles/index.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container #root was not found in index.html')
}

// Analytics loads in the background; it never blocks the first render.
void initAnalytics()
reportWebVitals()
// Restores the Firebase session in the background; the UI shows a pending state until it resolves.
initAuth()

// Snapshot of persisted state, so reports can be segmented by it.
const library = useLibraryStore.getState()
setUserProperties({
  theme_preference: useThemeStore.getState().mode,
  favorites_count: String(Object.keys(library.favorites).length),
  watchlist_count: String(Object.keys(library.watchlist).length),
})

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
)
