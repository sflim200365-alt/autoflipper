import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Auto Flipper',
  description: 'Track vehicle inventory and profits',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}