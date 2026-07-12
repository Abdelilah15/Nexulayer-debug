'use client';
import React, { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbiItem, parseAbi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { FACTORY_ADDRESS } from '@/app/lib/contracts'; // Ajustez le chemin

// Déclaration de l'ABI pour lire les variables des contrats déployés
const CONTRACT_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function contractURI() view returns (string)",
  "function uri(uint256) view returns (string)"
]);

export interface DeploymentRecord {
  id: string;
  type: string;
  address: string;
  txHash: string;
  tabCategory: string;
  name?: string;
  symbol?: string;
  imageUrl?: string;
  description?: string;
}

interface DeploymentHistoryProps {
  address?: `0x${string}`; // Viem utilise ce type strict pour les adresses
  activeTab: string;
  explorerUrl: string;
  refreshTrigger: string;
}

export default function DeploymentHistory({ address, activeTab, explorerUrl, refreshTrigger }: DeploymentHistoryProps) {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remplace "ipfs://" par la passerelle de votre choix (ex: ipfs.io ou votre gateway Pinata)
  const resolveIpfsUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  };

  const mapTypeToTab = (typeName: string): string => {
    if (typeName.includes("B20")) return 'b20';
    if (typeName.includes("ERC20")) return 'token';
    if (typeName.includes("721")) return 'nft';
    if (typeName.includes("1155")) return 'erc1155';
    if (typeName.includes("Message")) return 'message';
    return 'simple';
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!address) return;
      setIsLoading(true);

      try {
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http()
        });

        const eventSignature = parseAbiItem('event ProxyDeployed(address indexed deployedAddress, address indexed implementation, string typeName, address indexed deployer, bool isWhiteLabeled)');

        // 1. Obtenir le bloc actuel
        const latestBlock = await publicClient.getBlockNumber();
        const START_BLOCK = 44040000n; // Bloc de début fixe
        const CHUNK_SIZE = 2000n; // Limite stricte du RPC

        let allLogs: any[] = [];

        // 2. Boucle de découpage pour respecter la limite de 2000 blocs
        for (let i = START_BLOCK; i < latestBlock; i += CHUNK_SIZE) {
          const fromBlock = i;
          const toBlock = i + CHUNK_SIZE - 1n > latestBlock ? latestBlock : i + CHUNK_SIZE - 1n;

          try {
            const logs = await publicClient.getLogs({
              address: FACTORY_ADDRESS as `0x${string}`,
              event: eventSignature,
              args: { deployer: address },
              fromBlock,
              toBlock
            });

            if (logs.length > 0) {
              console.log(`✅ Trouvé ${logs.length} logs sur le bloc ${fromBlock}`);
            }
            allLogs = [...allLogs, ...logs];
          } catch (err) {
            console.warn(`Erreur sur le bloc ${fromBlock}`, err);
          }
        }

        // 3. Traitement des données (le même qu'avant)
        const historyData = await Promise.all(allLogs.map(async (log) => {
          const deployedAddress = log.args.deployedAddress as `0x${string}`;
          const typeName = log.args.typeName as string;
          const txHash = log.transactionHash;

          let tokenName = "", tokenSymbol = "", imageUrl = "", description = "";

          if (typeName.includes("ERC20") || typeName.includes("B20") || typeName.includes("721") || typeName.includes("1155")) {
            // Lecture des données... (gardez votre logique précédente ici)
          }

          return { id: txHash, type: typeName, address: deployedAddress, txHash, tabCategory: mapTypeToTab(typeName), name: tokenName, symbol: tokenSymbol, imageUrl, description };
        }));

        setDeployments(historyData.reverse());
      } catch (error) {
        console.error("Viem Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [address, refreshTrigger]);

  const filteredDeployments = deployments.filter(dep => dep.tabCategory === activeTab);

  if (!address || (filteredDeployments.length === 0 && !isLoading)) return null;

  return (
    <div className="bg-card border border-card rounded-2xl overflow-hidden mt-6 animate-in fade-in duration-500">
      <div className="p-6 border-b border-card flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <i className="fi fi-rr-time-past text-accent"></i> On-Chain History
          </h3>
          <p className="text-sm text-secondary mt-1">Directly fetched via Viem.</p>
        </div>
        {isLoading && <div className="text-accent flex items-center gap-2 text-sm"><i className="fi fi-rr-spinner animate-spin"></i> Reading Contracts...</div>}
      </div>

      <div className="divide-y divide-card/50 max-h-[500px] overflow-y-auto">
        {filteredDeployments.map((record) => (
          <div key={record.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-background/50 transition-colors">

            <div className="flex items-center gap-4">
              {record.imageUrl ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-background shrink-0 border border-card shadow-sm">
                  <img src={record.imageUrl} alt="Token logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl shrink-0 border border-accent/20">
                  <i className="fi fi-rr-document-signed"></i>
                </div>
              )}

              <div>
                <h4 className="text-foreground font-medium flex items-center gap-2">
                  {record.name ? `${record.name} ${record.symbol ? `(${record.symbol})` : ''}` : record.type}
                </h4>
                <div className="text-sm text-secondary flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold bg-card border border-card px-2 py-0.5 rounded-md text-accent">
                    {record.type}
                  </span>
                </div>
                {record.description && (
                  <p className="text-xs text-secondary mt-2 max-w-sm truncate opacity-80" title={record.description}>
                    {record.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
              <button onClick={() => { navigator.clipboard.writeText(record.address); alert("Copied!"); }} className="bg-background border border-card hover:bg-hover text-secondary hover:text-foreground text-sm py-2 px-4 rounded-xl flex items-center gap-2">
                <i className="fi fi-rr-copy"></i> Copy
              </button>
              <a href={`${explorerUrl}/address/${record.address}`} target="_blank" rel="noreferrer" className="bg-[#2b7fff]/10 hover:bg-[#2b7fff]/20 text-[#2b7fff] text-sm py-2 px-4 rounded-xl flex items-center gap-2">
                <i className="fi fi-rr-search-alt"></i> Basescan
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}