import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountSection } from './AccountSection'
import { FormMessage } from '../components/FormMessage'
import { PasswordInput } from '../components/PasswordInput'
import { validateNewPassword } from '../validation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LogOutIcon, TrashIcon } from '@/components/ui/icons'
import { changePassword, deleteMyAccount, isCancelledAuth, logOut } from '@/lib/auth/session'
import type { AuthUser } from '@/stores/authStore'

export function SecuritySection({ user }: { user: AuthUser }) {
  const hasPassword = user.providers.includes('password')
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ current?: string; next?: string }>({})
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const errors = {
      current: current ? undefined : 'Enter your current password.',
      next:
        validateNewPassword(next) ??
        (next === current ? 'Choose a password you haven’t used here.' : undefined),
    }
    setFieldErrors(errors)
    if (errors.current || errors.next) return

    setSaving(true)
    setMessage(null)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setMessage({ tone: 'success', text: 'Your password was changed.' })
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Could not change it.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountSection
      title="Password"
      description={
        hasPassword ? undefined : 'You sign in with Google, so there’s no password to manage here.'
      }
    >
      {hasPassword && (
        <form onSubmit={submit} noValidate className="space-y-4">
          {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            error={fieldErrors.current}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            error={fieldErrors.next}
            showRules
          />
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              Change password
            </Button>
          </div>
        </form>
      )}
    </AccountSection>
  )
}

export function SessionSection({ user }: { user: AuthUser }) {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    try {
      await logOut()
      navigate('/', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <AccountSection
      title="Sign out & delete"
      tone="danger"
      description="Signing out removes your synced library from this browser. It stays in your account."
    >
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={signOut} loading={signingOut} startIcon={<LogOutIcon size={16} />}>
          Sign out
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)} startIcon={<TrashIcon size={16} />}>
          Delete account
        </Button>
      </div>

      <DeleteAccountDialog user={user} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </AccountSection>
  )
}

function DeleteAccountDialog({
  user,
  open,
  onClose,
}: {
  user: AuthUser
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const hasPassword = user.providers.includes('password')
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const canDelete = confirmText === 'DELETE' && (!hasPassword || password.length > 0)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canDelete) return
    setDeleting(true)
    setError(null)
    try {
      await deleteMyAccount(hasPassword ? password : null)
      navigate('/', { replace: true })
    } catch (err) {
      if (!isCancelledAuth(err)) setError(err instanceof Error ? err.message : 'Could not delete.')
      setDeleting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Delete your account?" size="sm">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-muted">
          This permanently deletes your account and your synced favorites and watchlist. A linked
          TMDB account is disconnected but not deleted. This can’t be undone.
        </p>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        {hasPassword ? (
          <PasswordInput
            label="Confirm with your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <p className="text-sm text-muted">You’ll be asked to confirm with Google.</p>
        )}
        <div>
          <label htmlFor="delete-confirm" className="mb-1.5 block text-sm font-medium">
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
            className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-fg focus:border-danger"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={deleting} disabled={!canDelete}>
            Delete account
          </Button>
        </div>
      </form>
    </Modal>
  )
}
