import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { fetchAPI } from '@/lib/strapi';
import { getImageUrl } from '@/lib/utils';
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/lib/constants';
import { organizationSchema, webSiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { FacebookPixel } from '@/components/analytics/FacebookPixel';
import type { GlobalSetting } from '@/types/cms';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

async function getGlobalSettings(): Promise<GlobalSetting | null> {
  try {
    const data = await fetchAPI<{ data: GlobalSetting }>({
      endpoint: '/global-setting',
      query: { 'populate[0]': 'logo', 'populate[1]': 'favicon' },
      revalidate: 300,
      tags: ['global-setting'],
    });
    return data.data || null;
  } catch {
    return null;
  }
}

function faviconMime(url: string): string {
  if (url.endsWith('.svg')) return 'image/svg+xml';
  if (url.endsWith('.ico')) return 'image/x-icon';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  if (url.endsWith('.webp')) return 'image/webp';
  return 'image/png';
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  const siteName = settings?.storeName || SITE_NAME;
  const faviconUrl = settings?.favicon ? getImageUrl(settings.favicon.url) : null;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${siteName} — Venta al por Mayor`,
      template: `%s | ${siteName}`,
    },
    description:
      settings?.metaDescription ||
      'Tienda mayorista de ropa, calzado y accesorios en Montería, Córdoba. ' +
        'Los mejores precios al por mayor con envíos a todo Colombia.',
    keywords: settings?.metaKeywords
      ? settings.metaKeywords.split(',').map((k) => k.trim())
      : ['ropa al por mayor', 'calzado mayorista', 'Montería', 'Córdoba', 'Colombia'],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `${siteName} — Venta al por Mayor`,
      description:
        settings?.metaDescription ||
        'Los mejores precios al por mayor en ropa, calzado y accesorios. Montería, Córdoba.',
      type: 'website',
      locale: 'es_CO',
      siteName,
      url: SITE_URL,
      images: [{ url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} — Venta al por Mayor`,
      description:
        settings?.metaDescription ||
        'Los mejores precios al por mayor en ropa, calzado y accesorios. Montería, Córdoba.',
      images: [`${SITE_URL}/icons/icon-512.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    manifest: '/manifest.json',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: siteName },
    icons: faviconUrl
      ? {
          icon: [{ url: faviconUrl, type: faviconMime(faviconUrl) }],
          apple: [{ url: faviconUrl }],
          shortcut: faviconUrl,
        }
      : {
          icon: [
            { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
          apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
        },
  };
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
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
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

        <GoogleAnalytics />
        <FacebookPixel />

        <ClientProviders whatsappNumber={whatsapp.number} whatsappMessage={whatsapp.message}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
