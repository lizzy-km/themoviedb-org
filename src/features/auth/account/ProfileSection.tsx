import { useState } from 'react'
import type { FormEvent } from 'react'
import { AccountSection } from './AccountSection'
import { FormMessage } from '../components/FormMessage'
import { validateDisplayName } from '../validation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { refreshUser, resendVerificationEmail, updateDisplayName } from '@/lib/auth/session'
import type { AuthUser } from '@/stores/authStore'

export function ProfileSection({ user }: { user: AuthUser }) {
  const [name, setName] = useState(user.displayName ?? '')
  const [fieldError, setFieldError] = useState<string>()
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const dirty = name.trim() !== (user.displayName ?? '')

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const invalid = validateDisplayName(name)
    setFieldError(invalid)
    if (invalid) return
    setSaving(true)
    setMessage(null)
    try {
      await updateDisplayName(name.trim())
      setMessage({ tone: 'success', text: 'Your name was updated.' })
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Could not save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountSection title="Profile">
      <form onSubmit={save} noValidate className="space-y-4">
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        <Input
          label="Display name"
          autoComplete="name"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          error={fieldError}
        />
        <Input label="Email" value={user.email ?? ''} readOnly disabled />
        <div className="flex justify-end">
          <Button type="submit" loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>
    </AccountSection>
  )
}

/** Shown until a password user confirms their email address. */
export function VerifyEmailBanner({ email }: { email: string | null }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'checking'>('idle')
  const [error, setError] = useState<string | null>(null)

  const resend = async () => {
    setState('sending')
    setError(null)
    try {
      await resendVerificationEmail()
      setState('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the email.')
      setState('idle')
    }
  }

  const check = async () => {
    setState('checking')
    setError(null)
    try {
      await refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not refresh.')
    } finally {
      setState('idle')
    }
  }

  return (
    <FormMessage tone={error ? 'error' : 'info'}>
      <p className="font-semibold">Verify your email address</p>
      <p className="mt-0.5 text-muted">
        {error ??
          (state === 'sent'
            ? `A new verification link was sent to ${email ?? 'your inbox'}.`
            : `We sent a link to ${email ?? 'your inbox'}. Click it to confirm it’s really you.`)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={check} loading={state === 'checking'}>
          I’ve verified it
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resend}
          loading={state === 'sending'}
          disabled={state === 'sent'}
        >
          {state === 'sent' ? 'Email sent' : 'Resend email'}
        </Button>
      </div>
    </FormMessage>
  )
}
