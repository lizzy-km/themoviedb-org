import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/media/Carousel'
import { TitleCard } from '@/components/media/TitleCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { normalizeTitle } from '@/lib/utils/media'
import type { TitleListItem, TitleMediaType } from '@/lib/tmdb/types'

export interface RecommendationsSectionProps {
  title?: string
  items: TitleListItem[] | undefined
  mediaType: TitleMediaType
}

/**
 * "More like this" carousel.
 *
 * Replaces Recom.jsx, whose nested ternary meant the TV branch was unreachable
 * (it tested a truthy empty array before ever reaching the TV case).
 */
export function RecommendationsSection({
  title = 'Recommendations',
  items,
  mediaType,
}: RecommendationsSectionProps) {
  const titles = items?.slice(0, 20).map((item) => normalizeTitle(item, mediaType)) ?? []

  return (
    <Section title={title}>
      {titles.length === 0 ? (
        <EmptyState
          title="No recommendations yet"
          description="We don't have enough data to suggest similar titles."
        />
      ) : (
        <Carousel label={title}>
          {titles.map((item) => (
            <TitleCard key={`${item.mediaType}-${item.id}`} title={item} />
          ))}
        </Carousel>
      )}
    </Section>
  )
}
