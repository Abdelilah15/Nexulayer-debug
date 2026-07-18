// components/welcome/cards/ERC20Card.tsx
import { ArrowUpRight } from "lucide-react";
import ERC20Illustration from "./illustrations/ERC20Illustration";

export default function ERC20Card() {
  return (
    <article
      className="
        group
        relative
        flex
        h-auto
        sm:h-[700px]
        flex-col
        overflow-hidden
        rounded-[28px]
        sm:rounded-[32px]
        border
        border-white/10
        bg-[#18181B]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-[#0055FF]/40
        hover:shadow-[0_0_80px_rgba(0,85,255,0.15)]
      "
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-[#0055FF]/20 blur-3xl sm:h-72 sm:w-72" />
      </div>

      {/* Illustration - Adaptée pour le mobile */}
      <div className="relative flex h-[260px] sm:h-[430px] items-center justify-center border-b border-white/5 bg-gradient-to-b from-[#12192e] to-[#18181B]">
        <ERC20Illustration />
      </div>

      {/* Content - Paddings adaptés */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10">
        <div>
          <span className="inline-flex rounded-full border border-[#0055FF]/30 bg-[#0055FF]/10 px-3 py-1 text-[11px] font-medium text-[#4D8BFF] sm:px-4 sm:text-xs">
            EVM Compatible
          </span>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-6 sm:text-3xl">
            ERC20 Token Builder
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:mt-5 sm:text-base sm:leading-8">
            Launch secure ERC20 tokens on Base with fast, simple deployment.
          </p>
        </div>

        <button
          className="
            mt-6
            sm:mt-10
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            bg-[#0055FF]
            px-5
            py-2.5
            sm:px-6
            sm:py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-[#1b67ff]
          "
        >
          Deploy ERC20
          <ArrowUpRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </button>
      </div>
    </article>
  );
}