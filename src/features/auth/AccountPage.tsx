import { Link, useLocation } from 'react-router-dom'
import { ProfileSection, VerifyEmailBanner } from './account/ProfileSection'
import { SecuritySection, SessionSection } from './account/SecuritySection'
import { TmdbSection } from './account/TmdbSection'
import { AccountSection } from './account/AccountSection'
import { Container } from '@/components/layout/Section'
import { Badge } from '@/components/ui/Badge'
import { BookmarkIcon, HeartIcon } from '@/components/ui/icons'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuthUser } from '@/stores/authStore'
import { useLibraryCounts } from '@/stores/libraryStore'

const PROVIDER_LABELS: Record<string, string> = {
  password: 'Email & password',
  'google.com': 'Google',
}

function memberSince(createdAt: string | null): string | null {
  if (!createdAt) return null
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export default function AccountPage() {
  usePageTitle('Your account')
  const user = useAuthUser()
  const counts = useLibraryCounts()
  const location = useLocation()
  const justLinked = (location.state as { tmdbLinked?: string } | null)?.tmdbLinked ?? null

  // <RequireAuth> guarantees a user; this only narrows the type.
  if (!user) return null

  const since = memberSince(user.createdAt)
  const needsVerification = user.providers.includes('password') && !user.emailVerified

  return (
    <Container className="max-w-3xl py-8">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <UserAvatar user={user} size={64} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">
            {user.displayName || 'Your account'}
          </h1>
          <p className="truncate text-sm text-muted">
            {user.email}
            {since && ` · Member since ${since}`}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.providers.map((p) => (
              <Badge key={p} variant="muted">
                {PROVIDER_LABELS[p] ?? p}
              </Badge>
            ))}
            {user.emailVerified && <Badge variant="brand">Verified</Badge>}
          </div>
        </div>
      </header>

      <div className="space-y-5">
        {needsVerification && <VerifyEmailBanner email={user.email} />}

        <AccountSection title="Your library" description="Synced to your account on every device.">
          <div className="grid gap-3 sm:grid-cols-2">
            <LibraryStat to="/favorites" label="Favorites" count={counts.favorites} icon={<HeartIcon size={20} />} />
            <LibraryStat to="/watchlist" label="Watchlist" count={counts.watchlist} icon={<BookmarkIcon size={20} />} />
          </div>
        </AccountSection>

        <TmdbSection uid={user.uid} justLinked={justLinked} />
        <ProfileSection key={user.displayName ?? ''} user={user} />
        <SecuritySection user={user} />
        <SessionSection user={user} />
      </div>
    </Container>
  )
}

function LibraryStat({
  to,
  label,
  count,
  icon,
}: {
  to: string
  label: string
  count: number
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-surface-2"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </span>
      <span>
        <span className="block text-xl font-bold">{count.toLocaleString()}</span>
        <span className="text-sm text-muted">{label}</span>
      </span>
    </Link>
  )
}
