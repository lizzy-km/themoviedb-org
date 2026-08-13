import { useMemo, useState } from 'react'
import { Carousel } from './Carousel'
import { TrailerModal } from './TrailerModal'
import { PlayIcon } from '@/components/ui/icons'
import { EmptyState } from '@/components/ui/EmptyState'
import { youTubeThumbnail } from '@/lib/tmdb/images'
import { cn } from '@/lib/utils/cn'
import type { Video } from '@/lib/tmdb/types'

export interface VideoGalleryProps {
  videos: Video[] | undefined
  label?: string
}

/** Video types worth surfacing, in display order. */
const TYPE_ORDER = ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes'] as const

/**
 * Grid of YouTube video thumbnails that open in a lightbox.
 *
 * Thumbnails are plain images rather than embedded players — embedding a dozen
 * iframes would pull in the YouTube player bundle a dozen times.
 */
export function VideoGallery({ videos, label = 'Videos' }: VideoGalleryProps) {
  const [active, setActive] = useState<Video | null>(null)

  const sorted = useMemo(() => {
    if (!videos?.length) return []
    return videos
      .filter((video) => video.site === 'YouTube')
      .sort((a, b) => {
        const rankA = TYPE_ORDER.indexOf(a.type as (typeof TYPE_ORDER)[number])
        const rankB = TYPE_ORDER.indexOf(b.type as (typeof TYPE_ORDER)[number])
        // Unknown types sort last, then official first, then newest.
        const safeA = rankA === -1 ? TYPE_ORDER.length : rankA
        const safeB = rankB === -1 ? TYPE_ORDER.length : rankB
        if (safeA !== safeB) return safeA - safeB
        if (a.official !== b.official) return a.official ? -1 : 1
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      })
  }, [videos])

  if (!sorted.length) {
    return (
      <EmptyState
        title="No videos yet"
        description="No trailers or clips have been added for this title."
      />
    )
  }

  return (
    <>
      <Carousel label={label}>
        {sorted.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video)}
            className="group/video w-[260px] shrink-0 text-left"
          >
            <div className="relative overflow-hidden rounded-card bg-surface-2">
              <img
                src={youTubeThumbnail(video.key)}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover/video:scale-[1.04]"
              />
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/25',
                  'transition-colors group-hover/video:bg-black/45',
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-navy shadow-lg">
                  <PlayIcon size={22} />
                </span>
              </span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm font-semibold transition-colors group-hover/video:text-brand">
              {video.name}
            </p>
            <p className="text-xs text-muted">{video.type}</p>
          </button>
        ))}
      </Carousel>

      <TrailerModal video={active} onClose={() => setActive(null)} />
    </>
  )
}
