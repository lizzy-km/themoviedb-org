import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { FilmIcon, SearchIcon, TvIcon, UserIcon } from '@/components/ui/icons'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSearchSuggestions } from '@/lib/query/hooks'
import { formatYear } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { MultiSearchItem } from '@/lib/tmdb/types'

export interface SearchBarProps {
  /** Called after a submit or suggestion pick, so the header can close itself. */
  onNavigate?: () => void
  autoFocus?: boolean
  placeholder?: string
  size?: 'md' | 'lg'
  className?: string
}

function itemLabel(item: MultiSearchItem): string {
  if (item.media_type === 'movie') return item.title
  return item.name
}

function itemMeta(item: MultiSearchItem): string {
  if (item.media_type === 'person') return item.known_for_department ?? 'Person'
  const date = item.media_type === 'movie' ? item.release_date : item.first_air_date
  const year = formatYear(date)
  const kind = item.media_type === 'movie' ? 'Movie' : 'TV Show'
  return year ? `${kind} · ${year}` : kind
}

function ItemIcon({ mediaType }: { mediaType: MultiSearchItem['media_type'] }) {
  if (mediaType === 'movie') return <FilmIcon size={16} />
  if (mediaType === 'tv') return <TvIcon size={16} />
  return <UserIcon size={16} />
}

/**
 * Search input with a debounced suggestion dropdown.
 *
 * Implements the ARIA combobox pattern: arrow keys move through suggestions,
 * Enter opens the highlighted one (or runs a full search when nothing is
 * highlighted), Escape closes.
 *
 * The old Search component fired a request on every keystroke including the
 * empty string, put `onClick={'window.location.reload'}` (a string, so a no-op)
 * on every result link, and used the URL-unsafe raw title as the route param.
 */
export function SearchBar({
  onNavigate,
  autoFocus = false,
  placeholder = 'Search for a movie, TV show or person…',
  size = 'md',
  className,
}: SearchBarProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const debounced = useDebouncedValue(value, 300)
  const { data: suggestions = [], isFetching } = useSearchSuggestions(debounced)

  // Reset the highlight whenever the result set changes.
  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const goToResults = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      setOpen(false)
      // Pass the query as a search param, URL-encoded by the router. The old
      // version interpolated raw titles into the path, which broke on any
      // title containing "/", "?" or "#".
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      onNavigate?.()
    },
    [navigate, onNavigate],
  )

  const goToItem = useCallback(
    (item: MultiSearchItem) => {
      setOpen(false)
      setValue('')
      navigate(`/${item.media_type}/${item.id}`)
      onNavigate?.()
    },
    [navigate, onNavigate],
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const active = activeIndex >= 0 ? suggestions[activeIndex] : undefined
      if (active) goToItem(active)
      else goToResults(value)
      return
    }

    if (!suggestions.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    }
  }

  const showDropdown = open && debounced.trim().length >= 2

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          goToResults(value)
        }}
      >
        <Input
          type="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search for a movie, TV show or person"
          autoFocus={autoFocus}
          autoComplete="off"
          rounded="full"
          startIcon={<SearchIcon size={18} />}
          className={cn(size === 'lg' && 'h-12 text-base')}
          // ARIA combobox wiring.
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          endAdornment={
            <button
              type="submit"
              className={cn(
                'mr-0.5 h-9 rounded-full bg-brand px-4 text-sm font-semibold text-brand-fg',
                'transition-opacity hover:opacity-90 disabled:opacity-50',
                size === 'lg' && 'h-10',
              )}
              disabled={!value.trim()}
            >
              Search
            </button>
          }
        />
      </form>

      {showDropdown && (
        <div
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden',
            'rounded-xl border border-border bg-surface shadow-panel animate-fade-in',
          )}
        >
          {isFetching && suggestions.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted">
              <Spinner size={16} />
              Searching…
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">
              No matches for &ldquo;{debounced.trim()}&rdquo;
            </p>
          ) : (
            <ul id={listboxId} role="listbox" aria-label="Search suggestions" className="max-h-80 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li key={`${item.media_type}-${item.id}`} role="none">
                  <button
                    type="button"
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={() => goToItem(item)}
                    onPointerEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      index === activeIndex ? 'bg-surface-2' : 'hover:bg-surface-2',
                    )}
                  >
                    <span className="shrink-0 text-subtle">
                      <ItemIcon mediaType={item.media_type} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{itemLabel(item)}</span>
                      <span className="block truncate text-xs text-muted">{itemMeta(item)}</span>
                    </span>
                  </button>
                </li>
              ))}

              <li role="none" className="border-t border-border">
                <button
                  type="button"
                  onClick={() => goToResults(value)}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-brand transition-colors hover:bg-surface-2"
                >
                  See all results for &ldquo;{debounced.trim()}&rdquo;
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
