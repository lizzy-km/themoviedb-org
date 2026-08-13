import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '@/components/ui/Image'
import { profileUrl } from '@/lib/tmdb/images'
import { cn } from '@/lib/utils/cn'

export interface PersonCardProps {
  id: number
  name: string
  profilePath: string | null
  /** Character name for cast lists, or "known for" on the people index. */
  subtitle?: string | undefined
  /** `carousel` fixes the width for scroll rows; `fluid` fills a grid cell. */
  layout?: 'carousel' | 'fluid'
  className?: string
}

export const PersonCard = memo(function PersonCard({
  id,
  name,
  profilePath,
  subtitle,
  layout = 'carousel',
  className,
}: PersonCardProps) {
  const href = `/person/${id}`

  return (
    <article
      className={cn(
        'group/person',
        layout === 'carousel' ? 'w-[140px] shrink-0' : 'w-full',
        className,
      )}
    >
      <Link
        to={href}
        className="block overflow-hidden rounded-card"
        aria-label={name}
      >
        <Image
          src={profileUrl(profilePath, 'w185')}
          alt={`${name} headshot`}
          fallbackIcon="person"
          className="transition-transform duration-300 group-hover/person:scale-[1.03]"
        />
      </Link>

      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-bold leading-snug">
          <Link to={href} className="line-clamp-2 transition-colors hover:text-brand">
            {name}
          </Link>
        </h3>
        {subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{subtitle}</p>}
      </div>
    </article>
  )
})
