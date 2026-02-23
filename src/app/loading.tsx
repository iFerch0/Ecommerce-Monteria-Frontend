import { BannerSkeleton, ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <>
      {/* Banner skeleton */}
      <BannerSkeleton />

      {/* Categories skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="skeleton-shimmer h-8 w-56 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-72 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-border flex flex-col items-center gap-3 rounded-2xl border p-6"
            >
              <div className="skeleton-shimmer h-10 w-10 rounded-full" />
              <div className="skeleton-shimmer h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured products skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <div className="skeleton-shimmer mb-2 h-8 w-52 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-40 rounded" />
        </div>
        <ProductGridSkeleton count={8} />
      </section>
    </>
  );
}
