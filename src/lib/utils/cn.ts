type ClassValue = string | number | null | undefined | false | ClassValue[]

/**
 * Joins conditional class names.
 *
 * A deliberately tiny replacement for clsx — falsy values are dropped and
 * arrays are flattened, which is all this codebase needs.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []

  for (const value of values) {
    if (!value) continue
    if (Array.isArray(value)) {
      const nested = cn(...value)
      if (nested) out.push(nested)
    } else {
      out.push(String(value))
    }
  }

  return out.join(' ')
}
