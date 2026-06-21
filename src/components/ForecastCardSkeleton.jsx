function ForecastCardSkeleton() {
  return (
    <article
      className="grid gap-4 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18))] p-[18px] shadow-[0_24px_70px_rgba(66,94,138,0.18),inset_0_1px_0_rgba(255,255,255,0.76),0_0_0_1px_rgba(255,255,255,0.36)] backdrop-blur-[24px] saturate-150"
      aria-hidden="true"
    >
      <div className="h-4 w-2/5 animate-pulse rounded-full bg-white/35" />
      <div className="h-3 w-1/4 animate-pulse rounded-full bg-white/35" />
      <div className="h-12 w-1/2 animate-pulse rounded-full bg-white/35" />
      <div className="grid gap-2">
        <div className="h-11 animate-pulse rounded-full bg-white/35" />
        <div className="h-11 animate-pulse rounded-full bg-white/35" />
        <div className="h-11 animate-pulse rounded-full bg-white/35" />
        <div className="h-11 animate-pulse rounded-full bg-white/35" />
      </div>
    </article>
  );
}

export default ForecastCardSkeleton;
