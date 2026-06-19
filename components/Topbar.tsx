import React, { useState, useRef, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect, useAccount } from 'wagmi'; // Ajout de useAccount
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title?: string;
}

// Interface (Type) pour notre profil utilisateur
interface UserProfile {
  username: string;
  role: string;
  address: string;
  avatar?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount(); // 1. Détecte l'adresse connectée
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. État pour stocker les informations venant de notre base de données
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // Au premier affichage, on lit le cache pour éviter le clignotement
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('forgenix_profile');
      if (cached) return JSON.parse(cached);
    }
    return null;
  });

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // 3. SYNCHRONISATION AVEC LA BASE DE DONNÉES
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // NOUVEAU : On sépare la fonction de chargement pour pouvoir l'appeler à la demande
  const fetchUser = async () => {
    if (isConnected && address) {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: address })
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          // NOUVEAU : On enregistre les données dans la mémoire du navigateur
          localStorage.setItem('forgenix_profile', JSON.stringify(data)); 
        }
      } catch (error) {
        console.error("Erreur de synchronisation du profil", error);
      }
    } else {
      setUserProfile(null);
      localStorage.removeItem('forgenix_profile'); // NOUVEAU : On vide la mémoire si déconnecté
    }
  };

  // Chargement normal au lancement
  useEffect(() => {
    fetchUser();
  }, [isConnected, address]);

  // NOUVEAU : Le système d'écoute ! Dès qu'il entend 'profileUpdated', il recharge les données.
  useEffect(() => {
    window.addEventListener('profileUpdated', fetchUser);
    return () => {
      window.removeEventListener('profileUpdated', fetchUser);
    };
  }, [isConnected, address]);

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950/80 px-8 flex justify-between items-center z-10 flex-shrink-0">
      <h2 className="text-lg font-semibold text-slate-300">
        {title || "Forgenix"}
      </h2>

      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div {...(!ready && { 'aria-hidden': true, 'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} type="button" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
                      <i className="fi fi-rr-wallet"></i> Connecter le Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button" className="bg-red-500/10 border border-red-500 text-red-400 hover:bg-red-500/20 font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-2">
                      <i className="fi fi-rr-triangle-warning"></i> Mauvais Réseau
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        type="button"
                        className={`flex items-center gap-3 border transition-all py-1.5 pl-4 pr-1.5 rounded-full text-slate-200 ${isDropdownOpen ? 'bg-slate-800 border-slate-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                      >
                        <span className="font-medium text-sm tracking-wide">
                          {userProfile?.username || account.displayName}
                        </span>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 border-2 border-slate-950 flex items-center justify-center overflow-hidden shadow-inner">
                          {/* NOUVEAU : Affichage de l'avatar de la base de données ! */}
                          {userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : account.ensAvatar ? (
                            <img src={account.ensAvatar} alt="ENS Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <i className="fi fi-rr-user text-white text-xs mt-1"></i>
                          )}
                        </div>
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-slate-800/80 mb-2 bg-slate-900/50">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs text-slate-500 uppercase tracking-wider">Mon Profil</p>
                              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                {userProfile ? userProfile.role : '...'}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-white truncate mb-0.5">
                              {userProfile ? userProfile.username : 'Chargement...'}
                            </p>
                            <p className="text-xs font-mono text-slate-500 truncate" title={account.address}>
                              {account.address}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              router.push('/Profile');
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3"
                          >
                            <i className="fi fi-rr-user text-slate-400"></i> My profile
                          </button>
                          <button className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                            <i className="fi fi-rr-settings text-slate-400"></i> Settings
                          </button>

                          <div className="h-px bg-slate-800/80 my-2"></div>

                          <button
                            onClick={() => {
                              disconnect();
                              localStorage.removeItem('forgenix_profile');
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                          >
                            <i className="fi fi-rr-exit"></i> Disconnect
                          </button>
                        </div>
                      )}
                    </div>

                    <button onClick={openChainModal} type="button" className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 py-2 px-4 rounded-xl transition-all text-slate-200 font-medium text-sm">
                      {chain.hasIcon && (
                        <div style={{ background: chain.iconBackground, width: 20, height: 20, borderRadius: 999, overflow: 'hidden' }}>
                          {chain.iconUrl && (<img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 20, height: 20 }} />)}
                        </div>
                      )}
                      <span>{chain.name}</span>
                      <i className="fi fi-rr-angle-small-down text-slate-400 mt-1"></i>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </header>
  );
}