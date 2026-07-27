import { Airdrop, Investor } from '@/app/lib/airdrops';

type Props = {
  airdrop: Airdrop;
  investors: Investor[];
  onExpand: () => void;
};

export default function FundingCard({ airdrop, investors, onExpand }: Props) {
  return (
    <div className="bg-card border border-card rounded-2xl p-6 shadow-custom flex flex-col">
      <p className="text-xs text-secondary mb-6 uppercase tracking-wider font-semibold border-b border-card pb-2">
        Funding
      </p>

      <div className="mb-6">
        <p className="text-xs text-secondary mb-1">Raised Funds</p>
        <p className="font-mono text-3xl font-black text-foreground">
          {airdrop.raised_funds || 'N/A'}
        </p>
      </div>

      <div className="flex-1">
        <p className="text-xs text-secondary mb-3">Top Investors</p>
        <div className="space-y-3">
          {investors.slice(0, 3).map((inv, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {inv.logo ? (
                <img
                  src={inv.logo}
                  alt={inv.name}
                  className="w-6 h-6 rounded-full bg-area border border-card"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-area border border-card" />
              )}
              <span className="text-sm font-medium text-foreground">{inv.name}</span>
            </div>
          ))}
          {investors.length === 0 && (
            <span className="text-sm text-secondary">No investors listed.</span>
          )}
        </div>
      </div>

      {investors.length > 3 && (
        <button
          onClick={onExpand}
          className="mt-6 w-full py-2 bg-area hover:bg-hover border border-card rounded-lg text-sm text-foreground font-medium transition-colors"
        >
          + {investors.length - 3} more
        </button>
      )}
    </div>
  );
}
