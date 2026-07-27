'use client';

import { useState, useMemo } from 'react';
import { Airdrop, Investor } from '@/app/lib/airdrops';
import ProjectCard from './ProjectCard';
import DescriptionCard from './DescriptionCard';
import FundingCard from './FundingCard';
import ExpandedFundingView from './ExpandedFundingView';

type Props = {
  airdrop: Airdrop;
};

export default function AirdropHeader({ airdrop }: Props) {
  const [isFundingExpanded, setIsFundingExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Secure investor JSON parsing
  const investors: Investor[] = useMemo(() => {
    if (!airdrop.investors) return [];
    if (typeof airdrop.investors === 'string') {
      try {
        return JSON.parse(airdrop.investors);
      } catch {
        return [];
      }
    }
    return airdrop.investors;
  }, [airdrop.investors]);

  const descriptionText = airdrop.description || 'No description available.';
  const isLongDesc = descriptionText.length > 300;

  // --- EXPANDED FUNDING VIEW ---
  if (isFundingExpanded) {
    return (
      <ExpandedFundingView
        airdrop={airdrop}
        investors={investors}
        onClose={() => setIsFundingExpanded(false)}
      />
    );
  }

  // --- DEFAULT VIEW (GRID) ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-in fade-in duration-300">
      {!isDescExpanded && <ProjectCard airdrop={airdrop} />}

      <DescriptionCard
        title={airdrop.title}
        descriptionText={descriptionText}
        isExpanded={isDescExpanded}
        isLongDesc={isLongDesc}
        onToggleExpand={() => setIsDescExpanded(!isDescExpanded)}
      />

      {!isDescExpanded && (
        <FundingCard
          airdrop={airdrop}
          investors={investors}
          onExpand={() => setIsFundingExpanded(true)}
        />
      )}
    </div>
  );
}
