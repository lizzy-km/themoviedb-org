import { useState } from 'react'
import { AccountSection } from './AccountSection'
import { FormMessage } from '../components/FormMessage'
import { Button } from '@/components/ui/Button'
import { ExternalLinkIcon, LinkIcon, RefreshIcon } from '@/components/ui/icons'
import { beginTmdbLink, syncTmdbNow, unlinkTmdb } from '@/lib/auth/session'
import { profileUrl } from '@/lib/tmdb/images'
import { useTmdbStore } from '@/stores/tmdbStore'
import type { TmdbLinkedAccount } from '@/stores/tmdbStore'

function avatarSrc(account: TmdbLinkedAccount): string | null {
  if (account.avatarPath) return profileUrl(account.avatarPath, 'w185')
  if (account.gravatarHash) return `https://secure.gravatar.com/avatar/${account.gravatarHash}?s=96&d=identicon`
  return null
}

function formatSynced(timestamp: number | null): string {
  if (!timestamp) return 'Not synced yet'
  return `Last synced ${new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })}`
}

export function TmdbSection({ uid, justLinked }: { uid: string; justLinked: string | null }) {
  const account = useTmdbStore((s) => s.account)
  const syncing = useTmdbStore((s) => s.syncing)
  const syncError = useTmdbStore((s) => s.syncError)
  const lastSyncAt = useTmdbStore((s) => s.lastSyncAt)
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [unlinking, setUnlinking] = useState(false)

  const connect = async () => {
    setConnecting(true)
    setConnectError(null)
    try {
      await beginTmdbLink(uid) // navigates away on success
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Couldn’t reach TMDB.')
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    setUnlinking(true)
    await unlinkTmdb('manual')
    setUnlinking(false)
  }

  return (
    <AccountSection
      title="TMDB account"
      description="Connect your themoviedb.org account to keep favorites and watchlist in sync with TMDB."
    >
      {justLinked && account && (
        <FormMessage tone="success" className="mb-4">
          Connected as <strong className="font-semibold">{account.username}</strong>. Your TMDB
          favorites and watchlist are being imported.
        </FormMessage>
      )}
      {(syncError || connectError) && (
        <FormMessage tone="error" className="mb-4">
          {connectError ?? syncError}
        </FormMessage>
      )}

      {account ? (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {avatarSrc(account) ? (
              <img
                src={avatarSrc(account) ?? undefined}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-lg font-bold text-brand">
                {account.username.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <a
                href={`https://www.themoviedb.org/u/${encodeURIComponent(account.username)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold hover:text-brand"
              >
                {account.name || account.username}
                <ExternalLinkIcon size={14} />
              </a>
              <p className="truncate text-sm text-muted">
                @{account.username} · {syncing ? 'Syncing…' : formatSynced(lastSyncAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void syncTmdbNow()}
              loading={syncing}
              startIcon={<RefreshIcon size={15} />}
            >
              Sync now
            </Button>
            <Button variant="ghost" size="sm" onClick={disconnect} loading={unlinking}>
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={connect} loading={connecting} startIcon={<LinkIcon size={16} />}>
          Connect TMDB account
        </Button>
      )}

      <p className="mt-4 text-xs text-subtle">
        You’ll approve access on themoviedb.org. Disconnecting revokes the session; titles already
        saved stay in your library.
      </p>
    </AccountSection>
  )
}
