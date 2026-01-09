import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DataProvider } from '@/lib/context/DataContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'My Wealth Flow - Personal Finance Dashboard',
    description: 'Track your spending, manage investment properties, and take control of your finances',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <DataProvider>
                    {children}
                </DataProvider>
            </body>
        </html>
    )
}
