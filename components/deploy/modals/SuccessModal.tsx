import React from 'react';
import { ContractType } from '@/app/lib/contracts';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: string;
  networkName: string;
  shareText: string;
  encodedShareText: string;
  deployedAddress: string;
  txHash: string;
  explorerUrl: string;
  contractType: ContractType;
  isAdvancedMode: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  elementType,
  networkName,
  shareText,
  encodedShareText,
  deployedAddress,
  txHash,
  explorerUrl,
  contractType,
  isAdvancedMode
}: SuccessModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-card rounded-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-3xl">
              🎉
            </div>
            <button onClick={onClose} className="text-secondary hover:text-foreground transition-colors p-2 bg-background hover:bg-hover rounded-xl">
              <i className="fi fi-rr-cross"></i>
            </button>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">Deployment Successful!</h3>
          <p className="text-secondary mb-6">
            Your <span className="font-bold text-accent">{elementType}</span> contract has been deployed on <span className="font-bold text-accent">{networkName}</span>.
          </p>

          <div className="bg-background rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Share your achievement</p>

            <div className="w-full bg-card border border-card rounded-xl p-4 text-sm text-secondary mb-4 whitespace-pre-wrap break-words leading-relaxed">
              {shareText}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareText);
                  alert("Message copied!");
                }}
                className="flex-1 bg-card border border-card hover:bar-button-hover text-foreground text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
              >
                <i className="fi fi-rr-copy"></i> Copy Message
              </button>

              <div className="flex items-center gap-3 ml-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on X" className="text-secondary hover:text-foreground transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a href={`https://warpcast.com/~/compose?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on Farcaster" className="text-[#8a63d2] hover:text-[#9b78dd] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
                  </svg>
                </a>

                <a href={`https://t.me/share/url?url=https://forgnix.vercel.app/forge&text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on Telegram" className="text-[#2AABEE] hover:text-[#4ebdf8] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-modal border border-modal rounded-xl p-5">
            <p className="text-xs font-semibold text-modal mb-2 uppercase tracking-wide">
              {deployedAddress ? 'Contract Address' : 'Transaction Hash'}
            </p>
            <p className="text-sm font-mono text-[#2b7fff] bg-accent/20 p-3 rounded-xl break-all mb-4">
              {deployedAddress || txHash}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(deployedAddress || txHash);
                  alert("Address copied!");
                }}
                className="flex-1 border border-modal hover:bg-hover text-foreground font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fi fi-rr-copy"></i> Copy
              </button>
              <a
                href={`${explorerUrl}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#2b7fff] hover:bg-accent-hover text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <i className="fi fi-rr-search-alt"></i> Basescan
              </a>
            </div>

            {contractType === 'nft' && isAdvancedMode && deployedAddress && (
              <a
                href={networkName === 'Base Mainnet'
                  ? `https://opensea.io/assets/base/${deployedAddress}`
                  : `https://testnets.opensea.io/assets/base-sepolia/${deployedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full group bg-background hover:bg-accent hover:text-white text-foreground font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                View collection on OpenSea
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
