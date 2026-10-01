import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserAvatar } from './UserAvatar'
import { BookmarkIcon, HeartIcon, LogOutIcon, UserIcon } from '@/components/ui/icons'
import { logOut } from '@/lib/auth/session'
import { useAuthStatus, useAuthUser } from '@/stores/authStore'
import { useTmdbAccount } from '@/stores/tmdbStore'
import { cn } from '@/lib/utils/cn'

const ITEM =
  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg transition-colors hover:bg-surface-2 focus-visible:bg-surface-2'

/**
 * Header account control: a "Log in" button for guests, an avatar menu for
 * signed-in users. Renders nothing when accounts aren't configured.
 */
export function UserMenu() {
  const status = useAuthStatus()
  const user = useAuthUser()
  const tmdb = useTmdbAccount()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (status === 'unavailable') return null

  if (status === 'loading') {
    return <span className="ml-1 h-8 w-8 animate-pulse rounded-full bg-white/15" aria-hidden="true" />
  }

  // Below `sm` the header is full; guests get "Log in" from the mobile drawer.
  if (status === 'signedOut' || !user) {
    const onAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname)
    const redirect = onAuthPage ? '' : `?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return (
      <Link
        to={`/login${redirect}`}
        className="ml-1 hidden h-9 items-center rounded-full bg-white/10 sm:inline-flex px-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        Log in
      </Link>
    )
  }

  const signOut = async () => {
    setOpen(false)
    await logOut()
    navigate('/', { replace: true })
  }

  return (
    <div ref={containerRef} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full ring-white/40 transition hover:ring-2 focus-visible:ring-2"
      >
        <UserAvatar user={user} size={32} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            // Explicit text color: this renders inside the white-text navbar.
            'absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 overflow-hidden text-fg',
            'rounded-xl border border-border bg-surface shadow-panel animate-fade-in',
          )}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <UserAvatar user={user} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.displayName || 'Your account'}</p>
              <p className="truncate text-xs text-muted">
                {tmdb ? `TMDB: @${tmdb.username}` : user.email}
              </p>
            </div>
          </div>

          <Link to="/account" role="menuitem" className={ITEM}>
            <UserIcon size={16} className="text-subtle" />
            Account
          </Link>
          <Link to="/favorites" role="menuitem" className={ITEM}>
            <HeartIcon size={16} className="text-subtle" />
            Favorites
          </Link>
          <Link to="/watchlist" role="menuitem" className={ITEM}>
            <BookmarkIcon size={16} className="text-subtle" />
            Watchlist
          </Link>
          <button type="button" role="menuitem" onClick={signOut} className={cn(ITEM, 'border-t border-border')}>
            <LogOutIcon size={16} className="text-subtle" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
