"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nexulayer, { NexulayerLogo } from "@/components/ui/NexulayerLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-5 sm:pt-5">
        <nav
          className={`mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between rounded-full border transition-all duration-300 ${scrolled || menuOpen
            ? "border-blue-100 bg-white/90 shadow-[0_12px_40px_rgba(0,82,255,.08)] backdrop-blur-2xl"
            : "border-[#E2E8F0] bg-white/60 backdrop-blur-xl"
            }`}
        >
          {/* Left : Logo + Nav desktop */}
          <div className="flex items-center gap-8 pl-4 sm:pl-5 lg:gap-12 lg:pl-7">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={() => setMenuOpen(false)}
            >
              <NexulayerLogo className="text-[#0052FF]" size={32} />
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  NZXULAYER
                </span>
                {/* Tagline masquée sur très petits écrans */}
                <span className="hidden text-xs text-slate-500 sm:block">
                  Be active on Base.
                </span>
              </div>
            </Link>

            {/* Navigation desktop uniquement */}
            <div className="hidden items-center gap-8 lg:flex">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/contracts" disabled>Contracts</NavLink>
              <NavLink href="/deploy/b20">B20</NavLink>
              <NavLink href="/portfolio" disabled>Portfolio</NavLink>
              <NavLink href="/pricing" disabled>Pricing</NavLink>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 pr-3 sm:gap-3">
            <span
              className="hidden cursor-not-allowed rounded-full px-5 py-2 text-sm font-medium text-slate-400 opacity-60 lg:block"
              title="Bientôt disponible"
            >
              Documentation
            </span>

            {/* Launch App — desktop seulement */}
            <Link
              href="/dashboard"
              className="hidden rounded-full bg-[#0052FF] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1B67FF] hover:shadow-[0_10px_30px_rgba(0,82,255,.35)] lg:block"
            >
              Launch App
            </Link>

            {/* Hamburger — mobile seulement */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* ───────────── Mobile Menu ───────────── */}
      <>
        {/* Overlay */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-md transition-all duration-300 lg:hidden ${menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
            }`}
        />

        {/* Overlay */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-sm transition-all duration-300 lg:hidden ${menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
            }`}
        />

        {/* Mobile Menu */}
        <div
          className={`fixed inset-x-4 top-20 bottom-6 z-50 overflow-hidden rounded-3xl bg-white/98 transition-all duration-300 ease-out lg:hidden ${menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex h-full flex-col px-6 py-6">

            <nav className="flex flex-col divide-y divide-slate-100">
              <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>
                Home
              </MobileNavLink>

              <MobileNavLink href="/contracts" disabled>
                Contracts
              </MobileNavLink>

              <MobileNavLink href="/deploy/b20" onClick={() => setMenuOpen(false)}>
                B20
              </MobileNavLink>

              <MobileNavLink href="/portfolio" disabled>
                Portfolio
              </MobileNavLink>

              <MobileNavLink href="/pricing" disabled>
                Pricing
              </MobileNavLink>

              <MobileNavLink href="#" disabled>
                Documentation
              </MobileNavLink>
            </nav>

            <div className="mt-auto pt-8">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex h-14 items-center justify-center rounded-full bg-[#0052FF] text-base font-semibold text-white transition-colors duration-300 hover:bg-[#1B67FF]"
              >
                Launch App
              </Link>
            </div>

          </div>
        </div>
      </>
    </>
  );
}

/* ── Desktop NavLink (inchangé) ── */
function NavLink({
  href,
  children,
  disabled = false,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className="relative cursor-not-allowed text-[15px] font-medium text-slate-400 opacity-60"
        title="Bientôt disponible"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="relative text-[15px] font-medium text-slate-600 transition hover:text-slate-900 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#0052FF] after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );
}

/* ── Mobile NavLink ── */
function MobileNavLink({
  href,
  children,
  disabled = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  if (disabled) {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <span className="text-[17px] font-medium text-slate-400">{children}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
          Bientôt
        </span>
      </div>
    );
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-2 py-4 text-[17px] font-medium text-slate-800 transition-colors hover:text-[#0052FF]"
    >
      {children}
    </Link>
  );
}
