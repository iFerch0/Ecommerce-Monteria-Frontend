import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { fetchAPI } from '@/lib/strapi';
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/lib/constants';
import type { GlobalSetting } from '@/types/cms';

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

async function getWhatsAppConfig(): Promise<{ number: string; message: string }> {
  try {
    const data = await fetchAPI<{ data: GlobalSetting }>({
      endpoint: '/global-setting',
      revalidate: 300,
      tags: ['global-setting'],
    });
    return {
      number: data.data?.whatsappNumber || WHATSAPP_NUMBER,
      message: data.data?.whatsappMessage || 'Hola, me interesa hacer un pedido',
    };
  } catch {
    return { number: WHATSAPP_NUMBER, message: 'Hola, me interesa hacer un pedido' };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsapp = await getWhatsAppConfig();

  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <ClientProviders whatsappNumber={whatsapp.number} whatsappMessage={whatsapp.message}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
