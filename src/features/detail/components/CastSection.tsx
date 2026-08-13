import { Link } from 'react-router-dom'
import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/media/Carousel'
import { PersonCard } from '@/components/media/PersonCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/icons'
import type { CastCredit } from '@/lib/tmdb/types'

export interface CastSectionProps {
  cast: CastCredit[] | undefined
  /** Route to the full cast & crew listing. */
  fullCreditsHref: string
}

/** Top-billed cast carousel. */
export function CastSection({ cast, fullCreditsHref }: CastSectionProps) {
  const topBilled = cast?.slice(0, 20) ?? []

  return (
    <Section title="Top Billed Cast">
      {topBilled.length === 0 ? (
        <EmptyState
          icon={<UsersIcon size={36} strokeWidth={1.5} />}
          title="No cast listed"
          description="Cast information hasn't been added for this title yet."
        />
      ) : (
        <>
          <Carousel label="Top billed cast">
            {topBilled.map((member) => (
              <PersonCard
                key={member.credit_id}
                id={member.id}
                name={member.name}
                profilePath={member.profile_path}
                subtitle={member.character}
              />
            ))}
          </Carousel>

          <Link
            to={fullCreditsHref}
            className="mt-3 inline-block text-sm font-semibold transition-colors hover:text-brand"
          >
            Full Cast &amp; Crew →
          </Link>
        </>
      )}
    </Section>
  )
}
