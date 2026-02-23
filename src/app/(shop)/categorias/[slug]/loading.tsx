import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <div className="skeleton-shimmer h-4 w-12 rounded" />
        <span className="text-text-muted">/</span>
        <div className="skeleton-shimmer h-4 w-20 rounded" />
        <span className="text-text-muted">/</span>
        <div className="skeleton-shimmer h-4 w-28 rounded" />
      </div>

      {/* Category header */}
      <div className="mb-8">
        <div className="skeleton-shimmer mb-2 h-8 w-56 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-40 rounded" />
      </div>

      <ProductGridSkeleton count={12} />
    </div>
  );
}
