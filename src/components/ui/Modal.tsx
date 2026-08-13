import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { CloseIcon } from './icons'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Visually hides the title but keeps it for screen readers (media lightboxes). */
  hideTitle?: boolean
  size?: 'sm' | 'md' | 'lg' | 'video'
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  video: 'max-w-5xl',
} as const

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Accessible dialog rendered into a portal.
 *
 * Handles Escape to close, click-outside to close, scroll locking, focus trap
 * within the dialog, and focus restoration to the trigger on close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  hideTitle = false,
  size = 'md',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      // Focus trap: wrap Tab / Shift+Tab at the dialog boundaries.
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Lock background scroll, compensating for the scrollbar so the page
    // behind the overlay doesn't shift.
    const { body } = document
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const originalOverflow = body.style.overflow
    const originalPaddingRight = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    document.addEventListener('keydown', handleKeyDown)

    // Move focus into the dialog once it's mounted.
    const timer = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current
      target?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      body.style.overflow = originalOverflow
      body.style.paddingRight = originalPaddingRight
      previouslyFocused.current?.focus?.()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        // Only close when the press starts on the backdrop itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-xl bg-surface shadow-panel animate-slide-up',
          SIZES[size],
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-4 px-5 py-4',
            !hideTitle && 'border-b border-border',
          )}
        >
          <h2 id={titleId} className={cn('text-lg font-semibold', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              'ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full',
              'text-muted transition-colors hover:bg-surface-2 hover:text-fg',
            )}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className={cn(hideTitle ? 'px-3 pb-3' : 'px-5 pb-5')}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
