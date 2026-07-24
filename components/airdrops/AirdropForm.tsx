'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Airdrop, AirdropStep } from '@/app/lib/airdrops';
import MarkdownEditor from './MarkdownEditor';

type AirdropFormProps = {
  initialData?: Airdrop; // S'il y a des données, on est en mode "Édition"
};

export default function AirdropForm({ initialData }: AirdropFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // État du projet principal
  const [formData, setFormData] = useState<Partial<Airdrop>>(
    initialData || {
      title: '',
      slug: '',
      logo: '',
      description: '',
      category: 'DeFi',
      status: 'Actif',
      raised_funds: '',
      investors: '',
      moni_score: null,
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      steps: [],
    },
  );

  // Gestion de l'upload d'image pour le logo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setFormData({ ...formData, logo: result.url });
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image");
    }
  };

  // Gestion des étapes (Ajout, Modification, Suppression)
  const addStep = () => {
    const currentSteps = formData.steps || [];
    setFormData({
      ...formData,
      steps: [...currentSteps, { step_order: currentSteps.length + 1, title: '', content: '' }],
    });
  };

  const updateStep = (index: number, field: keyof AirdropStep, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = [...(formData.steps || [])];
    newSteps.splice(index, 1);
    // Réorganiser l'ordre
    newSteps.forEach((step, i) => (step.step_order = i + 1));
    setFormData({ ...formData, steps: newSteps });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/admin/airdrops/${initialData.id}` : '/api/admin/airdrops';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      router.push('/admin/airdrops');
      router.refresh(); // Force le rechargement des données sur le dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}

      {/* SECTION 1 : Informations de base */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-white">Informations Générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Titre du projet *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Slug (URL unique) *</label>
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Logo (URL ou Upload)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none"
              />
              <label className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                Upload
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo preview"
                className="mt-3 w-12 h-12 rounded-full border border-neutral-700 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Catégorie & Statut</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Catégorie (ex: DeFi)"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Statut (ex: Actif)"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none"
              />
            </div>
          </div>

          {/* 🌟 NOUVEAU BLOC À AJOUTER ICI 🌟 */}
          <div className="md:col-span-2 pt-6 border-t border-neutral-800 mt-4">
            <h3 className="text-lg font-medium text-white mb-4">Liens & Réseaux Sociaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Site Web</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Twitter / X</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Discord</label>
                <input
                  type="url"
                  placeholder="https://discord.gg/..."
                  value={formData.discord || ''}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Telegram</label>
                <input
                  type="url"
                  placeholder="https://t.me/..."
                  value={formData.telegram || ''}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : Étapes (Guides Markdown) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Guide pas-à-pas</h2>
          <button
            type="button"
            onClick={addStep}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Ajouter une étape
          </button>
        </div>

        <div className="space-y-6">
          {formData.steps?.map((step, index) => (
            <div key={index} className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg relative">
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Supprimer
                </button>
              </div>
              <h3 className="text-white font-medium mb-4">Étape {step.step_order}</h3>

              <input
                type="text"
                placeholder="Titre de l'étape"
                value={step.title}
                onChange={(e) => updateStep(index, 'title', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white outline-none mb-4"
                required
              />

              {/* APRÈS : */}
              <MarkdownEditor value={step.content} onChange={(newValue) => updateStep(index, 'content', newValue)} />
            </div>
          ))}
          {formData.steps?.length === 0 && (
            <p className="text-neutral-500 text-center py-4">Aucune étape ajoutée pour le moment.</p>
          )}
        </div>
      </div>

      {/* BOUTON DE SOUMISSION */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-neutral-700 rounded-lg text-white hover:bg-neutral-800 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : "Créer l'airdrop"}
        </button>
      </div>
    </form>
  );
}
