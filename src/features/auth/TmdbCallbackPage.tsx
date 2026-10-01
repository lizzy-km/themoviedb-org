import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthCard } from './components/AuthCard'
import { FormMessage } from './components/FormMessage'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { beginTmdbLink, linkTmdbFromCallback } from '@/lib/auth/session'
import type { CompleteLinkResult } from '@/lib/tmdb/accountSync'
import { useAuthUser } from '@/stores/authStore'

/**
 * Landing page for TMDB's approval redirect
 * (`/auth/tmdb/callback?request_token=…&approved=true`). Rendered inside
 * <RequireAuth>, so the Firebase user is known by the time this mounts.
 */
export default function TmdbCallbackPage() {
  usePageTitle('Connecting TMDB')
  const user = useAuthUser()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [result, setResult] = useState<Exclude<CompleteLinkResult, { status: 'linked' }> | null>(null)
  const [retrying, setRetrying] = useState(false)

  // The request token is single-use; StrictMode's double effect must not spend it twice.
  const handled = useRef(false)

  useEffect(() => {
    if (!user || handled.current) return
    handled.current = true

    void linkTmdbFromCallback(user.uid, params).then((outcome) => {
      if (outcome.status === 'linked') {
        navigate('/account', { replace: true, state: { tmdbLinked: outcome.username } })
      } else {
        setResult(outcome)
      }
    })
  }, [user, params, navigate])

  const retry = async () => {
    if (!user) return
    setRetrying(true)
    try {
      await beginTmdbLink(user.uid)
    } catch {
      setRetrying(false)
      setResult({ status: 'invalid', message: 'Couldn’t reach TMDB. Check your connection and try again.' })
    }
  }

  if (!result) {
    return (
      <AuthCard title="Connecting your TMDB account">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Spinner size={20} className="text-brand" />
          Finishing up with TMDB…
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={result.status === 'denied' ? 'Connection cancelled' : 'Couldn’t connect TMDB'}
      footer={
        <Link to="/account" className="font-semibold text-brand hover:underline">
          Back to your account
        </Link>
      }
    >
      <FormMessage tone={result.status === 'denied' ? 'info' : 'error'} className="mb-5">
        {result.status === 'denied'
          ? 'You didn’t approve access on themoviedb.org, so nothing was linked.'
          : result.message}
      </FormMessage>
      <Button fullWidth size="lg" onClick={retry} loading={retrying}>
        Try again
      </Button>
    </AuthCard>
  )
}
