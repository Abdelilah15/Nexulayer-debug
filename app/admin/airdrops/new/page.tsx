import AirdropForm from '@/components/airdrops/AirdropForm';

export default function NewAirdropPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un nouvel Airdrop</h1>
          <p className="text-neutral-400">Remplissez les informations et créez le guide pas-à-pas.</p>
        </div>

        {/* On intègre notre formulaire sans lui passer de données = Mode Création */}
        <AirdropForm />
      </div>
    </div>
  );
}
