import type { MetadataRoute } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { SITE_URL, ROUTES } from '@/lib/constants';
import type { Product, Category } from '@/types/product';

export const revalidate = 3600; // Re-generate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}${ROUTES.PRODUCTS}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${ROUTES.ABOUT}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}${ROUTES.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}${ROUTES.POLICIES}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[isActive][$eq]': 'true',
        'pagination[pageSize]': '500',
        sort: 'updatedAt:desc',
      },
    });

    productRoutes = (data.data || []).map((product) => ({
      url: `${SITE_URL}${ROUTES.PRODUCTS}/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If Strapi is down during build, skip dynamic products
  }

  // Dynamic category routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const data = await fetchAPI<{ data: Category[] }>({
      endpoint: '/categories',
      query: {
        'filters[isActive][$eq]': 'true',
        'pagination[pageSize]': '50',
        sort: 'sortOrder:asc',
      },
    });

    categoryRoutes = (data.data || []).map((category) => ({
      url: `${SITE_URL}${ROUTES.CATEGORIES}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // If Strapi is down during build, skip dynamic categories
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
