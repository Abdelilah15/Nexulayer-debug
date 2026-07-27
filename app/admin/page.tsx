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
      // 1. Fetch the secure, server-generated nonce and exact message format
      const nonceRes = await fetch(`/api/auth/nonce?address=${address}`);
      if (!nonceRes.ok) {
        throw new Error('Failed to fetch security nonce.');
      }

      const { message } = await nonceRes.json();

      // 2. Request signature via Wagmi using the exact server message
      const signature = await signMessageAsync({ message });

      // 3. Send address, message, and signature to the unified verification endpoint
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Access denied.');
      }

      // 4. Verify that the backend explicitly confirmed this wallet has Publisher/Admin rights
      if (!data.isAdmin) {
        throw new Error('Access denied. This address is not an authorized administrator.');
      }

      // 5. Success -> Redirect to the dashboard
      router.push('/admin/airdrops');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error during authentication verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Administrator Portal</h1>
          <p className="text-neutral-400 text-sm">
            {!isConnected
              ? "Connect your wallet to continue."
              : "Prove ownership of this wallet by signing a message."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          {!isConnected ? (
            // If disconnected, show RainbowKit ConnectButton for easy UX
            <ConnectButton />
          ) : (
            // If connected, show the signature button
            <button
              onClick={handleSignAndLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'On-chain verification...' : 'Sign to Access Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
