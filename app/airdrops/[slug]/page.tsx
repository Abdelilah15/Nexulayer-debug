import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getAirdropBySlug } from '@/app/lib/airdrops';

// Force la régénération de la page toutes les 60 secondes si les données changent
export const revalidate = 60;

export default async function AirdropDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. On "déballe" les paramètres asynchrones avec await
  const { slug } = await params;

  // 2. On utilise le slug récupéré
  const airdrop = await getAirdropBySlug(slug);

  // Si le slug n'existe pas dans la base de données, on renvoie une page 404
  if (!airdrop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Bouton Retour */}
        <Link
          href="/airdrops"
          className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          ← Retour aux airdrops
        </Link>

        {/* EN-TÊTE DU PROJET */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
          {/* Effet de lueur en arrière-plan (esthétique) */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-[0.02] blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              {airdrop.logo ? (
                <img src={airdrop.logo} alt={airdrop.title} className="w-20 h-20 rounded-2xl object-cover border border-neutral-700 shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl font-bold border border-neutral-700 shadow-md">
                  {airdrop.title.charAt(0)}
                </div>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{airdrop.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {airdrop.category || 'DeFi'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {airdrop.status || 'Actif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistiques Rapides */}
            <div className="flex sm:flex-col gap-6 sm:gap-2 sm:text-right bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Moni Score</p>
                <p className="font-bold text-lg text-white">{airdrop.moni_score ? `${airdrop.moni_score}/100` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Fonds levés</p>
                <p className="font-bold text-lg text-white">{airdrop.raised_funds || 'N/A'}</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-neutral-300 text-lg leading-relaxed">
            {airdrop.description}
          </p>

          {/* Liens (Réseaux Sociaux & Web) */}
          <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap gap-4">
            {airdrop.website && (
              <a href={airdrop.website} target="_blank" rel="noreferrer" className="text-sm font-medium px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                🌐 Site Web
              </a>
            )}
            {airdrop.twitter && (
              <a href={airdrop.twitter} target="_blank" rel="noreferrer" className="text-sm font-medium px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-blue-400 rounded-lg transition-colors">
                𝕏 Twitter
              </a>
            )}
            {airdrop.discord && (
              <a href={airdrop.discord} target="_blank" rel="noreferrer" className="text-sm font-medium px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-indigo-400 rounded-lg transition-colors">
                👾 Discord
              </a>
            )}
            {airdrop.telegram && (
              <a href={airdrop.telegram} target="_blank" rel="noreferrer" className="text-sm font-medium px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sky-400 rounded-lg transition-colors">
                ✈️ Telegram
              </a>
            )}
          </div>
        </div>

        {/* GUIDE PAS À PAS */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-sm font-black">
              ✓
            </span>
            Guide de participation
          </h2>

          <div className="space-y-6">
            {airdrop.steps && airdrop.steps.length > 0 ? (
              airdrop.steps.map((step) => (
                <div key={step.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-lg relative overflow-hidden">

                  {/* Numéro de l'étape en filigrane discret */}
                  <div className="absolute -top-4 -right-4 text-9xl font-black text-neutral-800/20 pointer-events-none select-none">
                    {step.step_order}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">
                      <span className="text-neutral-500 mr-2">{step.step_order}.</span> {step.title}
                    </h3>

                    {/*
                      La classe 'prose' de Tailwind Typography va formater automatiquement le Markdown :
                      prose-invert : Adapte les couleurs pour le mode sombre
                      prose-a:text-blue-400 : Force les liens en bleu clair
                      prose-img:rounded-xl : Arrondit les bords des images uploadées
                    */}
                    <div className="prose prose-invert prose-neutral max-w-none prose-a:text-white prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-neutral-300 prose-img:rounded-xl prose-img:border prose-img:border-neutral-800">
                      <ReactMarkdown>{step.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-500">
                Les étapes du guide seront publiées prochainement.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
