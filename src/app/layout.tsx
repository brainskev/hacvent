import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import '@/styles/globals.css'
import '@/styles/fonts.css'

export const metadata: Metadata = {
  title: 'Hacvent - Get Approved for HVAC Rebates Easily | Energy Savings',
  description: 'Connect with certified HVAC contractors and maximize your energy-efficient rebates. Free guidance, verified contractors, 50+ state programs. Save $5,000+ on your HVAC upgrade.',
  keywords: 'HVAC rebates, energy-efficient heating, cooling rebates, federal tax credits, contractor matching, rebate programs',
  metadataBase: new URL('https://hacvent.com'),
  icons: {
    icon: [
      { url: '/favicon-hacvent.svg?v=2', type: 'image/svg+xml' },
    ],
    apple: '/favicon-hacvent.svg?v=2',
    shortcut: '/favicon-hacvent.svg?v=2',
  },
  alternates: {
    canonical: 'https://hacvent.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hacvent.com',
    title: 'Hacvent - Get Approved for HVAC Rebates Easily',
    description: 'Connect with certified HVAC contractors and maximize your energy-efficient rebates. Free guidance, verified contractors, 50+ state programs.',
    siteName: 'Hacvent',
    images: [
      {
        url: 'https://hacvent.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hacvent - HVAC Rebate Service by Marxma LLC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hacvent - Get Approved for HVAC Rebates Easily',
    description: 'Connect with certified HVAC contractors and maximize your energy-efficient rebates. Free guidance, verified contractors.',
    images: ['https://hacvent.com/twitter-image.png'],
  },
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
    <ClerkProvider
      appearance={{
        elements: {
          badge: 'hidden',
        },
      }}
    >
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
