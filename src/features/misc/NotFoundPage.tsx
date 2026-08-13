import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertIcon } from '@/components/ui/icons'
import { usePageTitle } from '@/hooks/usePageTitle'

/**
 * 404 page.
 *
 * The old router mapped `path="*"` to the home page, so a typo'd URL silently
 * rendered the homepage and the address bar kept the bad path.
 */
export function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <Container className="py-16">
      <EmptyState
        icon={<AlertIcon size={48} strokeWidth={1.5} />}
        title="404 — Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => window.history.back()} variant="outline">
              Go back
            </Button>
            <Link to="/">
              <Button>Back to home</Button>
            </Link>
          </div>
        }
      />
    </Container>
  )
}

export default NotFoundPage
