import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Castor Spotify - Tu música inteligente',
  description: 'Plataforma musical con IA integrada para recomendaciones personalizadas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-negro-suave min-h-screen`}>
        {children}
      </body>
    </html>
  )
}