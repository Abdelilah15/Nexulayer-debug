"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 pt-5">
      <nav
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-blue-100 bg-white/80 shadow-[0_12px_40px_rgba(0,82,255,.08)] backdrop-blur-2xl"
            : "border-white/40 bg-white/60 backdrop-blur-xl"
        }`}
      >
        {/* Left */}

        <div className="flex items-center gap-12 pl-7">
          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#6EA8FF] text-lg font-bold text-white shadow-lg shadow-blue-500/20">
              F
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Forgenix
              </span>

              <span className="text-xs text-slate-500">
                Be active on Base.
              </span>
            </div>
          </Link>

          {/* Navigation */}

          <div className="hidden items-center gap-8 lg:flex">
            <NavLink href="/">Home</NavLink>

            <NavLink href="/contracts">Contracts</NavLink>

            <NavLink href="/b20">B20</NavLink>

            <NavLink href="/portfolio">Portfolio</NavLink>

            <NavLink href="/pricing">Pricing</NavLink>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-3 pr-3">
          <Link
            href="/docs"
            className="hidden rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white lg:block"
          >
            Documentation
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full bg-[#0052FF] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1B67FF] hover:shadow-[0_10px_30px_rgba(0,82,255,.35)]"
          >
            Launch App
          </Link>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-[15px] font-medium text-slate-600 transition hover:text-slate-900 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#0052FF] after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );
}