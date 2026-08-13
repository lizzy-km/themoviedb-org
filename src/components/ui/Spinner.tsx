import { cn } from '@/lib/utils/cn'

export interface SpinnerProps {
  size?: number
  className?: string
  /** Accessible label; omit for purely decorative use inside a labelled button. */
  label?: string
}

/**
 * Indeterminate loading indicator.
 *
 * Uses an SVG stroke-dash animation rather than a spinning border so it stays
 * crisp at any size and animates on the compositor.
 */
export function Spinner({ size = 20, className, label }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('shrink-0 animate-spin', className)}
      role={label ? 'status' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
