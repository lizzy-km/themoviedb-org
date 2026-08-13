import { useCallback, useEffect, useState } from 'react'
import { Carousel } from './Carousel'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon } from '@/components/ui/icons'
import { backdropUrl, posterUrl } from '@/lib/tmdb/images'
import { cn } from '@/lib/utils/cn'
import type { ImageEntry } from '@/lib/tmdb/types'

export interface ImageGalleryProps {
  images: ImageEntry[] | undefined
  kind: 'backdrop' | 'poster'
  title: string
  /** Caps how many thumbnails render; the lightbox still pages through all. */
  limit?: number
}

/**
 * Thumbnail strip with a paging lightbox.
 *
 * Thumbnails request small variants; the lightbox loads the large one only for
 * the image actually being viewed.
 */
export function ImageGallery({ images, kind, title, limit = 20 }: ImageGalleryProps) {
  const [index, setIndex] = useState<number | null>(null)

  const visible = images?.slice(0, limit) ?? []
  const count = visible.length

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null || count === 0) return current
        // Wrap around at both ends.
        return (current + delta + count) % count
      })
    },
    [count],
  )

  // Arrow keys page through the lightbox.
  useEffect(() => {
    if (index === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [index, step])

  if (!count) {
    return (
      <EmptyState
        icon={<ImageIcon size={40} strokeWidth={1.5} />}
        title={`No ${kind}s yet`}
        description={`No ${kind} images have been added for this title.`}
      />
    )
  }

  const isBackdrop = kind === 'backdrop'
  const active = index !== null ? visible[index] : undefined

  return (
    <>
      <Carousel label={`${title} ${kind}s`}>
        {visible.map((image, i) => (
          <button
            key={image.file_path}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View ${kind} ${i + 1} of ${count}`}
            className={cn(
              'shrink-0 overflow-hidden rounded-card bg-surface-2 transition-transform hover:scale-[1.02]',
              isBackdrop ? 'w-[300px]' : 'w-[140px]',
            )}
          >
            <img
              src={
                (isBackdrop
                  ? backdropUrl(image.file_path, 'w300')
                  : posterUrl(image.file_path, 'w185')) ?? undefined
              }
              alt=""
              loading="lazy"
              decoding="async"
              className={cn('w-full object-cover', isBackdrop ? 'aspect-video' : 'aspect-[2/3]')}
            />
          </button>
        ))}
      </Carousel>

      <Modal
        open={index !== null}
        onClose={() => setIndex(null)}
        title={`${title} — ${kind} ${(index ?? 0) + 1} of ${count}`}
        hideTitle
        size="lg"
      >
        {active && (
          <div className="relative">
            <img
              src={
                (isBackdrop
                  ? backdropUrl(active.file_path, 'original')
                  : posterUrl(active.file_path, 'w780')) ?? undefined
              }
              alt={`${title} ${kind} ${(index ?? 0) + 1}`}
              className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
            />

            {count > 1 && (
              <>
                <GalleryNav direction="left" onClick={() => step(-1)} />
                <GalleryNav direction="right" onClick={() => step(1)} />
                <p className="mt-3 text-center text-sm text-muted">
                  {(index ?? 0) + 1} / {count}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

function GalleryNav({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center',
        'rounded-full bg-surface/90 text-fg shadow-panel ring-1 ring-border backdrop-blur',
        'transition-colors hover:bg-surface-2',
        direction === 'left' ? 'left-2' : 'right-2',
      )}
    >
      {direction === 'left' ? <ChevronLeftIcon size={22} /> : <ChevronRightIcon size={22} />}
    </button>
  )
}
