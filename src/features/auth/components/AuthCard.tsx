import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface AuthCardProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  /** Below-the-card line, e.g. "Don't have an account? Sign up". */
  footer?: ReactNode
}

/** Centered card shell shared by the login, sign-up and reset pages. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-start justify-center bg-surface-2 px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="gradient-text text-2xl font-extrabold">MOVIE</span>
          <span>Explorer</span>
        </Link>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-panel sm:p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
      </div>
    </div>
  )
}
