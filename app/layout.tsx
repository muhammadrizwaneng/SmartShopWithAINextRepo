import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-context';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { AIProvider } from '@/contexts/ai-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartShop - AI-Powered Shopping Experience',
  description: 'Discover products with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AIProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}