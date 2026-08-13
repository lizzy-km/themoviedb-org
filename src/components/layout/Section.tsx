import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

export interface SectionProps {
  title: string
  children: ReactNode
  /** Rendered to the right of the heading — typically a Tabs toggle. */
  action?: ReactNode
  /** Adds a "See all" link after the heading. */
  seeAllHref?: string
  className?: string
  as?: 'section' | 'div'
}

/** Titled content block used by the home page and detail sections. */
export function Section({
  title,
  children,
  action,
  seeAllHref,
  className,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag className={cn('py-6', className)}>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {action}
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="ml-auto inline-flex items-center gap-0.5 text-sm font-semibold text-brand transition-colors hover:text-fg"
          >
            See all
            <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
      {children}
    </Tag>
  )
}

export interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Consistent page-level heading for list pages. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </header>
  )
}

/** Centered, padded page container — one place to control page gutters. */
export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: 'default' | 'wide'
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'wide' ? 'max-w-[1600px]' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
