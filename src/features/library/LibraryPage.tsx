import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, PageHeader } from '@/components/layout/Section'
import { TitleCard } from '@/components/media/TitleCard'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookmarkIcon, HeartIcon, TrashIcon } from '@/components/ui/icons'
import { useClearLibrary, useLibraryEntries } from '@/stores/libraryStore'
import type { LibraryList } from '@/stores/libraryStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { NormalizedTitle } from '@/lib/utils/media'

export interface LibraryPageProps {
  list: LibraryList
}

const COPY: Record<LibraryList, { title: string; description: string; emptyHint: string }> = {
  favorites: {
    title: 'Favorites',
    description: 'Titles you’ve marked as favorites.',
    emptyHint: 'Tap the heart on any poster to save it here.',
  },
  watchlist: {
    title: 'Watchlist',
    description: 'Titles you’re planning to watch.',
    emptyHint: 'Tap the bookmark on any poster to save it here.',
  },
}

type FilterTab = 'all' | 'movie' | 'tv'

/**
 * Favorites / watchlist page.
 *
 * Reads from the persisted Zustand store, so the list renders instantly with no
 * network request and survives a reload.
 */
export default function LibraryPage({ list }: LibraryPageProps) {
  const [filter, setFilter] = useState<FilterTab>('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const entries = useLibraryEntries(list)
  const clear = useClearLibrary()
  const copy = COPY[list]

  usePageTitle(copy.title)

  const counts = useMemo(
    () => ({
      all: entries.length,
      movie: entries.filter((entry) => entry.mediaType === 'movie').length,
      tv: entries.filter((entry) => entry.mediaType === 'tv').length,
    }),
    [entries],
  )

  const visible = useMemo(() => {
    const filtered = filter === 'all' ? entries : entries.filter((e) => e.mediaType === filter)
    // Map to the shared card shape; `overview` isn't stored locally.
    return filtered.map<NormalizedTitle>((entry) => ({
      id: entry.id,
      mediaType: entry.mediaType,
      title: entry.title,
      posterPath: entry.posterPath,
      backdropPath: null,
      releaseDate: entry.releaseDate,
      voteAverage: entry.voteAverage,
      voteCount: 0,
      overview: '',
    }))
  }, [entries, filter])

  const Icon = list === 'favorites' ? HeartIcon : BookmarkIcon

  if (entries.length === 0) {
    return (
      <Container className="py-8">
        <PageHeader title={copy.title} description={copy.description} />
        <EmptyState
          icon={<Icon size={44} strokeWidth={1.5} />}
          title={`Your ${copy.title.toLowerCase()} is empty`}
          description={copy.emptyHint}
          action={
            <Link to="/movies">
              <Button>Browse movies</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <PageHeader
        title={copy.title}
        description={copy.description}
        action={
          <Button
            variant="outline"
            startIcon={<TrashIcon size={16} />}
            onClick={() => setConfirmClear(true)}
          >
            Clear all
          </Button>
        }
      />

      <Tabs
        items={[
          { value: 'all', label: 'All', count: counts.all },
          { value: 'movie', label: 'Movies', count: counts.movie },
          { value: 'tv', label: 'TV Shows', count: counts.tv },
        ]}
        value={filter}
        onChange={setFilter}
        variant="underline"
        aria-label="Filter by media type"
        className="mb-6"
      />

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing in this category"
          description={`You haven't saved any ${filter === 'movie' ? 'movies' : 'TV shows'} yet.`}
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((title, index) => (
            <TitleCard
              key={`${title.mediaType}-${title.id}`}
              title={title}
              priority={index < 6}
              layout="fluid"
            />
          ))}
        </div>
      )}

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title={`Clear your ${copy.title.toLowerCase()}?`}
        size="sm"
      >
        <p className="text-sm text-muted">
          This removes all {entries.length} saved{' '}
          {entries.length === 1 ? 'title' : 'titles'}. This can&rsquo;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clear(list)
              setConfirmClear(false)
            }}
          >
            Clear all
          </Button>
        </div>
      </Modal>
    </Container>
  )
}
