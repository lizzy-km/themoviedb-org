import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import NotFoundPage from '@/features/misc/NotFoundPage'
import { LegacyDetailRedirect, LegacySearchRedirect } from './LegacyRedirects'

/**
 * Route table with per-route code splitting.
 *
 * Every page is lazily imported so the initial bundle carries only the shell
 * plus the home page; the old app imported every page eagerly into main.jsx.
 */
const HomePage = lazy(() => import('@/features/home/HomePage'))
const MoviesPage = lazy(() => import('@/features/movies/MoviesPage'))
const TvPage = lazy(() => import('@/features/tv/TvPage'))
const PeoplePage = lazy(() => import('@/features/people/PeoplePage'))
const PersonDetailPage = lazy(() => import('@/features/people/PersonDetailPage'))
const MovieDetailPage = lazy(() => import('@/features/detail/MovieDetailPage'))
const TvDetailPage = lazy(() => import('@/features/detail/TvDetailPage'))
const CreditsPage = lazy(() => import('@/features/detail/CreditsPage'))
const SearchPage = lazy(() => import('@/features/search/SearchPage'))
const DiscoverPage = lazy(() => import('@/features/discover/DiscoverPage'))
const KeywordPage = lazy(() => import('@/features/keyword/KeywordPage'))
const LibraryPage = lazy(() => import('@/features/library/LibraryPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // Router-level fallback for loader/render errors that escape the layout's
    // own ErrorBoundary.
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },

      { path: 'movies', element: <MoviesPage /> },
      { path: 'tv', element: <TvPage /> },
      { path: 'people', element: <PeoplePage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'search', element: <SearchPage /> },

      { path: 'movie/:id', element: <MovieDetailPage /> },
      { path: 'movie/:id/cast', element: <CreditsPage mediaType="movie" /> },
      { path: 'tv/:id', element: <TvDetailPage /> },
      { path: 'tv/:id/cast', element: <CreditsPage mediaType="tv" /> },
      { path: 'person/:id', element: <PersonDetailPage /> },

      { path: 'keyword/:id', element: <KeywordPage /> },

      { path: 'favorites', element: <LibraryPage list="favorites" /> },
      { path: 'watchlist', element: <LibraryPage list="watchlist" /> },

      // Legacy paths from the previous version, kept so existing links and
      // bookmarks don't 404. `/overeview/:id` had no media type, so it can only
      // be redirected to a search-free guess: movies are the common case.
      { path: 'tvshow', element: <Navigate to="/tv" replace /> },
      { path: 'overeview/:id', element: <LegacyDetailRedirect /> },
      { path: 'searchresults/:query', element: <LegacySearchRedirect /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
