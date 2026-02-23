import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { fetchAPI } from '@/lib/strapi';
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/lib/constants';
import { organizationSchema, webSiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import type { GlobalSetting } from '@/types/cms';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Venta al por Mayor`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Tienda mayorista de ropa, calzado y accesorios en Montería, Córdoba. ' +
    'Los mejores precios al por mayor con envíos a todo Colombia.',
  keywords: [
    'ropa al por mayor',
    'calzado mayorista',
    'Montería',
    'Córdoba',
    'Colombia',
    'venta al por mayor',
    'tienda mayorista',
    'ropa al por mayor Montería',
    'calzado mayorista Córdoba',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} — Venta al por Mayor`,
    description:
      'Los mejores precios al por mayor en ropa, calzado y accesorios. Montería, Córdoba.',
    type: 'website',
    locale: 'es_CO',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/icons/icon-512.png`,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — Venta al por Mayor`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Venta al por Mayor`,
    description:
      'Los mejores precios al por mayor en ropa, calzado y accesorios. Montería, Córdoba.',
    images: [`${SITE_URL}/icons/icon-512.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

async function getGlobalSettings(): Promise<GlobalSetting | null> {
  try {
    const data = await fetchAPI<{ data: GlobalSetting }>({
      endpoint: '/global-setting',
      revalidate: 300,
      tags: ['global-setting'],
    });
    return data.data || null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  const whatsapp = {
    number: settings?.whatsappNumber || WHATSAPP_NUMBER,
    message: settings?.whatsappMessage || 'Hola, me interesa hacer un pedido',
  };

  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {/* Global structured data */}
        <JsonLd
          schema={organizationSchema({
            phone: settings?.phone,
            email: settings?.email,
            address: settings?.address,
            city: settings?.city,
            instagram: settings?.instagramUrl,
            facebook: settings?.facebookUrl,
          })}
        />
        <JsonLd schema={webSiteSchema()} />

        <ClientProviders whatsappNumber={whatsapp.number} whatsappMessage={whatsapp.message}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
