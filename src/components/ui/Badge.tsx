import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

export type BadgeVariant = 'default' | 'outline' | 'brand' | 'muted'

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 text-fg',
  outline: 'border border-border text-fg',
  brand: 'bg-brand text-brand-fg',
  muted: 'bg-surface-2 text-muted',
}

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  /** Renders the badge as a router link (used for genres and keywords). */
  to?: string
  title?: string
}

export function Badge({ children, variant = 'default', className, to, title }: BadgeProps) {
  const classes = cn(
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none',
    VARIANTS[variant],
    to && 'transition-colors hover:bg-brand hover:text-brand-fg',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} title={title}>
        {children}
      </Link>
    )
  }

  return (
    <span className={classes} title={title}>
      {children}
    </span>
  )
}
