import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAPI } from '@/lib/strapi';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product, Category } from '@/types/product';
import { SITE_NAME, ROUTES } from '@/lib/constants';
import Link from 'next/link';

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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  return {
    title: `${category.name} — Catálogo al por Mayor`,
    description:
      category.description ||
      `Compra ${category.name} al por mayor en ${SITE_NAME}. Los mejores precios.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getCategory(slug), getProductsByCategory(slug)]);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
