import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAPI } from '@/lib/strapi';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product, Category } from '@/types/product';
import { SITE_NAME, SITE_URL, ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const data = await fetchAPI<{ data: Category[] }>({
      endpoint: '/categories',
      query: {
        'filters[slug][$eq]': slug,
        populate: 'image,children',
      },
      revalidate: 60,
      tags: ['categories'],
    });
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[category][slug][$eq]': slug,
        'filters[isActive][$eq]': 'true',
        populate: 'coverImage,images,category,priceTiers',
        'pagination[pageSize]': '24',
        sort: 'createdAt:desc',
      },
      revalidate: 60,
      tags: ['products', 'categories'],
    });
    return data.data || [];
  } catch {
    return [];
  }
}

// Pre-generate all active categories at build time
export async function generateStaticParams() {
  try {
    const data = await fetchAPI<{ data: Category[] }>({
      endpoint: '/categories',
      query: {
        'filters[isActive][$eq]': 'true',
        'pagination[pageSize]': '50',
      },
    });
    return (data.data || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  const canonical = `${SITE_URL}${ROUTES.CATEGORIES}/${slug}`;
  const description =
    category.description ||
    `Compra ${category.name} al por mayor en ${SITE_NAME}. Los mejores precios con envíos a todo Colombia.`;

  return {
    title: `${category.name} al por Mayor`,
    description,
    keywords: [
      `${category.name} al por mayor`,
      `${category.name} mayorista`,
      `${category.name} Colombia`,
      `${category.name} Montería`,
      SITE_NAME,
    ],
    alternates: { canonical },
    openGraph: {
      title: `${category.name} al por Mayor | ${SITE_NAME}`,
      description,
      type: 'website',
      url: canonical,
      locale: 'es_CO',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} al por Mayor | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getCategory(slug), getProductsByCategory(slug)]);

  if (!category) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Inicio', url: SITE_URL },
    { name: 'Categorías', url: `${SITE_URL}${ROUTES.CATEGORIES}` },
    { name: category.name, url: `${SITE_URL}${ROUTES.CATEGORIES}/${slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Structured data */}
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />
      {products.length > 0 && <JsonLd schema={itemListSchema(category, products)} />}

      {/* Breadcrumb */}
      <nav className="text-text-secondary mb-6 flex items-center gap-2 text-sm">
        <Link href={ROUTES.HOME} className="hover:text-accent transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href={ROUTES.CATEGORIES} className="hover:text-accent transition-colors">
          Categorías
        </Link>
        <span>/</span>
        <span className="text-text">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-text mb-2 text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="text-text-secondary">{category.description}</p>}
        <p className="text-text-muted mt-2 text-sm">
          {products.length} producto{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        emptyMessage={`No hay productos en ${category.name} por el momento.`}
      />
    </div>
  );
}
