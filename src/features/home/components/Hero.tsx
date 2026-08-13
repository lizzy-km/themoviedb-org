import { useMemo } from 'react'
import { SearchBar } from '@/components/layout/SearchBar'
import { Container } from '@/components/layout/Section'
import { backdropSrcSet, backdropUrl } from '@/lib/tmdb/images'
import { useTrending } from '@/lib/query/hooks'
import { isTitleResult } from '@/lib/utils/media'

/**
 * Home hero with a rotating backdrop.
 *
 * The backdrop is picked from today's trending titles, chosen deterministically
 * by day so it's stable within a session — the old implementation called
 * `Math.random()` inside a `useEffect` keyed on `id`, so the image changed on
 * unrelated state updates and caused a visible flash.
 */
export function Hero() {
  const { data: trending } = useTrending('all', 'day')

  const backdropPath = useMemo(() => {
    const candidates = trending?.filter(isTitleResult).filter((item) => item.backdrop_path) ?? []
    if (!candidates.length) return null
    // Day-of-year index: stable for the whole day, different tomorrow.
    const dayIndex = Math.floor(Date.now() / 86_400_000)
    return candidates[dayIndex % candidates.length]?.backdrop_path ?? null
  }, [trending])

  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {backdropPath && (
        <img
          src={backdropUrl(backdropPath, 'w1280') ?? undefined}
          srcSet={backdropSrcSet(backdropPath)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          // The hero is the largest above-the-fold paint — load it eagerly at
          // high priority so it doesn't lag behind the JS bundle.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />

      <Container>
        <div className="flex flex-col gap-6 py-14 sm:py-20">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome.
            </h1>
            <p className="mt-2 max-w-2xl text-lg font-medium text-white/90 sm:text-2xl">
              Millions of movies, TV shows and people to discover. Explore now.
            </p>
          </div>

          <div className="max-w-3xl">
            <SearchBar size="lg" />
          </div>
        </div>
      </Container>
    </section>
  )
}
