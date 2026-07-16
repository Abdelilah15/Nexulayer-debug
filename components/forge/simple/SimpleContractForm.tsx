'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useDeployer } from '../../../app/hooks/useDeployer';
import ForgeLayout from '../common/ForgeLayout';
import { DeploymentRecord } from '../common/DeploymentHistory';

export default function SimpleContractForm() {
  const { address, isConnected } = useAccount();
  const {
    isLoading, txHash, error, explorerUrl, isModalOpen, setIsModalOpen,
    networkName, deployedAddress, deploy
  } = useDeployer();

  const [simpleName, setSimpleName] = useState('My Contract');
  const [selectedRecord, setSelectedRecord] = useState<DeploymentRecord | null>(null);

  const activeTab = 'simple';
  const feeWei = ethers.parseEther('0.00003');
  const currentFeeString = ethers.formatEther(feeWei);
  
  const shareText = `🚀 I just deployed a Basic Contract on ${networkName}!\n\nCreate yours: https://forgnix.vercel.app/forge/simple\nTrack onchain activity: https://forgnix.vercel.app\n@monx`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    await deploy({
      activeTab,
      isAdvancedMode: false,
      simpleName,
      feeWei,
      currentFeeString,
      address: address as string | undefined,
      userCredits: 0,
      requestWhiteLabel: false,
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <ForgeLayout
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isConnected={isConnected}
        currentFeeString={currentFeeString}
        error={error}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        elementType="Basic Contract"
        networkName={networkName}
        shareText={shareText}
        encodedShareText={encodedShareText}
        deployedAddress={deployedAddress}
        txHash={txHash}
        explorerUrl={explorerUrl}
        activeTab={activeTab}
        isAdvancedMode={false}
        setIsAdvancedMode={() => {}} /* Non utilisé en mode simple */
        address={address}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      >
        <div>
  <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
    Contract Name
  </label>

  <input
    type="text"
    value={simpleName}
    onChange={(e) => setSimpleName(e.target.value)}
    className="
      w-full
      bg-card
      border border-card
      rounded-lg sm:rounded-xl
      p-3 sm:p-4
      text-sm sm:text-base
      text-foreground
      placeholder:text-sm sm:placeholder:text-base
      focus:outline-none
      focus:ring-2
      focus:ring-accent/20
      transition-all
    "
    placeholder="e.g. MyContract"
  />

  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-secondary leading-tight">
    Deploys a basic Smart Contract, ideal for quick on-chain interaction.
  </p>
</div>
      </ForgeLayout>
    </div>
  );
}