import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronDownIcon } from './icons'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  options: ReadonlyArray<SelectOption>
  placeholder?: string
}

/**
 * Styled native `<select>`.
 *
 * Native is deliberate: it gets platform-correct touch pickers on mobile,
 * full keyboard support, and zero JS — a custom listbox would be heavier and
 * worse on phones.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, className, id, ...rest },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-fg">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border border-border bg-surface',
            'pl-3 pr-10 text-sm text-fg transition-colors',
            'hover:border-subtle focus:border-brand',
            'disabled:cursor-not-allowed disabled:opacity-60',
            className,
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle"
        />
      </div>
    </div>
  )
})
