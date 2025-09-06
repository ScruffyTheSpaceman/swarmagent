import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthWrapper from '@/components/auth/auth-wrapper'
import Navigation from '@/components/navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QD-Enhanced Multi-LLM Swarm Agent System',
  description: 'Enterprise-grade AI development system with advanced memory, planning, and collaboration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </AuthWrapper>
      </body>
    </html>
  )
}