import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PostMortem AI — Incident Report Generator',
  description: 'Paste your error logs and incident timeline. Get a structured post-mortem in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-slate-200">
        {children}
      </body>
    </html>
  )
}
