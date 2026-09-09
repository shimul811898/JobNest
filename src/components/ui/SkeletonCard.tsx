const SkeletonCard = () => {
  return (
    <div className="flex flex-col h-full rounded-2xl glass-card border border-white/10 p-6 animate-pulse select-none shadow-lg">
      {/* Header Info */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/5" />
        <div className="w-16 h-5 rounded-full bg-white/10" />
      </div>

      {/* Title & Company */}
      <div className="mb-6 flex-1 space-y-2.5">
        <div className="h-5 rounded-lg bg-white/15 w-3/4" />
        <div className="h-4 rounded-lg bg-white/10 w-1/2" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="h-3 rounded bg-white/10 w-full" />
        <div className="h-3 rounded bg-white/10 w-5/6" />
      </div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 border-t border-white/10 pt-4 mb-6">
        <div className="h-3 rounded bg-white/10 w-2/3" />
        <div className="h-3 rounded bg-white/10 w-3/4" />
        <div className="h-3 rounded bg-white/10 w-1/2" />
        <div className="h-3 rounded bg-white/10 w-2/3" />
      </div>

      {/* Action CTA */}
      <div className="w-full h-10 rounded-xl bg-white/10 border border-white/5" />
    </div>
  );
};

export default SkeletonCard;
