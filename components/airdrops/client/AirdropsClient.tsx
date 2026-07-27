'use client';

import { useState, useMemo } from 'react';
import { Airdrop } from '@/app/lib/airdrops';
import AirdropFilterBar from './AirdropFilterBar';
import AirdropTable from './AirdropTable';

// Reusable JSON parser for tasks
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

export default function AirdropsClient({ airdrops }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Group definitions
  const statuses = ['Confirmed', 'Potential', 'Snapshot', 'Verification', 'Reward Available'];
  const categories = ['DeFi', 'Blockchain', 'Infrastructure', 'GameFi', 'NFT', 'SocialFi', 'Wallet', 'Exchange / DEX', 'AI', 'Other'];

  // Dynamically extract all available tags from all projects
  const availableTags = useMemo(() => {
    const globalTags = new Set<string>();
    airdrops.forEach(airdrop => {
      getUniqueTags(airdrop.tasks).forEach(tag => globalTags.add(tag));
    });
    return Array.from(globalTags).sort();
  }, [airdrops]);

  // Combine everything for the filter bar
  const allFilters = [...statuses, ...categories, ...availableTags];

  // Show first 10 filters by default, or all if toggled
  const visibleFilters = showAllFilters ? allFilters : allFilters.slice(0, 10);

  const toggleFilter = (filterName: string) => {
    if (filterName === 'All') {
      setSelectedFilters([]);
      return;
    }

    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filterName));
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  };

  // Advanced Filtering Logic (Search + Status + Category + Tags)
  const filteredAirdrops = airdrops.filter((airdrop) => {
    const matchesSearch = searchQuery === '' ||
      airdrop.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilters.length === 0) return true;

    const activeStatuses = selectedFilters.filter(f => statuses.includes(f));
    const activeCategories = selectedFilters.filter(f => categories.includes(f));
    const activeTags = selectedFilters.filter(f => availableTags.includes(f));

    const airdropStatus = (airdrop.status || 'Active').toLowerCase();
    const airdropCategory = (airdrop.category || 'DeFi').toLowerCase();
    const airdropTags = getUniqueTags(airdrop.tasks).map(t => t.toLowerCase());

    const passesStatus = activeStatuses.length === 0 ||
      activeStatuses.some(s => s.toLowerCase() === airdropStatus);

    const passesCategory = activeCategories.length === 0 ||
      activeCategories.some(c => c.toLowerCase() === airdropCategory);

    const passesTags = activeTags.length === 0 ||
      activeTags.some(t => airdropTags.includes(t.toLowerCase()));

    return passesStatus && passesCategory && passesTags;
  });

  return (
    <div className="w-full">
      <AirdropFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        allFilters={allFilters}
        visibleFilters={visibleFilters}
        showAllFilters={showAllFilters}
        setShowAllFilters={setShowAllFilters}
      />

      <AirdropTable airdrops={filteredAirdrops} />
    </div>
  );
}
