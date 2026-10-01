import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthCard } from './components/AuthCard'
import { FormMessage } from './components/FormMessage'
import { validateEmail } from './validation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MailIcon } from '@/components/ui/icons'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AuthError, requestPasswordReset } from '@/lib/auth/session'

export default function ForgotPasswordPage() {
  usePageTitle('Reset password')
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [fieldError, setFieldError] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const invalid = validateEmail(email)
    setFieldError(invalid)
    if (invalid) return

    setError(null)
    setPending(true)
    const address = email.trim()
    try {
      await requestPasswordReset(address)
      setSentTo(address)
    } catch (err) {
      // Don't reveal whether an account exists for this address.
      if (err instanceof AuthError && err.code === 'auth/user-not-found') setSentTo(address)
      else setError(err instanceof Error ? err.message : 'Could not send the reset email.')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter the email you signed up with and we’ll send you a link to choose a new password."
      footer={
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Back to log in
        </Link>
      }
    >
      {sentTo ? (
        <div className="space-y-5">
          <FormMessage tone="success">
            If an account exists for <strong className="font-semibold">{sentTo}</strong>, a reset
            link is on its way. Check your spam folder if it doesn’t arrive in a few minutes.
          </FormMessage>
          <Button variant="outline" fullWidth onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            startIcon={<MailIcon size={17} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError}
            autoFocus
          />
          <Button type="submit" size="lg" fullWidth loading={pending}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
