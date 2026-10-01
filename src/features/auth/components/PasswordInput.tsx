import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/Input'
import type { InputProps } from '@/components/ui/Input'
import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/ui/icons'
import { PASSWORD_RULES } from '../validation'
import { cn } from '@/lib/utils/cn'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'endAdornment' | 'startIcon'> {
  /** Shows the live requirements checklist (for new passwords). */
  showRules?: boolean
}

/** Password field with a show/hide toggle and optional requirements checklist. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showRules = false, value, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const password = typeof value === 'string' ? value : ''

  return (
    <div>
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        value={value}
        startIcon={<LockIcon size={17} />}
        // The toggle is narrow, so reclaim the wide padding Input reserves for adornments.
        className={cn('!pr-12', className)}
        endAdornment={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="mr-0.5 inline-flex h-9 w-9 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        }
        {...rest}
      />

      {showRules && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Password requirements">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(password)
            return (
              <li
                key={rule.id}
                className={cn('flex items-center gap-1', met ? 'text-success' : 'text-subtle')}
              >
                <span aria-hidden="true">{met ? '✓' : '○'}</span>
                {rule.label}
                <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
})
