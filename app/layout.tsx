import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MOT Alert - Never Miss an MOT Again | Professional Vehicle Tracking Service',
  description: 'Professional MOT tracking service with SMS reminders, unlimited vehicles, and priority support. Start your 14-day free trial today. Trusted by thousands of drivers across the UK.',
  keywords: 'MOT tracking, vehicle MOT, MOT reminders, SMS alerts, vehicle management, MOT compliance, UK MOT, car MOT, van MOT, fleet management',
  authors: [{ name: 'FAC Systems Ltd' }],
  creator: 'FAC Systems Ltd',
  publisher: 'FAC Systems Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mot-alert.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MOT Alert - Never Miss an MOT Again',
    description: 'Professional MOT tracking service with SMS reminders, unlimited vehicles, and priority support. Start your 14-day free trial today.',
    url: 'https://mot-alert.com',
    siteName: 'MOT Alert',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'MOT Alert - Professional Vehicle MOT Tracking Service',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOT Alert - Never Miss an MOT Again',
    description: 'Professional MOT tracking service with SMS reminders, unlimited vehicles, and priority support.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.jpg" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
