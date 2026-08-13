import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { AlertIcon } from './icons'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Placeholder for "no results" and error states.
 *
 * Replaces the old pattern of storing a JSX blob in a context `useState`
 * (`const [sdata, setData] = useState(emptyData)`) and rendering it from
 * unrelated components.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="text-subtle" aria-hidden="true">
        {icon ?? <AlertIcon size={40} strokeWidth={1.5} />}
      </span>

      <h2 className="text-lg font-semibold text-fg">{title}</h2>

      {description && <p className="max-w-md text-sm text-muted">{description}</p>}

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
