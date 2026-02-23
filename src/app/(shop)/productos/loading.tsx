import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="skeleton-shimmer mb-2 h-8 w-64 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-48 rounded" />
      </div>

      {/* Filter bar skeleton */}
      <div className="border-border bg-surface-alt mb-6 flex flex-wrap items-center gap-3 rounded-xl border p-3">
        <div className="skeleton-shimmer h-6 w-16 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Results info skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="skeleton-shimmer h-4 w-32 rounded" />
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
      </div>

      <ProductGridSkeleton count={12} />
    </div>
  );
}
