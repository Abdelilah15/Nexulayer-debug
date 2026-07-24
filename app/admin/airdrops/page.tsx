import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminSession } from '@/app/lib/auth';
import { getPublicAirdrops } from '@/app/lib/airdrops';
import DeleteButton from '@/components/airdrops/DeleteButton';

// Empêche Next.js de mettre cette page en cache (on veut toujours des données fraîches)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Vérification stricte de la session admin côté serveur
  const cookieStore = await cookies();
  const token = cookieStore.get('nexulayer_admin_session')?.value;

  if (!token) {
    redirect('/admin');
  }

  const payload = await verifyAdminSession(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin');
  }

  // 2. Récupération des données depuis Supabase
  const airdrops = await getPublicAirdrops();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* En-tête du Dashboard */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nexulayer Dashboard</h1>
            <p className="text-neutral-400">Gérez vos campagnes d'airdrops publiées.</p>
          </div>
          <Link
            href="/admin/airdrops/new"
            className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
          >
            + Nouvel Airdrop
          </Link>
        </div>

        {/* Tableau des Airdrops */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
          {airdrops && airdrops.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="p-4 font-medium">Projet</th>
                  <th className="p-4 font-medium">Catégorie</th>
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">Moni Score</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {airdrops.map((airdrop) => (
                  <tr key={airdrop.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {airdrop.logo ? (
                          <img src={airdrop.logo} alt={airdrop.title} className="w-8 h-8 rounded-full bg-neutral-800 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">?</div>
                        )}
                        <span className="font-semibold">{airdrop.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-300">{airdrop.category || '-'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {airdrop.status || 'Actif'}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">{airdrop.moni_score || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/airdrops/${airdrop.id}`}
                          className="text-neutral-400 hover:text-white font-medium text-sm transition-colors"
                        >
                          Éditer
                        </Link>
                        <DeleteButton id={airdrop.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-neutral-500">
              <p>Aucun airdrop trouvé. Créez votre première campagne.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
