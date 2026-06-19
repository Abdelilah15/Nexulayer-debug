"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import DashboardLayout from '../../../components/DashboardLayout';
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

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  // FONCTION : Activer le mode édition
  const handleEditClick = () => {
    if (user) {
      setEditUsername(user.username);
      setEditAvatar(user.avatar);
      setIsEditing(true);
    }
  };


  // FONCTION : Générer un nouvel avatar aléatoire (Seed aléatoire)
  const handleShuffleAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7); // Génère un mot au hasard
    setEditAvatar(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${randomSeed}`);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FONCTION : Gérer l'upload d'image depuis le PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite à 2 Mo pour ne pas surcharger MongoDB
        alert("L'image est trop lourde (Max 2 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string); // Transforme l'image en base64 et met à jour l'état
      };
      reader.readAsDataURL(file);
    }
  };



  // FONCTION : Sauvegarder dans MongoDB
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: address,
          username: editUsername,
          avatar: editAvatar
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser); // On met à jour l'affichage de la page
        setIsEditing(false);  // On ferme le mode édition

        // 📢 NOUVEAU : On utilise le mégaphone ! 
        // Cela avertit la Topbar qu'elle doit se mettre à jour instantanément.
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
    }
    setIsSaving(false);
  };

  return (
    <DashboardLayout title="Mon Profil">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CARTE 1 : Informations du Profil (MODIFIÉE) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden min-h-[320px]">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600/20 to-cyan-400/20"></div>

            {!isEditing ? (
              /* --- MODE LECTURE (Affichage Normal) --- */
              <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="relative w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden mb-4">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-slate-800"></div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {user ? user.username : 'Chargement...'}
                </h2>

                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <i className="fi fi-brands-ethereum text-indigo-400 text-sm"></i>
                  <p className="text-xs font-mono text-slate-400">
                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '0x000...0000'}
                  </p>
                </div>

                <button onClick={handleEditClick} className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2">
                  <i className="fi fi-rr-edit"></i> Éditer le profil
                </button>
              </div>
            ) : (
              /* --- MODE ÉDITION --- */
              <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Modification</p>

                {/* L'image de profil cliquable */}
                <div
                  onClick={handleShuffleAvatar}
                  className="relative w-24 h-24 rounded-full border-4 border-indigo-500 bg-slate-800 shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden mb-4 group cursor-pointer"
                  title="Cliquez pour générer un nouvel avatar"
                >
                  <img src={editAvatar} alt="Profile Edit" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold text-center leading-tight">Générer<br />Nouveau</span>
                  </div>
                </div>

                {/* NOUVEAU : Bouton Upload et Input caché */}
                <div className="flex flex-col items-center mb-5 mt-[-5px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors border border-slate-700 flex items-center gap-2"
                  >
                    <i className="fi fi-rr-upload"></i> Importer
                  </button>
                </div>

                {/* Champ de texte pour le Username */}
                <div className="w-full mb-5">
                  <label className="text-xs text-slate-500 mb-1 block text-left pl-1">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    maxLength={15}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 outline-none transition-colors text-sm font-medium text-center"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50"
                  >
                    {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CARTE 2 : Graphique d'évolution des actifs (INCHANGÉE) */}
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

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#818cf8' }} />
                  <Area type="monotone" dataKey="balance" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3 : La barre des onglets (Tabs) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center">
          <button onClick={() => setActiveTab('details')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'details' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <i className="fi fi-rr-apps"></i> Actifs en détail
          </button>

          <button onClick={() => setActiveTab('analysis')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'analysis' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
            <i className="fi fi-rr-chart-pie-alt"></i> Analyse du portefeuille
          </button>
        </div>

        <div className="min-h-[300px] border border-dashed border-slate-800 rounded-2xl flex items-center justify-center bg-slate-900/50">
          <p className="text-slate-500 text-sm">
            {activeTab === 'details' ? "Le détail des jetons apparaîtra ici." : "L'analyse graphique des secteurs apparaîtra ici."}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}