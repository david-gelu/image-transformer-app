import '../components/styles/main.scss'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { themeScript } from '@/lib/theme-script'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <header className="header">
            <div className="header__content"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
              <h1>Image Transformer</h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="container">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}