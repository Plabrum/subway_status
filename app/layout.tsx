import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import Footer from './components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subway Status',
  description: 'Real Time MTA Subway informtion',
  themeColor: '#111827',
  keywords: 'MTA, NYC, Subway, Status, Alerts',
  authors: [{ name: 'Phil Labrum', url: 'https://plabrum.com' }],
  openGraph: {
    title: 'Subway Status',
    description: 'Real Time MTA Subway informtion',
    creators: ['Phil Labrum']
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body className={`${inter.className} h-full bg-gray-900`}>
        {/* Flex container for layout */}
        <div className="flex min-h-full flex-col text-white">
          <Link
            href={'/'}
            className="mx-auto w-full py-4 sm:p-8"
          >
            <h1 className="text-center text-3xl font-bold sm:text-4xl">MTA Subway Information</h1>
          </Link>
          {/* Content */}
          <main className="flex flex-grow flex-col items-center text-white">
            <div className="w-full px-4 sm:w-5/6">{children}</div>
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  )
}
