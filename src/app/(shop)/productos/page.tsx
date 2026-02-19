import type { Metadata } from 'next';
import { fetchAPI } from '@/lib/strapi';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/types/product';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: `Explora nuestro catálogo completo de ropa, calzado y accesorios al por mayor. ${SITE_NAME}`,
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

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
