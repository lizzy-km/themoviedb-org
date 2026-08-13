import { Link } from 'react-router-dom'
import { Container } from './Section'

interface FooterLink {
  label: string
  to?: string
  href?: string
}

interface FooterColumn {
  heading: string
  links: readonly FooterLink[]
}

/**
 * Footer link groups.
 *
 * The old footer duplicated its entire markup three times (desktop/tablet/
 * mobile) behind JS media queries, and pointed at TMDB-internal paths like
 * `/movie/new` that don't exist in this app. Content is defined once here and
 * laid out responsively with CSS.
 */
const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Browse',
    links: [
      { label: 'Movies', to: '/movies' },
      { label: 'TV Shows', to: '/tv' },
      { label: 'People', to: '/people' },
      { label: 'Discover', to: '/discover' },
    ],
  },
  {
    heading: 'My Library',
    links: [
      { label: 'Favorites', to: '/favorites' },
      { label: 'Watchlist', to: '/watchlist' },
    ],
  },
  {
    heading: 'Data Source',
    links: [
      { label: 'TMDB', href: 'https://www.themoviedb.org/' },
      { label: 'API Documentation', href: 'https://developer.themoviedb.org/docs' },
      { label: 'API Terms of Use', href: 'https://www.themoviedb.org/api-terms-of-use' },
      { label: 'System Status', href: 'https://status.themoviedb.org/' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <Container>
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              <span className="gradient-text">MOVIE</span> Explorer
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              Browse trending movies and TV shows, explore cast and crew, and keep your own
              favorites and watchlist.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-white/90">
                {column.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-white/10 py-6">
          <p className="text-xs leading-relaxed text-white/60">
            This product uses the TMDB API but is not endorsed or certified by TMDB. All film and
            television metadata and artwork are provided by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-white"
            >
              The Movie Database
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  )
}
