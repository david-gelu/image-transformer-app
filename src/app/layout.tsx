import '../components/styles/main.scss';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <header className="header">
            <div className="container">
              <div className="header__content">
                <h1>Image Transformer</h1>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="container">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}