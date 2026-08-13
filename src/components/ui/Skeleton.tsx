import { cn } from '@/lib/utils/cn'

export interface SkeletonProps {
  className?: string
  /** Renders a rounded-full shape, for avatars. */
  circle?: boolean
}

/**
 * Loading placeholder with a shimmer sweep.
 *
 * The sweep is a transform-only animation on a pseudo-element, so it runs on
 * the compositor and never triggers layout.
 */
export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-[rgb(var(--skeleton-base))]',
        circle ? 'rounded-full' : 'rounded-md',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-[rgb(var(--skeleton-sheen))] after:to-transparent',
        'motion-reduce:after:hidden',
        className,
      )}
    />
  )
}

/** Poster-card placeholder matching TitleCard's dimensions. */
export function TitleCardSkeleton() {
  return (
    <div className="w-[150px] shrink-0 sm:w-[170px]">
      <Skeleton className="aspect-[2/3] w-full rounded-card" />
      <Skeleton className="mt-3 h-4 w-[85%]" />
      <Skeleton className="mt-2 h-3 w-[55%]" />
    </div>
  )
}

/** A row of poster skeletons for carousels. */
export function CarouselSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="scroll-row" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <TitleCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** A responsive grid of poster skeletons for list pages. */
export function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full rounded-card" />
          <Skeleton className="mt-3 h-4 w-[85%]" />
          <Skeleton className="mt-2 h-3 w-[55%]" />
        </div>
      ))}
    </div>
  )
}

/** Detail-page placeholder. */
export function DetailSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-[420px] w-full rounded-none" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
    </div>
  )
}
