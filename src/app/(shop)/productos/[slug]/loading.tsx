export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-text-muted">/</span>}
            <div className="skeleton-shimmer h-4 rounded" style={{ width: `${48 + i * 16}px` }} />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div>
          <div className="skeleton-shimmer mb-3 aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-20 w-20 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="skeleton-shimmer h-4 w-24 rounded" />
          <div className="skeleton-shimmer h-8 w-3/4 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-1/2 rounded" />

          <div className="border-border rounded-xl border p-4">
            <div className="skeleton-shimmer mb-2 h-8 w-40 rounded" />
            <div className="skeleton-shimmer h-4 w-56 rounded" />
          </div>

          <div className="skeleton-shimmer h-32 w-full rounded-xl" />
          <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
