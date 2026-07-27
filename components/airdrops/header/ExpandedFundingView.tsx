import { Airdrop, Investor } from '@/app/lib/airdrops';

type Props = {
  airdrop: Airdrop;
  investors: Investor[];
  onClose: () => void;
};

export default function ExpandedFundingView({ airdrop, investors, onClose }: Props) {
  const tier1 = investors.filter((i) => i.tier === 'Tier 1');
  const tier2 = investors.filter((i) => i.tier === 'Tier 2');
  const tier3 = investors.filter((i) => i.tier === 'Tier 3');
  const tier4 = investors.filter((i) => i.tier === 'Tier 4');
  const tier5 = investors.filter((i) => i.tier === 'Tier 5');
  const others = investors.filter((i) => i.tier === 'Others');

  const renderTier = (title: string, data: Investor[], icon: string) => {
    if (data.length === 0) return null;
    return (
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          {icon} {title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((inv, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-body p-3 rounded-xl border border-card">
              {inv.logo ? (
                <img src={inv.logo} alt={inv.name} className="w-8 h-8 rounded-full bg-area" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-area" />
              )}
              <span className="font-medium text-foreground">{inv.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-card rounded-2xl p-6 sm:p-10 mb-12 shadow-custom animate-in zoom-in-95 duration-300 relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 px-4 py-2 bg-area hover:bg-hover text-foreground text-sm font-medium rounded-lg transition-colors border border-card"
      >
        ✕ Close
      </button>

      <h2 className="text-2xl font-bold text-foreground mb-8 border-b border-card pb-4">Funding Details</h2>

      <div className="mb-10 text-center">
        <p className="text-secondary mb-2 uppercase tracking-wider text-sm font-medium">Raised Funds</p>
        <p className="text-5xl font-mono font-black text-foreground">{airdrop.raised_funds || 'N/A'}</p>
      </div>

      <div className="space-y-8">
        {renderTier('Tier 1 Investors', tier1, '🥇')}
        {renderTier('Tier 2 Investors', tier2, '🥈')}
        {renderTier('Tier 3 Investors', tier3, '🥉')}
        {renderTier('Tier 4 Investors', tier4, '🥈')}
        {renderTier('Tier 5 Investors', tier5, '🥇')}
        {renderTier('Other Partners', others, '🤝')}
      </div>
    </div>
  );
}
