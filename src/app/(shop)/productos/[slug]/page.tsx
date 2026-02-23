import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAPI } from '@/lib/strapi';
import { formatPrice, getImageUrl } from '@/lib/utils';
import type { Product } from '@/types/product';
import { SITE_NAME, SITE_URL, ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ReviewList } from '@/components/review/ReviewList';
import { ReviewForm } from '@/components/review/ReviewForm';
import { productSchema, breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[slug][$eq]': slug,
        populate: 'coverImage,images,category,priceTiers',
      },
      revalidate: 60,
      tags: ['products'],
    });
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

// Pre-generate the most recently updated products at build time
export async function generateStaticParams() {
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[isActive][$eq]': 'true',
        'pagination[pageSize]': '100',
        sort: 'updatedAt:desc',
      },
    });
    return (data.data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const canonical = `${SITE_URL}${ROUTES.PRODUCTS}/${slug}`;
  const imageUrl = product.coverImage ? getImageUrl(product.coverImage.url) : undefined;
  const description =
    product.shortDescription ||
    `Compra ${product.name} al por mayor en ${SITE_NAME}. Precio desde ${product.basePrice} COP. Mínimo ${product.minWholesaleQty} unidades. Envíos a todo Colombia.`;

  const keywords = [
    product.name,
    product.name + ' al por mayor',
    product.category?.name || '',
    product.brand || '',
    'mayorista Colombia',
    'Montería',
    SITE_NAME,
  ].filter(Boolean);

  return {
    title: `${product.name} — Al por Mayor`,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      type: 'website',
      url: canonical,
      locale: 'es_CO',
      siteName: SITE_NAME,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: product.name,
              width: 800,
              height: 800,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const allImages = [
    ...(product.coverImage ? [product.coverImage] : []),
    ...(product.images || []),
  ].filter((img, index, self) => self.findIndex((i) => i.id === img.id) === index);

  const sortedTiers = [...(product.priceTiers || [])].sort((a, b) => a.minQuantity - b.minQuantity);

  // Breadcrumb items for schema
  const breadcrumbItems = [
    { name: 'Inicio', url: SITE_URL },
    { name: 'Productos', url: `${SITE_URL}${ROUTES.PRODUCTS}` },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `${SITE_URL}${ROUTES.CATEGORIES}/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, url: `${SITE_URL}${ROUTES.PRODUCTS}/${slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Structured data */}
      <JsonLd schema={productSchema(product)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />

      {/* Breadcrumb */}
      <nav className="text-text-secondary mb-6 flex items-center gap-2 text-sm">
        <Link href={ROUTES.HOME} className="hover:text-accent transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href={ROUTES.PRODUCTS} className="hover:text-accent transition-colors">
          Productos
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`${ROUTES.CATEGORIES}/${product.category.slug}`}
              className="hover:text-accent transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          {/* Main image */}
          <div className="border-border bg-surface-alt relative mb-3 aspect-square overflow-hidden rounded-2xl border">
            {allImages.length > 0 ? (
              <Image
                src={getImageUrl(allImages[0].url)}
                alt={allImages[0].alternativeText || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="text-text-muted flex h-full w-full items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    i === 0 ? 'border-accent' : 'border-border hover:border-accent/50'
                  }`}
                >
                  <Image
                    src={getImageUrl(img.url)}
                    alt={img.alternativeText || `${product.name} - ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          {product.category && (
            <Link
              href={`${ROUTES.CATEGORIES}/${product.category.slug}`}
              className="text-accent mb-2 inline-block text-xs font-semibold tracking-wider uppercase"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-text mb-2 text-2xl font-bold sm:text-3xl">{product.name}</h1>

          {/* SKU + Brand */}
          <div className="text-text-secondary mb-4 flex flex-wrap items-center gap-3 text-sm">
            {product.sku && <span>SKU: {product.sku}</span>}
            {product.brand && (
              <>
                <span>•</span>
                <span>Marca: {product.brand}</span>
              </>
            )}
            {product.material && (
              <>
                <span>•</span>
                <span>Material: {product.material}</span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="border-border bg-surface-alt mb-6 rounded-xl border p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-accent text-3xl font-bold">
                {formatPrice(product.basePrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                <span className="text-text-muted text-lg line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-accent rounded-full px-2 py-0.5 text-xs font-bold text-white">
                  -{discount}%
                </span>
              )}
            </div>
            <p className="text-text-secondary mt-1 text-sm">
              Precio por unidad · Mínimo {product.minWholesaleQty} unidades
            </p>
          </div>

          {/* Price Tiers Table */}
          {sortedTiers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-text mb-3 text-sm font-semibold">💰 Precios por volumen</h3>
              <div className="border-border overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-alt">
                      <th className="text-text-secondary px-4 py-2.5 text-left font-semibold">
                        Cantidad
                      </th>
                      <th className="text-text-secondary px-4 py-2.5 text-right font-semibold">
                        Precio/ud
                      </th>
                      <th className="text-text-secondary px-4 py-2.5 text-right font-semibold">
                        Ahorro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {sortedTiers.map((tier) => {
                      const savings =
                        product.basePrice > 0
                          ? Math.round(
                              ((product.basePrice - tier.pricePerUnit) / product.basePrice) * 100
                            )
                          : 0;
                      return (
                        <tr key={tier.id} className="hover:bg-surface-alt/50 transition-colors">
                          <td className="text-text px-4 py-2.5">
                            {tier.minQuantity}
                            {tier.maxQuantity ? ` – ${tier.maxQuantity}` : '+'} uds.
                            {tier.label && (
                              <span className="text-text-muted ml-2 text-xs">({tier.label})</span>
                            )}
                          </td>
                          <td className="text-text px-4 py-2.5 text-right font-semibold">
                            {formatPrice(tier.pricePerUnit)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {savings > 0 ? (
                              <span className="text-success font-medium">-{savings}%</span>
                            ) : (
                              <span className="text-text-muted">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Sizes */}
          {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-text mb-2 text-sm font-semibold">Tallas disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <span
                    key={size}
                    className="border-border text-text-secondary hover:border-accent hover:text-accent rounded-lg border px-3 py-1.5 text-sm transition-colors"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-text mb-2 text-sm font-semibold">Colores disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <span
                    key={color}
                    className="border-border text-text-secondary hover:border-accent hover:text-accent rounded-full border px-3 py-1 text-xs transition-colors"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="border-border mt-6 border-t pt-6">
              <h3 className="text-text mb-3 text-sm font-semibold">Descripción</h3>
              <div
                className="prose prose-sm text-text-secondary max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-border mt-12 border-t pt-10">
        <ReviewList productDocumentId={product.documentId} />
        <ReviewForm productDocumentId={product.documentId} />
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} categoryId={product.category?.id ?? null} />
    </div>
  );
}
