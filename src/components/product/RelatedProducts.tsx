import { fetchAPI } from '@/lib/strapi';
import type { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';

interface RelatedProductsProps {
  currentProductId: number;
  categoryId: number | null;
}

async function getRelatedProducts(
  currentProductId: number,
  categoryId: number | null
): Promise<Product[]> {
  try {
    const query: Record<string, string> = {
      'filters[isActive][$eq]': 'true',
      'filters[id][$ne]': String(currentProductId),
      populate: 'coverImage,images,category,priceTiers',
      'pagination[pageSize]': '4',
      sort: 'createdAt:desc',
    };

    if (categoryId) {
      query['filters[category][id][$eq]'] = String(categoryId);
    }

    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query,
      revalidate: 120,
      tags: ['products'],
    });

    return data.data || [];
  } catch {
    return [];
  }
}

export async function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const products = await getRelatedProducts(currentProductId, categoryId);

  if (products.length === 0) return null;

  return (
    <section className="border-border mt-12 border-t pt-12">
      <div className="mb-6">
        <h2 className="text-text text-xl font-bold sm:text-2xl">También te puede interesar</h2>
        <p className="text-text-secondary mt-1 text-sm">Productos similares de nuestra colección</p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
