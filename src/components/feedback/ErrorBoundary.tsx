import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertIcon } from '@/components/ui/icons'

interface Props {
  children: ReactNode
  /** Rendered instead of the default panel when provided. */
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render-phase errors so one broken subtree doesn't blank the app.
 *
 * The previous app had no boundary at all — a single undefined field access
 * (e.g. `data.overview.slice()` on a title with no overview, which happened
 * regularly) unmounted the entire page to a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private reset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <EmptyState
        icon={<AlertIcon size={40} strokeWidth={1.5} className="text-danger" />}
        title="This section failed to load"
        description={
          import.meta.env.DEV ? error.message : 'Please try again, or reload the page.'
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={this.reset}>
              Try again
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        }
      />
    )
  }
}
