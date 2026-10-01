import { useState } from 'react'
import type { AuthUser } from '@/stores/authStore'
import { cn } from '@/lib/utils/cn'

function initials(user: AuthUser): string {
  const source = user.displayName || user.email || '?'
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase()
}

/** Profile photo when there is one (Google accounts), otherwise initials. */
export function UserAvatar({
  user,
  size = 32,
  className,
}: {
  user: AuthUser
  size?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) }

  if (user.photoURL && !failed) {
    return (
      <img
        src={user.photoURL}
        alt=""
        style={style}
        // Google profile photos refuse hotlinked requests that send a referrer.
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={cn('shrink-0 rounded-full object-cover', className)}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-brand font-bold text-navy',
        className,
      )}
    >
      {initials(user)}
    </span>
  )
}
