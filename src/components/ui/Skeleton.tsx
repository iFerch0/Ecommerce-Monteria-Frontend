function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton-shimmer rounded-md', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="border-border bg-surface flex flex-col overflow-hidden rounded-xl border">
      {/* Image */}
      <Skeleton className="aspect-square w-full" />
      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-auto h-5 w-1/2" />
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return <Skeleton className="h-[420px] w-full sm:h-[520px] lg:h-[580px]" />;
}
