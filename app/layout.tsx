// app/layout.tsx — Root Layout: IIMS IT Club Portal (v4.0)
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/ToastProvider'

// Inter: primary UI font — all text except code/CTF
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

// JetBrains Mono: code blocks and CTF sections ONLY
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'IIMS IT Club — Official Club Portal',
    template: '%s — IIMS IT Club',
  },
  description:
    'The official member portal for the IIMS IT Club at IIMS College, Kathmandu, Nepal. Code. Build. Innovate.',
  keywords: ['IIMS IT Club', 'IIMS College', 'Kathmandu', 'Nepal', 'CTF', 'Programming', 'Technology'],
  openGraph: {
    siteName: 'IIMS IT Club',
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-cosmic-light text-cosmic-black min-h-screen antialiased" suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
