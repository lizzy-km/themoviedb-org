import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { Container } from './Section'
import { BookmarkIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from '@/components/ui/icons'
import { useLibraryCounts } from '@/stores/libraryStore'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  to: string
  label: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/people', label: 'People' },
  { to: '/discover', label: 'Discover' },
]

/**
 * Application header.
 *
 * Fully responsive via CSS breakpoints rather than the old hardcoded
 * `max-[428px]` queries and a fixed `26.99rem` drawer width, which broke on
 * every viewport that wasn't exactly an iPhone.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { favorites, watchlist } = useLibraryCounts()
  const location = useLocation()

  // Close both panels on navigation.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  // Lock scroll while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 bg-navy text-white shadow-md">
      {/* Keyboard users can jump straight to content. */}
      <a
        href="#main-content"
        className="sr-only-focusable absolute left-4 top-3 z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-navy"
      >
        Skip to content
      </a>

      <Container>
        <div className="flex h-16 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight"
            aria-label="Movie Explorer home"
          >
            <span className="gradient-text text-xl font-extrabold">MOVIE</span>
            <span className="hidden xs:inline">Explorer</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                        isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Inline search on wide screens. */}
          <div className="ml-auto hidden max-w-md flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              {searchOpen ? <CloseIcon size={19} /> : <SearchIcon size={19} />}
            </button>

            <LibraryLink to="/favorites" label="Favorites" count={favorites}>
              <HeartIcon size={18} />
            </LibraryLink>
            <LibraryLink to="/watchlist" label="Watchlist" count={watchlist}>
              <BookmarkIcon size={18} />
            </LibraryLink>

            <ThemeToggle />
          </div>
        </div>
      </Container>

      {/* Mobile search drawer. */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-navy px-4 py-3 lg:hidden">
          <SearchBar autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile navigation drawer. */}
      <div
        id="mobile-nav"
        className={cn(
          'fixed inset-x-0 top-16 z-20 origin-top overflow-hidden bg-navy transition-[max-height] duration-300 lg:hidden',
          menuOpen ? 'max-h-[70vh] border-t border-white/10' : 'max-h-0',
        )}
      >
        <nav aria-label="Mobile navigation" className="px-4 py-2">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-3 text-base font-semibold transition-colors',
                      isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Backdrop closes the drawer on tap. */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-10 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}

function LibraryLink({
  to,
  label,
  count,
  children,
}: {
  to: string
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      title={label}
      aria-label={count > 0 ? `${label}, ${count} saved` : label}
      className={({ isActive }) =>
        cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
          isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white',
        )
      }
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-fg">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </NavLink>
  )
}
