import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';
import AirdropForm from '@/components/airdrops/AirdropForm';
import { AirdropStep } from '@/app/lib/airdrops';

// Force le rendu dynamique pour avoir les données les plus récentes
export const dynamic = 'force-dynamic';

export default async function EditAirdropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // N'oublie pas de remplacer params.id par id dans la requête Supabase juste en dessous :
  // .eq('id', id)
  // 1. Vérification de la sécurité (Cookie Admin)
  const cookieStore = await cookies();
  const token = cookieStore.get('nexulayer_admin_session')?.value;

  if (!token) {
    redirect('/admin');
  }

  const payload = await verifyAdminSession(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin');
  }

  // 2. Récupération des données du projet et de ses étapes
  // (On utilise select('*, steps:airdrop_steps(*)') car nos étapes sont dans une table séparée)
  const { data: airdrop, error } = await supabase
    .from('airdrops')
    .select(`
      *,
      steps:airdrop_steps(*)
    `)
    .eq('id', id)
    .single();

  if (error || !airdrop) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Erreur 404</h1>
          <p className="text-neutral-400">Cet airdrop n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  // 3. Tri des étapes par ordre pour s'assurer d'un bon affichage
  if (airdrop.steps && Array.isArray(airdrop.steps)) {
    airdrop.steps.sort((a: AirdropStep, b: AirdropStep) => a.step_order - b.step_order);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Modifier l'Airdrop</h1>
          <p className="text-neutral-400">
            Vous modifiez actuellement le projet <span className="text-white font-semibold">{airdrop.title}</span>.
          </p>
        </div>

        {/* On passe les données récupérées au formulaire, qui passera en mode "Édition" (PUT) */}
        <AirdropForm initialData={airdrop} />
      </div>
    </div>
  );
}
