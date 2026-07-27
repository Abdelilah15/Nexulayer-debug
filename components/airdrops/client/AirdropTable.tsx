'use client';

import Link from 'next/link';
import { Airdrop } from '@/app/lib/airdrops';

// Reusable JSON parser for both investors and tasks
const parseJSON = (data: any) => {
  if (!data) return [];
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return data;
};

// Extract and deduplicate tags from a single airdrop's tasks
const getUniqueTags = (tasksRaw: any): string[] => {
  const tasks = parseJSON(tasksRaw);
  if (!Array.isArray(tasks)) return [];

  const uniqueTags = new Set<string>();

  tasks.forEach(task => {
    if (task.tags) {
      task.tags.split(',').forEach((tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) uniqueTags.add(trimmedTag);
      });
    }
  });

  return Array.from(uniqueTags);
};

type Props = {
  airdrops: Airdrop[];
};

export default function AirdropTable({ airdrops }: Props) {
  return (
    <div className="bg-card border border-card rounded-2xl overflow-hidden shadow-custom relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-card text-secondary text-sm">
              <th className="sticky left-0 z-20 bg-card py-4 pl-6 pr-4 font-medium border-r border-[var(--border-color)] lg:border-none">
                Project
              </th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 font-medium">Task Type</th>
              <th className="py-4 px-4 font-medium">Raise / Funds</th>
              <th className="py-4 pl-4 pr-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {airdrops.map((airdrop) => (
              <tr key={airdrop.id} className="group hover:bg-area transition-colors">

                {/* 🌟 STICKY DATA COLUMN WITH TRUNCATION 🌟 */}
                <td className="sticky left-0 z-20 bg-card group-hover:bg-area transition-colors py-4 pl-6 pr-4 border-r border-[var(--border-color)] lg:border-none">
                  <div className="flex items-center gap-4">
                    {/* shrink-0 ensures the logo never gets squished */}
                    {airdrop.logo ? (
                      <img
                        src={airdrop.logo}
                        alt={airdrop.title}
                        className="w-10 h-10 rounded-full object-cover border border-card shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-area flex items-center justify-center font-bold text-sm border border-card text-foreground shrink-0">
                        <p>{airdrop.title.charAt(0)}</p>
                      </div>
                    )}
                    {/* min-w-0 is required for flex children to truncate properly */}
                    <div className="min-w-0">
                      <a
                        href={`/airdrops/${airdrop.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-[#0052FF] group-hover:text-accent transition-colors block truncate max-w-[110px] sm:max-w-[160px] md:max-w-none"
                      >
                        {airdrop.title}
                      </a>
                      <p className="text-xs text-secondary truncate max-w-[110px] sm:max-w-[160px] md:max-w-none">
                        {airdrop.category || 'DeFi'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* STATUS */}
                <td className="py-4 px-4">
                  {(() => {
                    const statusLower = airdrop.status?.toLowerCase() || '';
                    let statusStyle = 'bg-area text-secondary border-card';
                    let statusIcon = '';

                    if (statusLower === 'confirmed') {
                      statusStyle = 'bg-green-500/10 text-green-400 border-green-500/20';
                      statusIcon = '🟢 ';
                    } else if (statusLower === 'potential') {
                      statusStyle = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                      statusIcon = '🟡 ';
                    } else if (statusLower === 'snapshot') {
                      statusStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                      statusIcon = '📸 ';
                    } else if (statusLower === 'verification') {
                      statusStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                      statusIcon = '🔍 ';
                    } else if (statusLower === 'reward available') {
                      statusStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                      statusIcon = '🏆 ';
                    }

                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusStyle}`}>
                        {statusIcon}{airdrop.status || 'Active'}
                      </span>
                    );
                  })()}
                </td>

                {/* TASK TYPE */}
                <td className="py-4 px-4">
                  {(() => {
                    const tags = getUniqueTags(airdrop.tasks);

                    if (tags.length === 0) {
                      return <span className="text-xs text-secondary">No tasks</span>;
                    }

                    const displayTags = tags.slice(0, 4);
                    const remainingCount = tags.length - 4;

                    return (
                      <div className="flex flex-wrap gap-1.5 min-w-[150px] max-w-[200px]">
                        {displayTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-area text-secondary border border-card px-1.5 py-0.5 rounded uppercase tracking-wide whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}

                        {remainingCount > 0 && (
                          <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase tracking-wide font-bold whitespace-nowrap">
                            +{remainingCount}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>

                {/* RAISED FUNDS & INVESTORS */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4 min-w-[150px]">
                    <p className="font-mono font-bold text-xl text-foreground whitespace-nowrap">{airdrop.raised_funds || 'N/A'}</p>

                    {(() => {
                      const investors = parseJSON(airdrop.investors);
                      const displayInvestors = investors.slice(0, 4);
                      const remainingCount = investors.length - 4;

                      if (investors.length === 0) return null;

                      return (
                        <div className="flex items-center -space-x-2 mt-1">
                          {displayInvestors.map((inv: any, idx: number) => (
                            <div
                              key={idx}
                              title={inv.name}
                              className="w-10 h-10 rounded-full border-2 border-card bg-area flex items-center justify-center overflow-hidden z-10 relative"
                            >
                              {inv.logo ? (
                                <img src={inv.logo} alt={inv.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-secondary font-bold uppercase">
                                  {inv.name?.charAt(0) || '?'}
                                </span>
                              )}
                            </div>
                          ))}

                          {remainingCount > 0 && (
                            <div className="w-10 h-10 rounded-full border-2 border-card bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-10 relative">
                              +{remainingCount}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </td>

                {/* ACTION BUTTON */}
                <td className="py-4 pl-4 pr-6 text-right">
                  <Link
                    href={`/airdrops/${airdrop.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-area hover:bg-hover text-foreground text-sm font-medium rounded-lg transition-colors border border-card whitespace-nowrap"
                  >
                    View Guide
                  </Link>
                </td>
              </tr>
            ))}

            {airdrops.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-secondary">
                  No airdrops match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
