"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAccount, useBalance } from 'wagmi'; // NOUVEAU : useBalance pour le solde réel
import DashboardLayout from '../../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// NOUVEAU : Ajout de joinedAt dans l'interface
interface UserProfile {
  username: string;
  address: string;
  role: string;
  avatar: string;
  joinedAt: string; 
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  
  // 1. RÉCUPÉRATION DU SOLDE RÉEL
  const { data: balanceData } = useBalance({ address: address });

  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 2. ÉTATS DU GRAPHIQUE
  const [timeframe, setTimeframe] = useState('6M');
  const [chartData, setChartData] = useState<{date: string, balance: number}[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chargement de l'utilisateur MongoDB
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

  // 3. LE MOTEUR DU GRAPHIQUE : Récupération réelle via l'API Zerion
  useEffect(() => {
    if (!address) return;

    const fetchPortfolioHistory = async () => {
      try {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, timeframe }),
        });

        if (res.ok) {
          const json = await res.json();
          
          // Avec la nouvelle URL /charts, Zerion range les données dans attributes.charts
          let zerionDataPoints = [];
          if (json.data && json.data.attributes && json.data.attributes.charts) {
              zerionDataPoints = json.data.attributes.charts;
          }

          if (zerionDataPoints.length > 0) {
            const formattedData = zerionDataPoints.map((point: any) => {
              // point[0] = timestamp en secondes, point[1] = valeur en dollars
              const pointDate = new Date(point[0] * 1000); 
              
              const dateString = pointDate.toLocaleDateString('fr-FR', {
                month: 'short',
                day: timeframe === '1M' ? 'numeric' : undefined,
                year: (timeframe === '1Y' || timeframe === '2Y' || timeframe === '5Y') ? '2-digit' : undefined
              });

              return {
                date: dateString,
                balance: parseFloat(point[1].toFixed(4))
              };
            });

            setChartData(formattedData);
          } else {
            console.log("Aucune donnée historique trouvée pour cette période.");
          }
        }
      } catch (error) {
        console.error("Erreur de récupération de l'historique :", error);
      }
    };

    fetchPortfolioHistory();
  }, [address, timeframe]);


  const handleEditClick = () => {
    if (user) {
      setEditUsername(user.username);
      setEditAvatar(user.avatar);
      setIsEditing(true);
    }
  };

  const handleShuffleAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setEditAvatar(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${randomSeed}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop lourde (Max 2 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        setUser(updatedUser);
        setIsEditing(false);
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
          
          {/* CARTE 1 : Informations du Profil */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden min-h-[320px]">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600/20 to-cyan-400/20"></div>

            {!isEditing ? (
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
              <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Modification</p>

                <div onClick={handleShuffleAvatar} className="relative w-24 h-24 rounded-full border-4 border-indigo-500 bg-slate-800 shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden mb-4 group cursor-pointer" title="Cliquez pour générer un nouvel avatar">
                  <img src={editAvatar} alt="Profile Edit" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold text-center leading-tight">Générer<br />Nouveau</span>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-5 mt-[-5px]">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
                    <i className="fi fi-rr-upload"></i> Importer
                  </button>
                </div>

                <div className="w-full mb-5">
                  <label className="text-xs text-slate-500 mb-1 block text-left pl-1">Nom d'utilisateur</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} maxLength={15} className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 outline-none transition-colors text-sm font-medium text-center" />
                </div>

                <div className="flex gap-3 w-full">
                  <button onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-700">
                    Annuler
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50">
                    {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CARTE 2 : Graphique d'évolution des actifs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              
              {/* Affichage du VRAI solde */}
              <div>
                <h3 className="text-slate-400 text-sm font-medium">Actif Total ({balanceData?.symbol || 'ETH'})</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000'} <span className="text-sm text-slate-500 font-medium">{balanceData?.symbol}</span>
                </p>
              </div>
              
              {/* NOUVEAU : Sélecteur de temps dynamique */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                {['1M', '6M', '1Y', '2Y', '5Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      timeframe === tf ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={60} />
                  
                  {/* NOUVEAU : Tooltip professionnel avec l'indice de la souris */}
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} 
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold', fontSize: '16px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                    formatter={(value: any) => [`${value} ${balanceData?.symbol || 'ETH'}`, 'Valeur']}
                  />
                  
                  <Area type="monotone" dataKey="balance" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3 : La barre des onglets */}
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