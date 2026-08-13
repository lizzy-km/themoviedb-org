import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { ImageIcon, UserIcon } from './icons'

export interface ImageProps {
  src: string | null | undefined
  alt: string
  srcSet?: string | undefined
  sizes?: string | undefined
  className?: string
  /** Wrapper aspect ratio class, e.g. `aspect-[2/3]`. */
  aspectClassName?: string
  /** `eager` for above-the-fold art; everything else should stay lazy. */
  loading?: 'lazy' | 'eager'
  /** Hints the browser to prioritise this image (hero art only). */
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Icon shown when there is no image or it fails to load. */
  fallbackIcon?: 'poster' | 'person'
  rounded?: boolean
}

type Status = 'loading' | 'loaded' | 'error'

/**
 * Image with a skeleton placeholder and a real fallback.
 *
 * The previous code rendered `<img src={`.../${data.poster_path}`}>`
 * unconditionally, so titles without artwork produced a request for
 * `.../null` and a broken-image icon. Here a missing or failed image renders a
 * styled placeholder instead, and the reserved aspect ratio prevents the layout
 * shift that used to happen as posters loaded in.
 */
export function Image({
  src,
  alt,
  srcSet,
  sizes,
  className,
  aspectClassName = 'aspect-[2/3]',
  loading = 'lazy',
  fetchPriority,
  fallbackIcon = 'poster',
  rounded = true,
}: ImageProps) {
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'error')

  // Reset when the source changes — otherwise a recycled component keeps the
  // previous image's loaded/error state.
  useEffect(() => {
    setStatus(src ? 'loading' : 'error')
  }, [src])

  const FallbackIcon = fallbackIcon === 'person' ? UserIcon : ImageIcon

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-2',
        aspectClassName,
        rounded && 'rounded-card',
        className,
      )}
    >
      {status !== 'error' && src && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-[rgb(var(--skeleton-base))]" />
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-subtle">
          <FallbackIcon size={32} strokeWidth={1.5} />
        </div>
      )}
    </div>
  )
}
