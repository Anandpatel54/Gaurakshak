import type { Metadata } from 'next';
import { Inter, Outfit, Yatra_One } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
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

const yatraOne = Yatra_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-yatra-one',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['Bhagavad Katha', 'Ramji Janmotsav', 'Shiv Mahapuran', 'Sundarkand Path', 'Spiritual Event Management', 'Gaurakshak Samiti'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth antialiased ${inter.variable} ${outfit.variable} ${yatraOne.variable}`}>
      <body className="min-h-full flex flex-col bg-cream-50 font-sans text-stone-900 select-none">
        <ReduxProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFF8F0',
                color: '#2D2219',
                border: '1px solid #FF6B00',
              },
            }}
          />
          <Header />
          <main className="grow flex flex-col">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </ReduxProvider>
      </body>
    </html>
  );
}
