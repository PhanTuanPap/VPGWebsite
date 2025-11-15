import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'VPG Auto - Đại lý VinFast',
  description: 'Đại lý ủy quyền chính thức của VinFast',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  )
}
