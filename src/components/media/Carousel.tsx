import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

export interface CarouselProps {
  children: ReactNode
  /** Accessible name for the scroll region. */
  label: string
  className?: string
}

/**
 * Horizontal scroll region with desktop arrow controls.
 *
 * Scrolling is native (CSS scroll-snap) so touch and trackpad feel right and
 * nothing runs on the main thread while swiping. The arrows are progressive
 * enhancement: they appear only when there is overflow to scroll, and are
 * hidden on touch-primary devices where swiping is natural.
 */
export function Carousel({ children, label, className }: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    // 1px tolerance absorbs sub-pixel rounding at the scroll extremes.
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    updateScrollState()

    // Re-evaluate when the content or container size changes (e.g. a query
    // resolves and fills the row, or the viewport resizes).
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)

    return () => observer.disconnect()
  }, [updateScrollState, children])

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    // Leave a sliver of the next card visible as an affordance.
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
  }, [])

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollerRef}
        className="scroll-row"
        onScroll={updateScrollState}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>

      <ArrowButton
        direction="left"
        onClick={() => scrollByPage(-1)}
        visible={canScrollLeft}
        label={`Scroll ${label} left`}
      />
      <ArrowButton
        direction="right"
        onClick={() => scrollByPage(1)}
        visible={canScrollRight}
        label={`Scroll ${label} right`}
      />
    </div>
  )
}

function ArrowButton({
  direction,
  onClick,
  visible,
  label,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  visible: boolean
  label: string
}) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center',
        'rounded-full bg-surface/95 text-fg shadow-panel ring-1 ring-border backdrop-blur',
        'transition-colors hover:bg-surface-2',
        // Pointer-capable devices only; touch users swipe.
        '[@media(hover:hover)]:flex',
        direction === 'left' ? '-left-3' : '-right-3',
      )}
    >
      {direction === 'left' ? <ChevronLeftIcon size={22} /> : <ChevronRightIcon size={22} />}
    </button>
  )
}
