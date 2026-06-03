import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from 'react-hot-toast';
import { SITE_CONFIG } from '@/constants/siteConfig';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Dashboard`,
  description: SITE_CONFIG.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${outfit.variable}`}>
      <head></head>
      <body className="h-full flex flex-col bg-[#F8F9FB] text-stone-900 select-none">
        <ReduxProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#1F2937',
                border: '1px solid #FF6B00',
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
