import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container, Section } from '@/components/layout/Section'
import { Image } from '@/components/ui/Image'
import { Badge } from '@/components/ui/Badge'
import { DetailSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ExpandableText } from '@/components/ui/ExpandableText'
import { Carousel } from '@/components/media/Carousel'
import { TitleCard } from '@/components/media/TitleCard'
import { ImageGallery } from '@/components/media/ImageGallery'
import { profileUrl } from '@/lib/tmdb/images'
import { usePersonDetail } from '@/lib/query/hooks'
import { formatDate } from '@/lib/utils/format'
import { normalizeCredit, uniqueById } from '@/lib/utils/media'
import { useNumericParam } from '@/hooks/useNumericParam'
import { usePageTitle } from '@/hooks/usePageTitle'
import { NotFoundPage } from '@/features/misc/NotFoundPage'

const GENDER_LABELS: Record<number, string> = {
  1: 'Female',
  2: 'Male',
  3: 'Non-binary',
}

export default function PersonDetailPage() {
  const { id } = useParams()
  const personId = useNumericParam(id)

  const { data: person, isLoading, isError, error, refetch } = usePersonDetail(personId)

  usePageTitle(person?.name)

  /** Acting credits, newest first, deduped across roles. */
  const actingCredits = useMemo(() => {
    const cast = person?.combined_credits?.cast ?? []
    return uniqueById(cast)
      .sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || ''
        const dateB = b.release_date || b.first_air_date || ''
        // Undated (unreleased) credits sort to the front.
        if (!dateA) return -1
        if (!dateB) return 1
        return dateB.localeCompare(dateA)
      })
      .map((credit) => ({ credit, title: normalizeCredit(credit) }))
  }, [person])

  /** Crew credits grouped by department for the "Known for" summary. */
  const topCrewJobs = useMemo(() => {
    const crew = person?.combined_credits?.crew ?? []
    const counts = new Map<string, number>()
    for (const credit of crew) {
      if (!credit.job) continue
      counts.set(credit.job, (counts.get(credit.job) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([job, count]) => `${job} (${count})`)
  }, [person])

  if (personId === null) return <NotFoundPage />
  if (isLoading) return <DetailSkeleton />
  if (isError || !person) {
    return (
      <Container className="py-8">
        <ErrorState error={error} onRetry={refetch} />
      </Container>
    )
  }

  const age = computeAge(person.birthday, person.deathday)

  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar: portrait and vital stats. */}
        <aside>
          <Image
            src={profileUrl(person.profile_path, 'h632')}
            alt={`${person.name} headshot`}
            fallbackIcon="person"
            loading="eager"
            className="mx-auto max-w-[300px]"
          />

          <h2 className="mt-6 text-lg font-bold">Personal Info</h2>
          <dl className="mt-3 space-y-4 text-sm">
            <Fact label="Known For" value={person.known_for_department} />
            <Fact label="Credits" value={String(actingCredits.length + (person.combined_credits?.crew.length ?? 0))} />
            <Fact label="Gender" value={GENDER_LABELS[person.gender]} />
            <Fact
              label="Birthday"
              value={
                formatDate(person.birthday)
                  ? `${formatDate(person.birthday)}${age !== null && !person.deathday ? ` (${age} years old)` : ''}`
                  : undefined
              }
            />
            <Fact
              label="Day of Death"
              value={
                formatDate(person.deathday)
                  ? `${formatDate(person.deathday)}${age !== null ? ` (aged ${age})` : ''}`
                  : undefined
              }
            />
            <Fact label="Place of Birth" value={person.place_of_birth} />

            {person.also_known_as.length > 0 && (
              <div>
                <dt className="font-bold">Also Known As</dt>
                <dd className="mt-1 space-y-0.5 text-muted">
                  {person.also_known_as.slice(0, 6).map((alias) => (
                    <p key={alias}>{alias}</p>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        {/* Main column. */}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold sm:text-4xl">{person.name}</h1>

          {topCrewJobs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topCrewJobs.map((job) => (
                <Badge key={job} variant="outline">
                  {job}
                </Badge>
              ))}
            </div>
          )}

          <section className="mt-6">
            <h2 className="text-xl font-bold">Biography</h2>
            {person.biography ? (
              <ExpandableText text={person.biography} className="mt-2" />
            ) : (
              <p className="mt-2 text-muted">
                We don&rsquo;t have a biography for {person.name} yet.
              </p>
            )}
          </section>

          {actingCredits.length > 0 && (
            <Section title="Known For">
              <Carousel label={`${person.name} credits`}>
                {actingCredits.slice(0, 20).map(({ credit, title }) => (
                  <TitleCard
                    key={credit.credit_id}
                    title={title}
                    subtitle={credit.character || undefined}
                  />
                ))}
              </Carousel>
            </Section>
          )}

          {person.images?.profiles?.length > 1 && (
            <Section title="Photos">
              <ImageGallery images={person.images.profiles} kind="poster" title={person.name} />
            </Section>
          )}

          {actingCredits.length > 0 && (
            <Section title="Acting Credits">
              <ol className="divide-y divide-border rounded-card border border-border">
                {actingCredits.map(({ credit, title }) => (
                  <li key={credit.credit_id} className="flex gap-3 p-3 text-sm">
                    <span className="w-12 shrink-0 font-semibold text-muted">
                      {(credit.release_date || credit.first_air_date)?.slice(0, 4) || '—'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link
                        to={`/${title.mediaType}/${title.id}`}
                        className="font-semibold transition-colors hover:text-brand"
                      >
                        {title.title}
                      </Link>
                      {credit.character && (
                        <span className="block text-muted">as {credit.character}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </div>
      </div>
    </Container>
  )
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="font-bold">{label}</dt>
      <dd className="text-muted">{value || '—'}</dd>
    </div>
  )
}

/** Age at death when deceased, otherwise current age. */
function computeAge(birthday: string | null, deathday: string | null): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  if (Number.isNaN(birth.getTime())) return null

  const end = deathday ? new Date(deathday) : new Date()
  if (Number.isNaN(end.getTime())) return null

  let age = end.getFullYear() - birth.getFullYear()
  const monthDelta = end.getMonth() - birth.getMonth()
  // Not yet had this year's birthday.
  if (monthDelta < 0 || (monthDelta === 0 && end.getDate() < birth.getDate())) age -= 1
  return age >= 0 ? age : null
}
