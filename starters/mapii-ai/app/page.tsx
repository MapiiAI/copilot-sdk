import { Box, Text, Link } from '@primer/react'

export default function HomePage() {
  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: 'auto',
        py: 8,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Text as="h1" sx={{ fontSize: 6, fontWeight: 'bold', color: 'fg.default', m: 0 }}>
        Welcome to mapii.ai
      </Text>

      <Text as="p" sx={{ fontSize: 2, color: 'fg.muted', lineHeight: 1.6, m: 0 }}>
        A minimal, production-ready starter built with Next.js App Router,{' '}
        <Link href="https://primer.style/react" target="_blank" rel="noopener noreferrer">
          Primer React
        </Link>
        , and the{' '}
        <Link href="https://sdk.vercel.ai" target="_blank" rel="noopener noreferrer">
          Vercel AI SDK
        </Link>
        .
      </Text>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Link
          href="/chat"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            bg: 'accent.emphasis',
            color: 'fg.onEmphasis',
            borderRadius: 2,
            fontWeight: 'semibold',
            textDecoration: 'none',
            fontSize: 1,
            ':hover': { bg: 'accent.fg', color: 'fg.onEmphasis' },
          }}
        >
          Open Chat
        </Link>
        <Link
          href="https://github.com/MapiiAI/copilot-sdk/tree/main/starters/mapii-ai"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            bg: 'canvas.subtle',
            color: 'fg.default',
            border: '1px solid',
            borderColor: 'border.default',
            borderRadius: 2,
            fontWeight: 'semibold',
            textDecoration: 'none',
            fontSize: 1,
            ':hover': { bg: 'canvas.inset' },
          }}
        >
          View Source
        </Link>
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          bg: 'canvas.subtle',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', fontFamily: 'mono', m: 0 }}>
          Stack: Next.js 15 · Primer React · Primer Primitives · Vercel AI SDK · TypeScript
        </Text>
      </Box>
    </Box>
  )
}
