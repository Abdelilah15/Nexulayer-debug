"use client";

export default function FloatingBadge() {
  return (
    <div className="group relative inline-flex animate-[fadeInUp_.8s_ease-out] items-center">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-[#0052FF]/15 blur-xl transition-all duration-500 group-hover:bg-[#0052FF]/25" />

      {/* Badge */}
      <div className="relative flex items-center gap-3 rounded-full border border-blue-100 bg-white/80 px-5 py-2.5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200">

        {/* Animated dot */}
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-40" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#0052FF]" />
        </span>

        <span className="text-sm font-medium tracking-wide text-slate-700">
          Built for the Base Ecosystem
        </span>
      </div>
    </div>
  );
}