"use client";

export default function FloatingBadge() {
  return (
    <div className="group relative inline-flex animate-[fadeInUp_.8s_ease-out] items-center">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-[#0052FF]/15 blur-xl transition-all duration-500 group-hover:bg-[#0052FF]/25" />

      {/* Badge — légèrement plus compact sur mobile */}
      <div className="relative flex items-center gap-2.5 rounded-full border border-blue-100 bg-white/80 px-4 py-2 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 sm:gap-3 sm:px-5 sm:py-2.5">

        {/* Animated dot */}
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-40" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0052FF] sm:h-3 sm:w-3" />
        </span>

        <span className="text-xs font-medium tracking-wide text-slate-700 sm:text-sm">
          Built for the Base Ecosystem
        </span>
      </div>
    </div>
  );
}