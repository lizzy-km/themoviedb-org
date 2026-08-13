import { useCallback, useId, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TabItem<T extends string> {
  value: T
  label: string
  /** Optional count rendered as a pill next to the label. */
  count?: number | undefined
}

export interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>
  value: T
  onChange: (value: T) => void
  /** `pill` for the compact toggle used on carousels; `underline` for page tabs. */
  variant?: 'pill' | 'underline'
  className?: string
  'aria-label': string
}

/**
 * Accessible tab list with full arrow-key navigation.
 *
 * The old implementation stored Tailwind class strings in `useState` and swapped
 * them on click — it had no roles, no keyboard support, and let the visual state
 * drift out of sync with the data being shown.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'pill',
  className,
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  const baseId = useId()
  const listRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = items.findIndex((item) => item.value === value)
      if (currentIndex === -1) return

      let nextIndex: number | null = null
      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % items.length
          break
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + items.length) % items.length
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = items.length - 1
          break
        default:
          return
      }

      event.preventDefault()
      const next = items[nextIndex]
      if (!next) return
      onChange(next.value)
      // Move focus to follow the selection, per the WAI-ARIA tabs pattern.
      listRef.current
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        ?.[nextIndex]?.focus()
    },
    [items, onChange, value],
  )

  const isPill = variant === 'pill'

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center',
        isPill
          ? 'rounded-full border border-border p-0.5'
          : 'gap-1 overflow-x-auto border-b border-border',
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.value}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold transition-colors',
              isPill
                ? cn(
                    'rounded-full px-4 py-1.5 text-sm',
                    selected ? 'bg-navy text-white' : 'text-muted hover:text-fg',
                  )
                : cn(
                    '-mb-px border-b-2 px-4 py-3 text-sm',
                    selected
                      ? 'border-brand text-fg'
                      : 'border-transparent text-muted hover:border-border hover:text-fg',
                  ),
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none',
                  selected ? 'bg-white/20 text-white' : 'bg-surface-2 text-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Panel wrapper that pairs with `Tabs` for correct ARIA wiring. */
export function TabPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div role="tabpanel" tabIndex={0} className={cn('focus-visible:outline-none', className)}>
      {children}
    </div>
  )
}
