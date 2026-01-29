import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import '@/styles/globals.css'
import '@/styles/fonts.css'

export const metadata: Metadata = {
  title: 'Hacvent - Claim Your HVAC Rebates Easily Across the US',
  description: 'Connect with certified HVAC contractors and simplify your rebate claims. Get expert support for energy-efficient upgrades nationwide.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
