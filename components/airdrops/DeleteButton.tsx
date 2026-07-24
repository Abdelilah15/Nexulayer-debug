'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Es-tu sûr de vouloir supprimer cet airdrop ? Cette action est irréversible.");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/airdrops/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Rafraîchit la page côté serveur pour mettre à jour la liste
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Impossible de supprimer cet airdrop.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 font-medium text-sm disabled:opacity-50 transition-colors"
    >
      {isDeleting ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}
