"use client";

export default function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7faff_35%,#eef5ff_70%,#e7f0ff_100%)]" />

      {/* Large center glow */}
      <div className="absolute left-1/2 top-[-180px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#0052FF]/10 blur-[160px]" />

      {/* Left glow */}
      <div className="absolute left-[-180px] top-[30%] h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-[140px]" />

      {/* Right glow */}
      <div className="absolute right-[-140px] top-[15%] h-[500px] w-[500px] rounded-full bg-blue-400/15 blur-[150px]" />

      {/* Bottom glow */}
      <div className="absolute bottom-[-220px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[#0052FF]/8 blur-[180px]" />

      {/* Small accent glow */}
      <div className="absolute right-[18%] top-[55%] h-52 w-52 rounded-full bg-sky-300/20 blur-[90px]" />

      {/* Very subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(255,255,255,.55)_100%)]" />
    </div>
  );
}