import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Titled card used for each block of the account page. */
export function AccountSection({
  title,
  description,
  children,
  tone = 'default',
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  tone?: 'default' | 'danger'
}) {
  return (
    <section
      className={cn(
        'rounded-xl border bg-surface p-5 sm:p-6',
        tone === 'danger' ? 'border-danger/40' : 'border-border',
      )}
    >
      <h2 className={cn('text-lg font-bold', tone === 'danger' && 'text-danger')}>{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}
