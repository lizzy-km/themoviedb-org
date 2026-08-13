import { Navigate, useParams } from 'react-router-dom'

/**
 * Redirects for routes used by the previous version of this app, so existing
 * links and bookmarks keep working instead of 404ing.
 */

/**
 * `/overeview/:id` -> `/movie/:id`.
 *
 * The old route carried no media type, so a TV id is indistinguishable from a
 * movie id here. Movies are the common case; a TV id will land on the movie
 * detail page, which renders a "not found" state rather than breaking.
 */
export function LegacyDetailRedirect() {
  const { id } = useParams()
  return <Navigate to={id ? `/movie/${id}` : '/'} replace />
}

/** `/searchresults/:query` -> `/search?q=:query`. */
export function LegacySearchRedirect() {
  const { query } = useParams()
  // useParams returns the segment already decoded.
  return <Navigate to={query ? `/search?q=${encodeURIComponent(query)}` : '/search'} replace />
}
