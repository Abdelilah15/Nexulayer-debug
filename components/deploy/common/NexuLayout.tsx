'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { ContractType } from '@/app/lib/contracts';
import SuccessModal from '../modals/SuccessModal';
import DeploymentHistory, { DeploymentRecord } from './DeploymentHistory';
import DeploymentModal from '../modals/DeploymentModal';

interface NexuLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent | React.MouseEvent) => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
  currentFeeString: string;
  error: string | null;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  elementType: string;
  networkName: string;
  shareText: string;
  encodedShareText: string;

  deployedAddress: string;
  txHash: string;
  explorerUrl: string;

  contractType: ContractType;
  isAdvancedMode: boolean;
  setIsAdvancedMode: (isAdvanced: boolean) => void;

  address: `0x${string}` | undefined;
  selectedRecord: DeploymentRecord | null;
  setSelectedRecord: (record: DeploymentRecord | null) => void;
}

export default function NexuLayout({
  children,
  onSubmit,
  isLoading,
  isConnected,
  currentFeeString,
  error,
  isModalOpen,
  setIsModalOpen,
  elementType,
  networkName,
  shareText,
  encodedShareText,
  deployedAddress,
  txHash,
  explorerUrl,
  contractType,
  isAdvancedMode,
  setIsAdvancedMode,
  address,
  selectedRecord,
  setSelectedRecord
}: NexuLayoutProps) {
  return (
    <div className="">
      <div className="bg-card border border-card rounded-2xl overflow-hidden mb-4 p-4 md:p-8">

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {children}
        </div>

        <div className="py-2 md:p-6 flex flex-col items-center">
          <div className="flex justify-between w-full mb-3 md:mb-4 text-xs md:text-sm">
            <span className="text-secondary">Service Fee</span>
            <span className="text-accent font-bold">{currentFeeString} ETH</span>
          </div>

          {!isConnected ? (
            <div className="text-center text-secondary font-medium text-sm md:text-base">Connect your wallet.</div>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className={`w-full py-2.5 md:py-4 rounded-xl font-bold text-base md:text-lg transition-colors ${isLoading
                  ? 'bg-[#2b7fff] text-white cursor-not-allowed'
                  : 'bg-[#2b7fff] hover:bg-[#155dfc] text-white'
                }`}
            >
              {isLoading ? 'Forging in progress...' : '⚡ Forge on Blockchain'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-red-500/10 rounded-xl text-red-500 font-medium text-xs md:text-sm text-center">
            {error}
          </div>
        )}


        <SuccessModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setIsAdvancedMode(false); }}
          elementType={elementType}
          networkName={networkName}
          shareText={shareText}
          encodedShareText={encodedShareText}
          deployedAddress={deployedAddress}
          txHash={txHash}
          explorerUrl={explorerUrl}
          contractType={contractType}
          isAdvancedMode={isAdvancedMode}
        />
      </div>

      <DeploymentHistory
        address={address}
        contractType={contractType}
        explorerUrl={explorerUrl}
        refreshTrigger={txHash || "init"}
        onSelectRecord={setSelectedRecord}
      />

      {selectedRecord && (
        <DeploymentModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          explorerUrl={explorerUrl}
        />
      )}
    </div>
  );
}
