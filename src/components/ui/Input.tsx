import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. When omitted, pass `aria-label` for accessibility. */
  label?: string
  startIcon?: ReactNode
  endAdornment?: ReactNode
  error?: string | undefined
  rounded?: 'md' | 'full'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, startIcon, endAdornment, error, rounded = 'md', className, id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-fg">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <span className="pointer-events-none absolute left-3 flex text-subtle" aria-hidden="true">
            {startIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-11 w-full bg-surface text-fg placeholder:text-subtle',
            'border border-border transition-colors',
            'hover:border-subtle focus:border-brand',
            'disabled:cursor-not-allowed disabled:opacity-60',
            rounded === 'full' ? 'rounded-full' : 'rounded-lg',
            startIcon ? 'pl-10' : 'pl-4',
            endAdornment ? 'pr-24' : 'pr-4',
            error && 'border-danger hover:border-danger focus:border-danger',
            className,
          )}
          {...rest}
        />

        {endAdornment && <span className="absolute right-1.5 flex items-center">{endAdornment}</span>}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
