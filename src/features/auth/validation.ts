/** Client-side checks; Firebase re-validates everything server-side. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_RE.test(email.trim())) return 'That email address doesn’t look right.'
  return undefined
}

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'letter', label: 'A letter', test: (p: string) => /[a-z]/i.test(p) },
  { id: 'number', label: 'A number', test: (p: string) => /\d/.test(p) },
] as const

export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'Choose a password.'
  const failed = PASSWORD_RULES.find((rule) => !rule.test(password))
  return failed ? `Password needs: ${failed.label.toLowerCase()}.` : undefined
}

export function validateDisplayName(name: string): string | undefined {
  const trimmed = name.trim()
  if (!trimmed) return 'Enter your name.'
  if (trimmed.length > 50) return 'Keep it under 50 characters.'
  return undefined
}

/**
 * Only same-origin paths are honored for `?redirect=`, so a crafted login link
 * can't bounce users to another site after they sign in.
 */
export function safeRedirect(value: string | null, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback
  }
  return value
}
