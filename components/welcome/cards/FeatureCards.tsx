import B20Card from "./B20Card";
import ERC20Card from "./ERC20Card";
import NFTCard from "./NFTCard";

export default function FeatureCards() {
  return (
    <section
      id="builders"
      className="relative flex min-h-screen items-center bg-[#F9F9F9] py-16 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-24">
          <span className="inline-flex items-center rounded-full border border-[#0055FF]/20 bg-[#0055FF]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#0055FF] sm:px-5 sm:py-2 sm:text-sm">
            BE ACTIVE ON BASE³
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#111111] sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
            Deploy Token & NFT
            <br />
            Contracts on{" "}
            <span className="text-[#0055FF]">Base</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:mt-8 sm:text-lg sm:leading-8">
            Launch native B20 assets, ERC20 tokens and NFT collections
            through one deployment platform.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <B20Card />
          <ERC20Card />
          <NFTCard />
        </div>
      </div>
    </section>
  );
}
