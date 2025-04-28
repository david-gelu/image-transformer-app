import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Image Transformer App',
    description: 'Transform your images between different formats',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider>
                    <div className=" bg-background">
                        <header className="container mx-auto p-4 flex justify-between items-center bg-nav-bg">
                            <h1 className="text-2xl font-bold text-text">Image Transformer</h1>
                            <ThemeToggle />
                        </header>
                        <main className="container mx-auto p-4">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}