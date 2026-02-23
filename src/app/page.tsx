import Link from 'next/link';
import { fetchAPI } from '@/lib/strapi';
import { AnimatedProductGrid } from '@/components/product/AnimatedProductGrid';
import { BannerCarousel } from '@/components/ui/BannerCarousel';
import { FadeIn } from '@/components/ui/FadeIn';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { ROUTES, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';
import type { Product, Category } from '@/types/product';
import type { Banner } from '@/types/cms';

async function getBanners(): Promise<Banner[]> {
  try {
    const data = await fetchAPI<{ data: Banner[] }>({
      endpoint: '/banners',
      query: {
        'filters[isActive][$eq]': 'true',
        populate: 'image,imageMobile',
        sort: 'sortOrder:asc',
        'pagination[pageSize]': '10',
        publicationState: 'live',
      },
      revalidate: 60,
      tags: ['banners'],
    });
    return data.data || [];
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await fetchAPI<{ data: Product[] }>({
      endpoint: '/products',
      query: {
        'filters[isFeatured][$eq]': 'true',
        'filters[isActive][$eq]': 'true',
        populate: 'coverImage,images,category,priceTiers',
        'pagination[pageSize]': '8',
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

async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchAPI<{ data: Category[] }>({
      endpoint: '/categories',
      query: {
        'filters[isActive][$eq]': 'true',
        populate: 'image',
        sort: 'sortOrder:asc',
      },
      revalidate: 60,
      tags: ['categories'],
    });
    return data.data || [];
  } catch {
    return [];
  }
}

const categoryEmojis: Record<string, string> = {
  ropa: '👕',
  calzado: '👟',
  accesorios: '👜',
  variados: '📦',
};

export default async function HomePage() {
  const [banners, products, categories] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Dynamic Banners — shown when available, fallback to static hero */}
      {banners.length > 0 ? (
        <BannerCarousel banners={banners} />
      ) : (
        /* Static Hero Fallback */
        <section className="from-primary via-primary-light to-primary relative overflow-hidden bg-gradient-to-br">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
            <div className="max-w-2xl">
              <div className="bg-accent/20 text-accent-light mb-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium">
                🏪 Tienda Mayorista en Montería
              </div>
              <h1 className="mb-4 text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
                Los mejores precios{' '}
                <span className="from-accent-light to-accent bg-gradient-to-r bg-clip-text text-transparent">
                  al por mayor
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-300 sm:text-xl">
                Ropa, calzado y accesorios de calidad con los precios más competitivos de la Costa
                Caribe. Envíos a todo Colombia.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="bg-accent shadow-accent/30 hover:bg-accent-light hover:shadow-accent/40 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Ver catálogo completo →
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Registrarse como mayorista
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {[
                { value: '500+', label: 'Productos' },
                { value: '-25%', label: 'Dto. mayorista' },
                { value: '24/7', label: 'Pedidos online' },
                { value: '🇨🇴', label: 'Envío nacional' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <FadeIn>
            <div className="mb-8 text-center">
              <h2 className="text-text mb-2 text-2xl font-bold sm:text-3xl">
                Explora por categoría
              </h2>
              <p className="text-text-secondary">Encuentra todo lo que necesitas para tu negocio</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.08}>
                <Link
                  href={`${ROUTES.CATEGORIES}/${cat.slug}`}
                  className="group border-border bg-surface hover:border-accent/30 relative flex h-full flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-4xl">{categoryEmojis[cat.slug] || '📂'}</span>
                  <h3 className="text-text group-hover:text-accent text-sm font-semibold">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-text-secondary line-clamp-2 text-xs">{cat.description}</p>
                  )}
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-text mb-1 text-2xl font-bold sm:text-3xl">
                  Productos destacados
                </h2>
                <p className="text-text-secondary">Los más vendidos al por mayor</p>
              </div>
              <Link
                href={ROUTES.PRODUCTS}
                className="text-accent hover:text-accent-light hidden text-sm font-medium transition-colors sm:block"
              >
                Ver todo →
              </Link>
            </div>
          </FadeIn>
          <AnimatedProductGrid products={products} />
          <div className="mt-6 text-center sm:hidden">
            <Link
              href={ROUTES.PRODUCTS}
              className="text-accent hover:text-accent-light text-sm font-medium transition-colors"
            >
              Ver todo el catálogo →
            </Link>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="border-border border-y">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <TrustBadges variant="row" />
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="from-primary to-primary-light rounded-2xl bg-gradient-to-r p-8 text-center text-white sm:p-12">
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl">¿Compras al por mayor?</h2>
            <p className="mx-auto mb-6 max-w-lg text-gray-300">
              Regístrate como mayorista y obtén acceso a precios exclusivos, descuentos por volumen
              y atención personalizada.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={ROUTES.REGISTER}
                className="bg-accent hover:bg-accent-light rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-all"
              >
                Crear cuenta mayorista
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium transition-all hover:bg-white/10"
              >
                💬 Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
