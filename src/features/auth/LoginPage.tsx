import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthCard } from './components/AuthCard'
import { FormMessage } from './components/FormMessage'
import { GoogleButton, OrDivider } from './components/GoogleButton'
import { PasswordInput } from './components/PasswordInput'
import { safeRedirect, validateEmail } from './validation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MailIcon } from '@/components/ui/icons'
import { usePageTitle } from '@/hooks/usePageTitle'
import { continueWithGoogle, isCancelledAuth, logIn } from '@/lib/auth/session'

export default function LoginPage() {
  usePageTitle('Log in')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'))

  const [email, setEmail] = useState(params.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<'password' | 'google' | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const errors = {
      email: validateEmail(email),
      password: password ? undefined : 'Enter your password.',
    }
    setFieldErrors(errors)
    if (errors.email || errors.password) return

    setError(null)
    setPending('password')
    try {
      await logIn(email.trim(), password, remember)
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.')
      setPending(null)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setPending('google')
    try {
      await continueWithGoogle('login')
      navigate(redirect, { replace: true })
    } catch (err) {
      if (!isCancelledAuth(err)) setError(err instanceof Error ? err.message : 'Could not log in.')
      setPending(null)
    }
  }

  const resetHref = `/forgot-password${email ? `?email=${encodeURIComponent(email.trim())}` : ''}`

  return (
    <AuthCard
      title="Log in to your account"
      subtitle="Sync your favorites and watchlist across devices, and with TMDB."
      footer={
        <>
          Don’t have an account?{' '}
          <Link
            to={`/signup${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-brand hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {error && <FormMessage tone="error" className="mb-5">{error}</FormMessage>}

      <GoogleButton onClick={handleGoogle} loading={pending === 'google'} disabled={pending !== null} />
      <OrDivider />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          startIcon={<MailIcon size={17} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          autoFocus={!email}
        />

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-fg">
              Password
            </label>
            <Link to={resetHref} className="text-sm font-semibold text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            autoFocus={Boolean(email)}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-brand"
          />
          Keep me signed in
        </label>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={pending === 'password'}
          disabled={pending !== null}
        >
          Log in
        </Button>
      </form>
    </AuthCard>
  )
}
