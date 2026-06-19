"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import DashboardLayout from '../../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interface pour typer notre utilisateur
interface UserProfile {
  username: string;
  address: string;
  role: string;
  avatar: string;
}

// Fausse donnée temporelle pour le graphique d'évolution du portefeuille
const portfolioData = [
  { date: '1 Jan', balance: 120 },
  { date: '1 Fév', balance: 450 },
  { date: '1 Mar', balance: 390 },
  { date: '1 Avr', balance: 850 },
  { date: '1 Mai', balance: 720 },
  { date: '1 Juin', balance: 1150 },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('details'); // Gestion des onglets

  // Récupération des données depuis MongoDB
  useEffect(() => {
    const fetchUser = async () => {
      if (address) {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      }
    };
    if (isConnected) fetchUser();
  }, [address, isConnected]);

  return (
    <DashboardLayout title="Mon Profil">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* SECTION 1 & 2 : En-tête (Grille avec Profil à gauche, Graphique à droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CARTE 1 : Informations du Profil */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            {/* Décoration de fond */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600/20 to-cyan-400/20"></div>
            
            {/* L'image de profil */}
            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden mb-4 group cursor-pointer">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 animate-pulse bg-slate-800">...</div>
              )}
              {/* Overlay pour modifier l'image plus tard */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fi fi-rr-camera text-white text-xl"></i>
              </div>
            </div>

            {/* Informations textuelles */}
            <h2 className="text-xl font-bold text-white mb-1">
              {user ? user.username : 'Chargement...'}
            </h2>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <i className="fi fi-brands-ethereum text-indigo-400 text-sm"></i>
              <p className="text-xs font-mono text-slate-400">
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '0x000...0000'}
              </p>
            </div>
            
            <button className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2">
              <i className="fi fi-rr-edit"></i> Éditer le profil
            </button>
          </div>

          {/* CARTE 2 : Graphique d'évolution des actifs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-slate-400 text-sm font-medium">Actifs Totaux</h3>
                <p className="text-2xl font-bold text-white mt-1">$1,150.00 <span className="text-xs text-emerald-400 font-medium ml-2">+15.4%</span></p>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-300">6 derniers mois</span>
              </div>
            </div>
            
            {/* Le Graphique Recharts */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3 : La barre des onglets (Tabs) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'details' 
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <i className="fi fi-rr-apps"></i> Actifs en détail
          </button>
          
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'analysis' 
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <i className="fi fi-rr-chart-pie-alt"></i> Analyse du portefeuille
          </button>
        </div>

        {/* Espace prévu pour le contenu des onglets (Étape 3 prévue plus tard) */}
        <div className="min-h-[300px] border border-dashed border-slate-800 rounded-2xl flex items-center justify-center bg-slate-900/50">
          <p className="text-slate-500 text-sm">
            {activeTab === 'details' ? "Le détail des jetons apparaîtra ici." : "L'analyse graphique des secteurs apparaîtra ici."}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}