/** Returns a class string from a list of conditional values (tailwind-style helper). */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Truncates a string to `maxLength` characters, appending `…` if needed. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}
