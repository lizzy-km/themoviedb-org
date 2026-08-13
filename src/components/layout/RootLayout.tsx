import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'

/** Fallback shown while a lazily-loaded route chunk downloads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={36} label="Loading page" className="text-brand" />
    </div>
  )
}

/**
 * Shell wrapping every route.
 *
 * `ScrollRestoration` restores scroll position on back/forward and resets it on
 * new navigations — the old app kept its scroll container in a div with
 * `h-screen overflow-y-auto`, so the browser could not manage scroll at all and
 * every navigation landed mid-page.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  )
}
