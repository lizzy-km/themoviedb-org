import { Carousel } from '@/components/media/Carousel'
import { TitleCard } from '@/components/media/TitleCard'
import { Section } from '@/components/layout/Section'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { CarouselSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { normalizeTitle } from '@/lib/utils/media'
import type { NormalizedTitle } from '@/lib/utils/media'
import type { TitleListItem, TitleMediaType } from '@/lib/tmdb/types'

export interface TitleCarouselSectionProps<T extends string> {
  title: string
  items: TitleListItem[] | undefined
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry?: (() => void) | undefined
  /** Toggle rendered next to the heading (e.g. Today / This Week). */
  tabs?: {
    items: ReadonlyArray<TabItem<T>>
    value: T
    onChange: (value: T) => void
    label: string
  }
  seeAllHref?: string
  /** Media type for items whose response omits `media_type`. */
  fallbackMediaType?: TitleMediaType
}

/**
 * Titled carousel of poster cards with its own loading and error handling.
 *
 * One component now backs every home-page row; the old code had a separate
 * near-duplicate component per row (Tranding, WhatPopular) with the tab state
 * reimplemented in each.
 */
export function TitleCarouselSection<T extends string>({
  title,
  items,
  isLoading,
  isError,
  error,
  onRetry,
  tabs,
  seeAllHref,
  fallbackMediaType,
}: TitleCarouselSectionProps<T>) {
  const normalized: NormalizedTitle[] =
    items?.map((item) => normalizeTitle(item, fallbackMediaType)) ?? []

  return (
    <Section
      title={title}
      seeAllHref={seeAllHref}
      action={
        tabs && (
          <Tabs
            items={tabs.items}
            value={tabs.value}
            onChange={tabs.onChange}
            aria-label={tabs.label}
          />
        )
      }
    >
      {isLoading ? (
        <CarouselSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : normalized.length === 0 ? (
        <EmptyState title="Nothing to show" description="No titles were returned for this list." />
      ) : (
        <Carousel label={title}>
          {normalized.map((item, index) => (
            <TitleCard
              key={`${item.mediaType}-${item.id}`}
              title={item}
              // The first few cards are above the fold on most viewports.
              priority={index < 4}
            />
          ))}
        </Carousel>
      )}
    </Section>
  )
}
