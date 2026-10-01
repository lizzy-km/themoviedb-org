import type { ReactNode } from 'react'
import { AlertIcon, CheckIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

/** Inline banner for a form-level error or success message. */
export function FormMessage({
  tone,
  children,
  className,
}: {
  tone: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm',
        tone === 'error' && 'border-danger/30 bg-danger/10 text-danger',
        tone === 'success' && 'border-success/30 bg-success/10 text-success',
        tone === 'info' && 'border-brand/30 bg-brand/10 text-fg',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">
        {tone === 'error' ? <AlertIcon size={16} /> : <CheckIcon size={16} />}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
