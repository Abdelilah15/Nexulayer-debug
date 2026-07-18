// components/welcome/cards/FeatureCards.tsx
import B20Card from "./B20Card";
import ERC20Card from "./ERC20Card";
import NFTCard from "./NFTCard";

export default function FeatureCards() {
  return (
    <section
      id="builders"
      // Remplacement de h-[100vh] par min-h-screen pour éviter que les cartes empilées ne débordent sur mobile
      // Réduction du padding vertical sur mobile (py-16)
      className="relative flex min-h-screen items-center bg-[#F9F9F9] py-16 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        {/* Réduction de la marge inférieure sur mobile (mb-12 au lieu de mb-24) */}
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-24">
          
          {/* Badge : Mise à jour de la couleur et ajustement de la taille sur mobile */}
          <span className="inline-flex items-center rounded-full border border-[#0055FF]/20 bg-[#0055FF]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#0055FF] sm:px-5 sm:py-2 sm:text-sm">
            BE ACTIVE ON BASE³
          </span>

          {/* Titre principal : Typographie fluide selon la taille de l'écran */}
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#111111] sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
            Deploy Token & NFT
            <br />
            Contracts on{" "}
            <span className="text-[#0055FF]">Base</span>
          </h2>

          {/* Paragraphe : Ajustement du texte et des marges pour mobile */}
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:mt-8 sm:text-lg sm:leading-8">
            Launch native B20 assets, ERC20 tokens and NFT collections
            through one deployment platform.
          </p>
        </div>

        {/* Cards */}
        {/* Le grid-cols-1 est natif sur mobile, les cartes s'empileront. L'espacement est légèrement réduit (gap-6) sur mobile. */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <B20Card />
          <ERC20Card />
          <NFTCard />
        </div>
        
      </div>
    </section>
  );
}