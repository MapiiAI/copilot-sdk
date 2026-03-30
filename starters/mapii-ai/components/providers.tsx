'use client'

import { BaseStyles, ThemeProvider } from '@primer/react'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Providers wraps the entire application with Primer's ThemeProvider and
 * BaseStyles. Place all global context providers here.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  )
}
