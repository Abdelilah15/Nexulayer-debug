import React from 'react';

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
  activeTab: string;
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
  activeTab,
  isAdvancedMode
}: SuccessModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      {/* Flat container */}
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

          {/* Share Zone - Flat background */}
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
                {/* X (Twitter) */}
                <a href={`https://twitter.com/intent/tweet?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on X" className="text-secondary hover:text-foreground transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Farcaster */}
                <a href={`https://warpcast.com/~/compose?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on Farcaster" className="text-[#8a63d2] hover:text-[#9b78dd] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724" />
                  </svg>
                </a>

                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=https://forgnix.vercel.app/forge&quote=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on Facebook" className="text-[#1877F2] hover:text-[#3b8ef5] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a href={`https://t.me/share/url?url=https://forgnix.vercel.app/forge&text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on Telegram" className="text-[#2AABEE] hover:text-[#4ebdf8] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a href={`https://api.whatsapp.com/send?text=${encodedShareText}`} target="_blank" rel="noreferrer" title="Share on WhatsApp" className="text-[#25D366] hover:text-[#45e07e] transition-transform hover:scale-110 w-[30px] h-[30px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contract Zone - Using Accent Color for hierarchy */}
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

            {activeTab === 'nft' && isAdvancedMode && deployedAddress && (
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