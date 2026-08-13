import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { Image } from '@/components/ui/Image'
import { GridSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { profileUrl } from '@/lib/tmdb/images'
import { useMovieDetail, useTvDetail } from '@/lib/query/hooks'
import { useNumericParam } from '@/hooks/useNumericParam'
import { usePageTitle } from '@/hooks/usePageTitle'
import { NotFoundPage } from '@/features/misc/NotFoundPage'
import type { CastCredit, CrewCredit, TitleMediaType } from '@/lib/tmdb/types'

export interface CreditsPageProps {
  mediaType: TitleMediaType
}

/** Full cast & crew listing, crew grouped by department. */
export default function CreditsPage({ mediaType }: CreditsPageProps) {
  const { id } = useParams()
  const titleId = useNumericParam(id)

  // Only the query matching this route's media type is enabled; the other is
  // passed null so it stays idle rather than firing a wasted request.
  const movieQuery = useMovieDetail(mediaType === 'movie' ? titleId : null)
  const tvQuery = useTvDetail(mediaType === 'tv' ? titleId : null)
  const query = mediaType === 'movie' ? movieQuery : tvQuery

  const name = mediaType === 'movie' ? movieQuery.data?.title : tvQuery.data?.name
  usePageTitle(name ? `${name} — Cast & Crew` : undefined)

  const cast: CastCredit[] =
    (mediaType === 'tv'
      ? tvQuery.data?.aggregate_credits?.cast?.length
        ? tvQuery.data.aggregate_credits.cast
        : tvQuery.data?.credits?.cast
      : movieQuery.data?.credits?.cast) ?? []

  const crewByDepartment = useMemo(() => {
    const crew: CrewCredit[] =
      (mediaType === 'movie' ? movieQuery.data?.credits?.crew : tvQuery.data?.credits?.crew) ?? []

    const groups = new Map<string, CrewCredit[]>()
    for (const member of crew) {
      const department = member.department || 'Other'
      const existing = groups.get(department)
      if (existing) existing.push(member)
      else groups.set(department, [member])
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [mediaType, movieQuery.data, tvQuery.data])

  if (titleId === null) return <NotFoundPage />
  if (query.isLoading) {
    return (
      <Container className="py-8">
        <GridSkeleton count={12} />
      </Container>
    )
  }
  if (query.isError || !name) {
    return (
      <Container className="py-8">
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <PageHeader title={`${name} — Cast & Crew`} />

      <Link
        to={`/${mediaType}/${titleId}`}
        className="mb-6 inline-block text-sm font-semibold text-brand transition-colors hover:text-fg"
      >
        ← Back to {name}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-bold">Cast ({cast.length})</h2>
          <ul className="space-y-3">
            {cast.map((member) => (
              <li key={member.credit_id} className="flex items-center gap-3">
                <Link to={`/person/${member.id}`} className="w-12 shrink-0">
                  <Image
                    src={profileUrl(member.profile_path, 'w185')}
                    alt=""
                    aspectClassName="aspect-square"
                    className="rounded-full"
                    fallbackIcon="person"
                    sizes="48px"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/person/${member.id}`}
                    className="block truncate font-semibold transition-colors hover:text-brand"
                  >
                    {member.name}
                  </Link>
                  <p className="truncate text-sm text-muted">{member.character}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Crew</h2>
          <div className="space-y-6">
            {crewByDepartment.map(([department, members]) => (
              <div key={department}>
                <h3 className="mb-2 font-bold">{department}</h3>
                <ul className="space-y-1.5">
                  {members.map((member) => (
                    <li key={member.credit_id} className="flex justify-between gap-4 text-sm">
                      <Link
                        to={`/person/${member.id}`}
                        className="font-medium transition-colors hover:text-brand"
                      >
                        {member.name}
                      </Link>
                      <span className="shrink-0 text-muted">{member.job}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  )
}
