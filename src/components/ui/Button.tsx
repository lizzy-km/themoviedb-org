import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-fg hover:bg-brand/90 active:bg-brand/80',
  secondary: 'bg-surface-2 text-fg hover:bg-border active:bg-border/80',
  ghost: 'bg-transparent text-fg hover:bg-surface-2 active:bg-border',
  outline: 'border border-border bg-transparent text-fg hover:bg-surface-2 active:bg-border',
  danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
  icon: 'h-10 w-10 justify-center',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  /** Rendered before the label; hidden while `loading`. */
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    startIcon,
    endIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center rounded-lg font-semibold transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full justify-center',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 20 : 16} /> : startIcon}
      {children}
      {!loading && endIcon}
    </button>
  )
})
