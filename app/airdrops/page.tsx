import Link from 'next/link';
import { getPublicAirdrops } from '@/app/lib/airdrops';

// Met en cache la page et la rafraîchit toutes les 60 secondes en arrière-plan
// Idéal pour les performances sans sacrifier la fraîcheur des données
export const revalidate = 60;

export default async function AirdropsListPage() {
  const airdrops = await getPublicAirdrops();

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Airdrops <span className="text-neutral-500">Nexulayer</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Découvrez, suivez et participez aux meilleurs airdrops de l'écosystème.
            Des guides pas-à-pas pour maximiser vos chances d'éligibilité.
          </p>
        </div>

        {/* Grille des projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airdrops.map((airdrop) => (
            <Link key={airdrop.id} href={`/airdrops/${airdrop.slug}`} className="group block">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/50 h-full flex flex-col shadow-lg hover:shadow-xl">

                {/* Haut de la carte : Logo, Titre, Statut */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {airdrop.logo ? (
                      <img
                        src={airdrop.logo}
                        alt={airdrop.title}
                        className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-bold border border-neutral-700">
                        {airdrop.title.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-white text-neutral-200 transition-colors">
                        {airdrop.title}
                      </h2>
                      <span className="text-sm text-neutral-400">{airdrop.category || 'Non catégorisé'}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {airdrop.status || 'Actif'}
                  </span>
                </div>

                {/* Bas de la carte : Statistiques */}
                <div className="mt-auto pt-6 grid grid-cols-2 gap-4 border-t border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Fonds levés</p>
                    <p className="font-semibold text-neutral-200">{airdrop.raised_funds || 'Non divulgué'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Moni Score</p>
                    <p className="font-semibold text-neutral-200">
                      {airdrop.moni_score ? `${airdrop.moni_score}/100` : 'N/A'}
                    </p>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* État vide si aucun airdrop n'existe */}
        {airdrops.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            Aucun airdrop n'est disponible pour le moment. Revenez plus tard !
          </div>
        )}

      </div>
    </div>
  );
}
