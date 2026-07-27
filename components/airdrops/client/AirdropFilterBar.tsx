'use client';

import { Dispatch, SetStateAction } from 'react';

type Props = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedFilters: string[];
  toggleFilter: (filter: string) => void;
  allFilters: string[];
  visibleFilters: string[];
  showAllFilters: boolean;
  setShowAllFilters: Dispatch<SetStateAction<boolean>>;
};

export default function AirdropFilterBar({
  searchQuery,
  setSearchQuery,
  selectedFilters,
  toggleFilter,
  allFilters,
  visibleFilters,
  showAllFilters,
  setShowAllFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* 🌟 SEARCH BAR 🌟 */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-card rounded-full pl-10 pr-4 py-3.5 text-sm text-foreground placeholder-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-custom"
        />
      </div>

      {/* 🌟 FILTER CHIPS (Grid on mobile, flex on desktop) 🌟 */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
        <button
          onClick={() => toggleFilter('All')}
          className={`justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border inline-flex ${
            selectedFilters.length === 0
              ? 'bg-foreground text-background border-card'
              : 'bg-area text-secondary hover:bg-hover hover:text-foreground border-transparent hover:border-card'
          }`}
        >
          All Projects
        </button>

        {visibleFilters.map((f, index) => {
          const isSelected = selectedFilters.includes(f);

          // Show exactly 2 standard filters on mobile (indices 0 and 1) when not expanded.
          // Along with "All Projects" and "More", this results in exactly 4 elements.
          const mobileDisplayClass = !showAllFilters && index > 1 ? 'hidden sm:inline-flex' : 'inline-flex';

          return (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${mobileDisplayClass} ${
                isSelected
                  ? 'bg-area text-[#0052FF] border-accent shadow-custom'
                  : 'bg-area text-secondary hover:bg-hover hover:text-foreground border-transparent hover:border-card'
              }`}
            >
              {f}
            </button>
          );
        })}

        {/* Toggle Button for More Filters */}
        {allFilters.length > 10 && (
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap bg-area border border-card text-secondary hover:text-foreground hover:bg-hover inline-flex sm:ml-2"
          >
            {showAllFilters ? '− Show Less' : `+ ${allFilters.length - 10} More`}
          </button>
        )}
      </div>
    </div>
  );
}
