import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const imageUrl = product.coverImage?.url || product.images?.[0]?.url;

  return (
    <Link
      href={`${ROUTES.PRODUCTS}/${product.slug}`}
      className="group border-border bg-surface relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="bg-surface-alt relative aspect-square overflow-hidden">
        {imageUrl ? (
          <img
            src={getImageUrl(imageUrl)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-text-muted flex h-full w-full items-center justify-center text-4xl">
            📦
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-accent rounded-full px-2 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-wholesale-badge rounded-full px-2 py-0.5 text-[11px] font-bold text-white">
              ⭐ Destacado
            </span>
          )}
        </div>

        {/* Wholesale badge */}
        <div className="absolute right-2 bottom-2">
          <span className="bg-primary/80 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            Min. {product.minWholesaleQty} uds.
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category */}
        {product.category && (
          <span className="text-text-muted mb-1 text-[11px] font-medium tracking-wider uppercase">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-text group-hover:text-accent mb-1 line-clamp-2 text-sm font-semibold transition-colors">
          {product.name}
        </h3>

        {/* Short description */}
        {product.shortDescription && (
          <p className="text-text-secondary mb-2 line-clamp-1 text-xs">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-accent text-lg font-bold">{formatPrice(product.basePrice)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <span className="text-text-muted text-xs line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <span className="text-text-secondary mt-0.5 text-[11px]">precio por unidad</span>
      </div>
    </Link>
  );
}
