'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useDeployer } from '../../../app/hooks/useDeployer';
import NexuLayout from '../common/NexuLayout';
import { DeploymentRecord } from '../common/DeploymentHistory';

export default function MessageForm() {
  const { address, isConnected } = useAccount();
  const {
    isLoading, txHash, error, explorerUrl, isModalOpen, setIsModalOpen,
    networkName, deployedAddress, deploy
  } = useDeployer();

  const [msgText, setMsgText] = useState('GM Base!');
  const [selectedRecord, setSelectedRecord] = useState<DeploymentRecord | null>(null);

  const activeTab = 'message';
  const feeWei = ethers.parseEther('0.00003');
  const currentFeeString = ethers.formatEther(feeWei);

  const shareText = `🚀 I just deployed a Message contract on ${networkName}!\n\nCreate yours: https://forgnix.vercel.app/forge/message\nTrack onchain activity: https://forgnix.vercel.app\n@monx`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    await deploy({
      activeTab,
      isAdvancedMode: false,
      msgText,
      feeWei,
      currentFeeString,
      address: address as string | undefined,
      userCredits: 0,
      requestWhiteLabel: false,
    });
  };

  // Les props inutilisées (comme setIsAdvancedMode) sont passées avec des fonctions vides
  // car elles ne concernent pas ce composant simple.
  return (
    <div className="animate-in fade-in duration-500">
      <NexuLayout
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isConnected={isConnected}
        currentFeeString={currentFeeString}
        error={error}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        elementType="Message"
        networkName={networkName}
        shareText={shareText}
        encodedShareText={encodedShareText}
        deployedAddress={deployedAddress}
        txHash={txHash}
        explorerUrl={explorerUrl}
        activeTab={activeTab}
        isAdvancedMode={false}
        setIsAdvancedMode={() => {}}
        address={address}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      >
        <div>
  <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
    Message to engrave
  </label>

  <input
    type="text"
    value={msgText}
    onChange={(e) => setMsgText(e.target.value)}
    className="
      w-full
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
    placeholder="e.g. GM Base!"
  />

  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-secondary">
    Engrave a message in blockchain
  </p>
</div>
      </NexuLayout>
    </div>
  );
}
