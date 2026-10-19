import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ziply — Short links. Big impact.',
  description: 'Turn long, messy URLs into clean, memorable links in a single click.',
  generator: 'v0.app',
  icons: {
    icon: '/ziply-favicon.png',
    apple: '/ziply-favicon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f3ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1024' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
