import { Section } from '@/components/layout/Section'
import { Image } from '@/components/ui/Image'
import { ExpandableText } from '@/components/ui/ExpandableText'
import { EmptyState } from '@/components/ui/EmptyState'
import { StarIcon } from '@/components/ui/icons'
import { profileUrl } from '@/lib/tmdb/images'
import { formatRelativeTime, initials } from '@/lib/utils/format'
import type { Review } from '@/lib/tmdb/types'

export interface ReviewsSectionProps {
  reviews: Review[] | undefined
  titleName: string
}

/**
 * User reviews.
 *
 * TMDB avatar paths sometimes arrive as a full Gravatar URL prefixed with a
 * slash (e.g. "/https://..."), which the old code fed straight into the TMDB
 * image base and produced a broken request.
 */
function resolveAvatar(path: string | null): string | null {
  if (!path) return null
  if (path.startsWith('/http')) return path.slice(1)
  return profileUrl(path, 'w185')
}

export function ReviewsSection({ reviews, titleName }: ReviewsSectionProps) {
  const visible = reviews?.slice(0, 5) ?? []

  return (
    <Section title={`Reviews${reviews?.length ? ` (${reviews.length})` : ''}`}>
      {visible.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description={`Be the first to review ${titleName} on TMDB.`}
        />
      ) : (
        <ul className="space-y-4">
          {visible.map((review) => {
            const avatar = resolveAvatar(review.author_details.avatar_path)
            return (
              <li
                key={review.id}
                className="rounded-card border border-border bg-surface p-4 shadow-card"
              >
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt=""
                      aspectClassName="aspect-square"
                      className="h-11 w-11 shrink-0 rounded-full"
                      fallbackIcon="person"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-fg"
                    >
                      {initials(review.author)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      A review by {review.author_details.name || review.author}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      {review.author_details.rating !== null && (
                        <span className="inline-flex items-center gap-1 rounded bg-navy px-1.5 py-0.5 font-semibold text-white">
                          <StarIcon size={11} filled />
                          {review.author_details.rating.toFixed(1)}
                        </span>
                      )}
                      <span>Written {formatRelativeTime(review.created_at) ?? 'recently'}</span>
                    </div>
                  </div>
                </div>

                <ExpandableText text={review.content} collapsedLength={500} className="mt-3 text-sm" />
              </li>
            )
          })}
        </ul>
      )}
    </Section>
  )
}
