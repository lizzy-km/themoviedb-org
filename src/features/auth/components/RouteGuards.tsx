import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { Container } from '@/components/layout/Section'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { UserIcon } from '@/components/ui/icons'
import { useAuthStatus } from '@/stores/authStore'
import { safeRedirect } from '../validation'

function AuthPending() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={32} label="Checking your session" className="text-brand" />
    </div>
  )
}

function AccountsUnavailable() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={<UserIcon size={44} strokeWidth={1.5} />}
        title="Accounts aren’t available"
        description="Sign-in hasn’t been set up for this site yet. You can still save favorites and a watchlist on this device."
      />
    </Container>
  )
}

/** Renders child routes only for signed-in users; others go to /login and come back after. */
export function RequireAuth() {
  const status = useAuthStatus()
  const location = useLocation()

  if (status === 'loading') return <AuthPending />
  if (status === 'unavailable') return <AccountsUnavailable />
  if (status === 'signedOut') {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }
  return <Outlet />
}

/**
 * Login/sign-up pages: a signed-in user is sent on to `?redirect=` or
 * `fallback`. Sign-up uses `/account` so new users land on their profile.
 */
export function GuestOnly({ fallback = '/' }: { fallback?: string }) {
  const status = useAuthStatus()
  const [params] = useSearchParams()

  if (status === 'loading') return <AuthPending />
  if (status === 'unavailable') return <AccountsUnavailable />
  if (status === 'signedIn') return <Navigate to={safeRedirect(params.get('redirect'), fallback)} replace />
  return <Outlet />
}
