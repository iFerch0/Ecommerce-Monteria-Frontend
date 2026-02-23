import type { Metadata } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/types/product';
import { SITE_NAME, SITE_URL, ROUTES } from '@/lib/constants';
import { breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

const canonical = `${SITE_URL}${ROUTES.PRODUCTS}`;
const description = `Explora nuestro catálogo completo de ropa, calzado y accesorios al por mayor. ${SITE_NAME}. Los mejores precios con envíos a todo Colombia.`;

export const metadata: Metadata = {
  title: 'Catálogo de Productos al por Mayor',
  description,
  keywords: [
    'ropa al por mayor',
    'calzado mayorista',
    'accesorios mayorista',
    'catálogo mayorista',
    'Colombia',
    'Montería',
    SITE_NAME,
  ],
  alternates: { canonical },
  openGraph: {
    title: `Catálogo al por Mayor | ${SITE_NAME}`,
    description,
    type: 'website',
    url: canonical,
    locale: 'es_CO',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Catálogo al por Mayor | ${SITE_NAME}`,
    description,
  },
};

async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[isActive][$eq]': 'true',
        populate: 'coverImage,images,category,priceTiers',
        'pagination[pageSize]': '24',
        sort: 'createdAt:desc',
      },
      revalidate: 60,
      tags: ['products'],
    });
    return data.data || [];
  } catch {
    return [];
  }
}

const breadcrumbItems = [
  { name: 'Inicio', url: SITE_URL },
  { name: 'Productos', url: canonical },
];

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-text mb-2 text-3xl font-bold">Catálogo de Productos</h1>
        <p className="text-text-secondary">
          Explora nuestra colección completa de productos al por mayor
        </p>
      </div>

      {/* Filters bar */}
      <div className="border-border bg-surface-alt mb-6 flex flex-wrap items-center gap-3 rounded-xl border p-3">
        <span className="text-text-secondary text-sm font-medium">Filtrar:</span>
        {['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Variados'].map((filter) => (
          <button
            key={filter}
            className="border-border text-text-secondary first:border-accent first:bg-accent/10 first:text-accent hover:border-accent/50 hover:text-accent rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          {products.length} producto{products.length !== 1 ? 's' : ''} encontrado
          {products.length !== 1 ? 's' : ''}
        </p>
        <select className="border-border bg-surface text-text-secondary rounded-lg border px-3 py-1.5 text-sm">
          <option>Más recientes</option>
          <option>Precio: menor a mayor</option>
          <option>Precio: mayor a menor</option>
          <option>Nombre: A-Z</option>
        </select>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
