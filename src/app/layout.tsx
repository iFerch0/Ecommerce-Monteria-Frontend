import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Venta al por Mayor`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Tienda mayorista de ropa, calzado y accesorios en Montería, Córdoba. Los mejores precios al por mayor con envíos a todo Colombia.',
  keywords: [
    'ropa al por mayor',
    'calzado mayorista',
    'Montería',
    'Córdoba',
    'Colombia',
    'venta al por mayor',
    'tienda mayorista',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — Venta al por Mayor`,
    description:
      'Los mejores precios al por mayor en ropa, calzado y accesorios. Montería, Córdoba.',
    type: 'website',
    locale: 'es_CO',
    siteName: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
