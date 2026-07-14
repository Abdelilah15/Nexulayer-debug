"use client";

import Link from "next/link";
import BackgroundGlow from "./BackgroundGlow";

export default function Cards() {
  return (
    <section className="relative overflow-hidden py-32">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6">

        {/* Heading */}

        <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur-xl">
          Smart Contracts
        </span>

        <h2 className="mt-6 text-center text-5xl font-black tracking-[-0.04em] text-slate-900 sm:text-6xl">
          Everything you need.
        </h2>

        <p className="mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
          Deploy production-ready smart contracts on Base with a clean,
          fast and modern experience.
        </p>

        {/* Cards */}

        <div className="mt-20 grid w-full gap-8 lg:grid-cols-3">

          <ServiceCard
            title="B20"
            description="Deploy native B20 assets on Base with a streamlined deployment flow."
          />

          <ServiceCard
            title="ERC20"
            description="Create production-ready ERC20 tokens with advanced configurable features."
          />

          <ServiceCard
            title="NFT"
            description="Launch ERC721A and ERC1155 collections with professional tooling."
          />

        </div>

      </div>
    </section>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Link
      href="/forge"
      className="group rounded-[32px] border border-slate-200 bg-white/80 p-10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_80px_rgba(0,82,255,0.10)]"
    >
      {/* Illustration */}

      <div className="mb-10 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 via-white to-cyan-50">

        <div className="flex items-center gap-3">

          <div className="h-4 w-4 rounded-full bg-[#0052FF]" />

          <div className="h-[2px] w-12 rounded-full bg-blue-300" />

          <div className="h-4 w-4 rounded-full bg-cyan-400" />

        </div>

      </div>

      {/* Content */}

      <h3 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-4 text-base leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0052FF] transition-all group-hover:gap-3">
        Learn more

        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 12h14M13 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}