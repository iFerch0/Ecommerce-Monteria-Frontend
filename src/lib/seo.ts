import { SITE_NAME, SITE_URL } from './constants';
import type { Product, Category } from '@/types/product';

// ─── Organization ────────────────────────────────────────────────────────────

export function organizationSchema(opts?: {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description:
      'Tienda mayorista de ropa, calzado y accesorios en Montería, Córdoba. ' +
      'Los mejores precios al por mayor con envíos a todo Colombia.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: opts?.city || 'Montería',
      addressRegion: 'Córdoba',
      addressCountry: 'CO',
      streetAddress: opts?.address || undefined,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
      ...(opts?.phone && { telephone: opts.phone }),
      ...(opts?.email && { email: opts.email }),
    },
    ...(opts?.instagram || opts?.facebook
      ? {
          sameAs: [opts.instagram, opts.facebook].filter(Boolean),
        }
      : {}),
  };
}

// ─── WebSite (SiteLinks Search Box) ─────────────────────────────────────────

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/productos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function productSchema(product: Product) {
  const url = `${SITE_URL}/productos/${product.slug}`;
  const imageUrl = product.coverImage?.url
    ? product.coverImage.url.startsWith('http')
      ? product.coverImage.url
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${product.coverImage.url}`
    : undefined;

  const lowestPrice =
    product.priceTiers && product.priceTiers.length > 0
      ? Math.min(...product.priceTiers.map((t) => t.pricePerUnit))
      : product.basePrice;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.name,
    url,
    ...(product.sku && { sku: product.sku }),
    ...(product.brand && {
      brand: { '@type': 'Brand', name: product.brand },
    }),
    ...(imageUrl && { image: imageUrl }),
    ...(product.category && {
      category: product.category.name,
    }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'COP',
      lowPrice: lowestPrice,
      highPrice: product.basePrice,
      offerCount: product.priceTiers?.length || 1,
      availability: product.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

// ─── ItemList (Category / Products listing) ──────────────────────────────────

export function itemListSchema(category: Category, products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — ${SITE_NAME}`,
    description:
      category.description ||
      `Catálogo de ${category.name} al por mayor. Los mejores precios en Colombia.`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/productos/${p.slug}`,
      name: p.name,
    })),
  };
}

// ─── Serializer helper (use with <JsonLd schema={...} /> component) ──────────

export function serializeSchema(schema: object): string {
  return JSON.stringify(schema);
}
