'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function AdminLogin() {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignAndLogin = async () => {
    if (!isConnected || !address) return;
    setIsLoading(true);
    setError('');

    try {
      // 1. Préparation du message
      const message = `Connexion Admin Nexulayer - ${Date.now()}`;

      // 2. Demande de signature via Wagmi
      const signature = await signMessageAsync({ message });

      // 3. Envoi au backend
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Accès refusé.');
      }

      // 4. Succès -> Redirection
      router.push('/admin/airdrops');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de la vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Portail Administrateur</h1>
          <p className="text-neutral-400 text-sm">
            {!isConnected
              ? "Connectez votre portefeuille pour continuer."
              : "Prouvez que vous possédez ce portefeuille en signant un message."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          {!isConnected ? (
            // Si non connecté, on affiche le bouton RainbowKit ici aussi pour faciliter l'UX
            <ConnectButton />
          ) : (
            // Si connecté, on affiche le bouton de signature
            <button
              onClick={handleSignAndLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Vérification on-chain...' : 'Signer pour accéder au Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
