export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-slate-800 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
