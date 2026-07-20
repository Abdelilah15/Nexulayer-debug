import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useEthBalance(address: string | undefined) {
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (!address || !window.ethereum) return;

    const getBalance = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(address);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      } catch (error) {
        console.error("Erreur récupération solde:", error);
      }
    };

    getBalance();

    window.ethereum.on('accountsChanged', getBalance);
    window.ethereum.on('chainChanged', getBalance);

    return () => {
      window.ethereum.removeListener('accountsChanged', getBalance);
      window.ethereum.removeListener('chainChanged', getBalance);
    };
  }, [address]);

  return balance;
}
