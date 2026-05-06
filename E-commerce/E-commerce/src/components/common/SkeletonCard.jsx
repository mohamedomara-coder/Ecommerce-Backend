const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div className="aspect-square shimmer-bg animate-shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 shimmer-bg animate-shimmer rounded-full" />
      <div className="h-4 w-full shimmer-bg animate-shimmer rounded-full" />
      <div className="h-4 w-3/4 shimmer-bg animate-shimmer rounded-full" />
      <div className="h-3 w-24 shimmer-bg animate-shimmer rounded-full" />
      <div className="h-5 w-20 shimmer-bg animate-shimmer rounded-full" />
    </div>
  </div>
);

export default SkeletonCard;
