import type React from 'react'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: 'Grupo D - IFTS 18 - Aprende Redes de Forma Interactiva',
  description:
    'Plataforma educativa interactiva para aprender protocolos de red: DNS, DHCP, ARP, STP y Subnetting',
  icons: {
    icon: {
      url: '/ifts18.svg',
      type: 'image/svg+xml'
    }
  }
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' className={`${jetbrainsMono.variable} antialiased dark`}>
      <body className='min-h-screen bg-background font-mono text-foreground'>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
