export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[3/4] skeleton" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton w-3/4" />
        <div className="h-4 skeleton w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 skeleton w-16" />
          <div className="h-4 skeleton w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonSubjectCard() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 skeleton w-24" />
          <div className="h-4 skeleton w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="stats-pill">
          <div className="w-4 h-4 skeleton rounded-full" />
          <div className="h-4 skeleton w-16" />
        </div>
      ))}
    </div>
  );
}
