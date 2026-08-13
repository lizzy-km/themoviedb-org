import { useState } from 'react'
import { Section } from '@/components/layout/Section'
import { Image } from '@/components/ui/Image'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { posterUrl } from '@/lib/tmdb/images'
import { formatDate, formatYear } from '@/lib/utils/format'
import type { Season } from '@/lib/tmdb/types'

export interface SeasonsSectionProps {
  tvId: number
  seasons: Season[] | undefined
  showName: string
}

const INITIAL_VISIBLE = 4

/**
 * Season list for a series.
 *
 * "Specials" (season 0) is sorted last rather than first, matching how viewers
 * actually browse a show. Seasons were entirely absent from the old app.
 */
export function SeasonsSection({ seasons, showName }: SeasonsSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const ordered = (seasons ?? [])
    .filter((season) => season.episode_count > 0)
    .sort((a, b) => {
      if (a.season_number === 0) return 1
      if (b.season_number === 0) return -1
      return a.season_number - b.season_number
    })

  if (ordered.length === 0) return null

  const visible = expanded ? ordered : ordered.slice(0, INITIAL_VISIBLE)

  return (
    <Section title={`Seasons (${ordered.length})`}>
      <ul className="space-y-3">
        {visible.map((season) => (
          <li
            key={season.id}
            className="flex gap-4 rounded-card border border-border bg-surface p-3 shadow-card"
          >
            <div className="w-[92px] shrink-0">
              <Image
                src={posterUrl(season.poster_path, 'w185')}
                alt={`${showName} ${season.name} poster`}
                sizes="92px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{season.name}</h3>
                {season.season_number === 0 && <Badge variant="muted">Specials</Badge>}
              </div>

              <p className="mt-0.5 text-sm text-muted">
                {[
                  formatYear(season.air_date),
                  `${season.episode_count} ${season.episode_count === 1 ? 'episode' : 'episodes'}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>

              {season.overview ? (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg/85">
                  {season.overview}
                </p>
              ) : (
                season.air_date && (
                  <p className="mt-2 text-sm text-muted">
                    {season.name} premiered on {formatDate(season.air_date)}.
                  </p>
                )
              )}
            </div>
          </li>
        ))}
      </ul>

      {ordered.length > INITIAL_VISIBLE && (
        <Button variant="outline" className="mt-4" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show fewer seasons' : `Show all ${ordered.length} seasons`}
        </Button>
      )}
    </Section>
  )
}
