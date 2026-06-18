'use client';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

// ⚠️ À REMPLACER PAR VOTRE NOUVELLE ADRESSE ET VOTRE NOUVEL ABI APRÈS LE DÉPLOIEMENT
const FACTORY_ADDRESS = "0x1204FABcbc9d04d334ED731F5089b0478764C1c3";
const FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "text",
        "type": "string"
      }
    ],
    "name": "createMessage",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      }
    ],
    "name": "createNFT",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "FailedDeployment",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "InsufficientBalance",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contractType",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "ContractCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "messageImplementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftImplementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ownerFeeAddress",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SERVICE_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenImplementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function Forger({ initialTab }: { initialTab: string }) {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState(initialTab);

  // États globaux
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('https://sepolia.basescan.org');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkName, setNetworkName] = useState('Base Sepolia');
  const [deployedAddress, setDeployedAddress] = useState('');

  // Synchroniser l'onglet et nettoyer les messages de la transaction précédente
  useEffect(() => {
    setActiveTab(initialTab);
    setTxHash('');
    setError('');
    setIsModalOpen(false);
  }, [initialTab]);

  // États des formulaires
  const [msgText, setMsgText] = useState('GM Base!');

  const [tokenName, setTokenName] = useState('Mon Token');
  const [tokenSymbol, setTokenSymbol] = useState('MTK');
  const [tokenSupply, setTokenSupply] = useState('10000');

  const [nftName, setNftName] = useState('Ma Collection');
  const [nftSymbol, setNftSymbol] = useState('MCN');
  const [nftSupply, setNftSupply] = useState('10'); // <-- Quantité pour NFT intégrée
  const getElementType = () => activeTab === 'message' ? 'Message' : activeTab === 'token' ? 'Token ERC-20' : 'NFT';
  const shareText = `🚀 I just deployed a ${getElementType()} contract on ${networkName}!\n\nCreate yours: https://forgnix.vercel.app/forge?tab=${activeTab}\nTrack onchain activity: https://forgnix.vercel.app\n@monx`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleCreate = async () => {
    setIsLoading(true);
    setError('');
    setTxHash('');
    setIsModalOpen(false);

    try {
      // Astuce TypeScript pour Vercel : on force le type de window
      const win = window as any;
      if (!win.ethereum) throw new Error("Portefeuille non détecté");

      const provider = new ethers.BrowserProvider(win.ethereum);

      // Détection intelligente du réseau (Mainnet vs Sepolia)
      const network = await provider.getNetwork();
      if (Number(network.chainId) === 8453) {
        setExplorerUrl('https://basescan.org');
        setNetworkName('Base Mainnet');
      } else {
        setExplorerUrl('https://sepolia.basescan.org');
        setNetworkName('Base Sepolia');
      }

      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      const fee = ethers.parseEther("0.00003");
      let tx;

      if (activeTab === 'message') {
        tx = await factoryContract.createMessage(msgText, { value: fee });
      } else if (activeTab === 'token') {
        tx = await factoryContract.createToken(tokenName, tokenSymbol, tokenSupply, { value: fee });
      } else if (activeTab === 'nft') {
        tx = await factoryContract.createNFT(nftName, nftSymbol, nftSupply, { value: fee });
      }

      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      // Extraction de l'adresse du contrat généré depuis les logs
      let extractedAddress = '';
      try {
        for (const log of receipt.logs) {
          const parsed = factoryContract.interface.parseLog(log);
          if (parsed && parsed.name === 'ContractCreated') {
            extractedAddress = parsed.args[0]; // La première variable est contractAddress
            break;
          }
        }
      } catch (err) {
        console.error("Impossible de parser les logs", err);
      }

      setDeployedAddress(extractedAddress);
      setIsModalOpen(true); // Ouvre la fenêtre de succès !

    } catch (error: unknown) {
      console.error(error);
      const err = error as { reason?: string; message?: string };
      setError(err.reason || err.message || "Une erreur est survenue lors de la transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
      <div className="p-8">

        {/* FORMULAIRES DYNAMIQUES */}
        <div className="space-y-6 mb-8">
          {activeTab === 'message' && (
            <div className="animate-in fade-in duration-500">
              <label className="block text-sm font-medium text-slate-400 mb-2">Message à graver</label>
              <input type="text" value={msgText} onChange={(e) => setMsgText(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: GM Base!" />
            </div>
          )}

          {activeTab === 'token' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nom du Token</label>
                <input type="text" value={tokenName} onChange={(e) => setTokenName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Forgenix Coin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Symbole</label>
                <input type="text" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: FRGX" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Quantité Totale</label>
                <input type="number" value={tokenSupply} onChange={(e) => setTokenSupply(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: 1000000" />
              </div>
            </div>
          )}

          {activeTab === 'nft' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nom de la Collection</label>
                <input type="text" value={nftName} onChange={(e) => setNftName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Bored Ape" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Symbole</label>
                <input type="text" value={nftSymbol} onChange={(e) => setNftSymbol(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: BAPE" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Quantité de NFTs à générer</label>
                <input type="number" value={nftSupply} onChange={(e) => setNftSupply(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: 10" />
              </div>
            </div>
          )}
        </div>

        {/* ZONE D'ACTION */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center">
          <div className="flex justify-between w-full mb-6 text-sm">
            <span className="text-slate-400">Frais de service</span>
            <span className="text-indigo-400 font-bold">0.00003 ETH</span>
          </div>

          {!isConnected ? (
            <div className="text-center text-slate-500 font-medium">Connectez votre portefeuille.</div>
          ) : (
            <button onClick={handleCreate} disabled={isLoading} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isLoading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]'}`}>
              {isLoading ? 'Forge en cours...' : '⚡ Forger sur la Blockchain'}
            </button>
          )}
        </div>

        {error && <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">❌ {error}</div>}

        {/* 🔥 MODAL DE SUCCÈS (Félicitations & Partage) 🔥 */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8">

                {/* En-tête du Modal */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    🎉
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg">
                    <i className="fi fi-rr-cross"></i>
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Deployment Successful!</h3>
                <p className="text-slate-300 mb-6">
                  Your <span className="font-bold text-indigo-400">{getElementType()}</span> contract has been deployed on <span className="font-bold text-indigo-400">{networkName}</span>.
                </p>

                {/* Zone de Partage */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Share your achievement</p>
                  <textarea
                    readOnly
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 resize-none outline-none mb-4"
                    rows={5}
                    value={shareText}
                  />

                  {/* Boutons de réseaux sociaux */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareText);
                        alert("Message copié !");
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <i className="fi fi-rr-copy"></i> Copier le message
                    </button>

                    {/* Liens pré-remplis avec les nouvelles icônes officielles */}
                    <div className="flex items-center gap-2.5 ml-2">
                      <a href={`https://twitter.com/intent/tweet?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Partager sur X" className="text-slate-300 hover:text-white transition-transform hover:scale-110 text-[34px] leading-none flex items-center">
                        <i className="fi fi-brands-twitter-alt-square"></i>
                      </a>

                      <a href={`https://warpcast.com/~/compose?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Partager sur Farcaster" className="text-[#8a63d2] hover:text-[#9b78dd] transition-transform hover:scale-110 w-[34px] h-[34px] flex items-center">
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-full h-full">
                          <title>Farcaster</title>
                          <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
                        </svg>
                      </a>

                      <a href={`https://www.facebook.com/sharer/sharer.php?u=https://forgnix.vercel.app/forge&quote=${encodedShareText}`} target="_blank" rel="noreferrer" title="Partager sur Facebook" className="text-[#1877F2] hover:text-[#3b8ef5] transition-transform hover:scale-110 text-[34px] leading-none flex items-center">
                        <i className="fi fi-brands-facebook-square"></i>
                      </a>

                      <a href={`https://t.me/share/url?url=https://forgnix.vercel.app/forge&text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Envoyer sur Telegram" className="text-[#2AABEE] hover:text-[#4ebdf8] transition-transform hover:scale-110 text-[34px] leading-none flex items-center">
                        <i className="fi fi-brands-telegram-square"></i>
                      </a>

                      <a href={`https://api.whatsapp.com/send?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Envoyer sur WhatsApp" className="text-[#25D366] hover:text-[#45e07e] transition-transform hover:scale-110 text-[34px] leading-none flex items-center">
                        <i className="fi fi-brands-whatsapp-square"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Zone du Contrat Déployé */}
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-5">
                  <p className="text-xs font-semibold text-indigo-300/70 mb-2 uppercase tracking-wide">
                    {deployedAddress ? 'Adresse du Contrat' : 'Hash de la Transaction'}
                  </p>
                  <p className="text-sm font-mono text-indigo-300 bg-indigo-950/50 p-2 rounded break-all mb-4">
                    {deployedAddress || txHash}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(deployedAddress || txHash);
                        alert("Adresse copiée !");
                      }}
                      className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fi fi-rr-copy"></i> Copier
                    </button>
                    <a
                      href={`${explorerUrl}/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fi fi-rr-search-alt"></i> Basescan
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}