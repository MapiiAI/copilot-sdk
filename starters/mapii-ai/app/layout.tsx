import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { AppShell } from '@/components/app-shell'

export const metadata: Metadata = {
  title: 'mapii.ai',
  description: 'AI-powered productivity, designed with Primer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
