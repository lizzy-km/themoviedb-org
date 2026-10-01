import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthCard } from './components/AuthCard'
import { FormMessage } from './components/FormMessage'
import { GoogleButton, OrDivider } from './components/GoogleButton'
import { PasswordInput } from './components/PasswordInput'
import { safeRedirect, validateDisplayName, validateEmail, validateNewPassword } from './validation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MailIcon, UserIcon } from '@/components/ui/icons'
import { usePageTitle } from '@/hooks/usePageTitle'
import { continueWithGoogle, isCancelledAuth, signUp } from '@/lib/auth/session'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirm?: string
}

export default function SignUpPage() {
  usePageTitle('Sign up')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'), '/account')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<'password' | 'google' | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const errors: FieldErrors = {
      name: validateDisplayName(name),
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirm: confirm === password ? undefined : 'Passwords don’t match.',
    }
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) return

    setError(null)
    setPending('password')
    try {
      await signUp(name.trim(), email.trim(), password)
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.')
      setPending(null)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setPending('google')
    try {
      await continueWithGoogle('sign_up')
      navigate(redirect, { replace: true })
    } catch (err) {
      if (!isCancelledAuth(err)) {
        setError(err instanceof Error ? err.message : 'Could not create your account.')
      }
      setPending(null)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="It’s free. Anything you’ve already saved on this device comes with you."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={`/login${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-brand hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      {error && <FormMessage tone="error" className="mb-5">{error}</FormMessage>}

      <GoogleButton
        label="Sign up with Google"
        onClick={handleGoogle}
        loading={pending === 'google'}
        disabled={pending !== null}
      />
      <OrDivider />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Name"
          autoComplete="name"
          startIcon={<UserIcon size={17} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          maxLength={50}
          autoFocus
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          startIcon={<MailIcon size={17} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          showRules
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={fieldErrors.confirm}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={pending === 'password'}
          disabled={pending !== null}
        >
          Create account
        </Button>

        <p className="text-center text-xs text-subtle">
          We’ll email you a link to verify your address.
        </p>
      </form>
    </AuthCard>
  )
}
