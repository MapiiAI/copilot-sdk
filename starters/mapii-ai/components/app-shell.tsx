'use client'

import { Box, Header, Link } from '@primer/react'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

/**
 * AppShell provides the top-level page frame: a fixed navigation header and a
 * full-height content area. Add persistent sidebars or footers here.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bg: 'canvas.default',
      }}
    >
      <Header>
        <Header.Item>
          <Link href="/" sx={{ color: 'fg.onEmphasis', fontWeight: 'bold', textDecoration: 'none' }}>
            mapii.ai
          </Link>
        </Header.Item>
        <Header.Item full />
        <Header.Item>
          <Link href="/chat" sx={{ color: 'fg.onEmphasis', textDecoration: 'none' }}>
            Chat
          </Link>
        </Header.Item>
      </Header>

      <Box as="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  )
}
