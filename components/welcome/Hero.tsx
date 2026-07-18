"use client";

import Link from "next/link";
import FloatingBadge from "./FloatingBadge";
import BackgroundGlow from "./BackgroundGlow";

export default function Hero() {
  return (
    <section className="relative isolate flex overflow-hidden pt-24 pb-16 min-h-screen sm:pt-32 sm:pb-24 lg:min-h-screen lg:pt-36 lg:pb-28">
      {/* Background */}
      <BackgroundGlow />

      <div
        style={{ justifyContent: "center" }}
        className="relative mx-auto flex max-w-7xl flex-col items-center px-5 sm:px-6"
      >
        {/* Badge */}
        <FloatingBadge />

        {/* Heading */}
        <div className="mt-8 max-w-5xl text-center sm:mt-10">
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl sm:leading-[0.98] md:text-7xl md:leading-[0.95] xl:text-[5.4rem]">
            {/*
              Sur mobile le <br> est masqué : le texte coule librement.
              Sur sm+ il force la coupure comme à l'original.
            */}
            Deploy Smart Contracts
            <br className="hidden sm:block" />
            {" "}Without Complexity on{" "}
            <span className="bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
              Base.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:mt-8 sm:text-lg sm:leading-8 md:text-xl">
            Deploy B20, ERC20, ERC721A, and ERC1155 contracts on Base from one simple platform.
          </p>
        </div>

        {/* Boutons — empilés sur mobile, côte à côte dès sm */}
        <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:mt-12 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#0052FF] px-8 py-4 text-center text-base font-semibold text-white shadow-[0_18px_45px_rgba(0,82,255,.30)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1B67FF]"
          >
            Launch App
          </Link>

          <a
            href="https://docs.base.org/get-started/base"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-blue-100 bg-white/80 px-8 py-4 text-center text-base font-semibold text-slate-800 backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:bg-white"
          >
            Explore Base docs
          </a>
        </div>
      </div>
    </section>
  );
}
