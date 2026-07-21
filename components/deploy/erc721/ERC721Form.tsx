'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/app/lib/contracts';
import { useDeployer } from '../../../app/hooks/useDeployer';
import NexuLayout from '../common/NexuLayout';
import ImageUploader from '../common/ImageUploader';
import AdvancedSettings from '../common/AdvancedSettings';
import WhiteLabelSection from '../common/WhiteLabelSection';
import { DeploymentRecord } from '../common/DeploymentHistory';

export default function ERC721Form() {
  const { address, isConnected, chainId } = useAccount();
  const {
    isLoading, txHash, error, explorerUrl, isModalOpen, setIsModalOpen,
    networkName, deployedAddress, deploy, resetStates
  } = useDeployer();

  const contractType = 'nft' as const;
  const [userCredits, setUserCredits] = useState<number>(0);
  const [selectedRecord, setSelectedRecord] = useState<DeploymentRecord | null>(null);

  const [nftName, setNftName] = useState('My Collection');
  const [nftSymbol, setNftSymbol] = useState('MCN');
  const [nftSupply, setNftSupply] = useState('10');
  const [royaltyFee, setRoyaltyFee] = useState('500');

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [requestWhiteLabel, setRequestWhiteLabel] = useState(false);
  const [description, setDescription] = useState('');
  const [socials, setSocials] = useState({ website: '', twitter: '', telegram: '', discord: '', farcaster: '', github: '', tags: '' });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => { if (!mediaFile) setPreviewUrl(null); }, [mediaFile]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!address) { setUserCredits(0); return; }
      try {
        const win = window as any;
        if (win.ethereum) {
          const provider = new ethers.BrowserProvider(win.ethereum);
          const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
          const creditsBigInt = await factoryContract.getUserCredits(address);
          setUserCredits(Number(creditsBigInt));
          if (Number(creditsBigInt) > 0) setRequestWhiteLabel(true);
        }
      } catch (err) { setUserCredits(0); }
    };
    fetchCredits();
  }, [address, chainId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMediaFile(file);
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else { setPreviewUrl(null); }
  };

  const calculateFeeWei = (): bigint => {
    const hasCredits = userCredits > 0;
    const base = isAdvancedMode ? ethers.parseEther('0.0001') : ethers.parseEther('0.00003');
    if (!requestWhiteLabel || hasCredits) return base;
    const wl = isAdvancedMode ? ethers.parseEther('0.00008') : ethers.parseEther('0.00005');
    return base + wl;
  };

  const feeWei = calculateFeeWei();
  const currentFeeString = ethers.formatEther(feeWei);
  const shareText = `🚀 I just deployed an NFT contract on ${networkName}!\n\nCreate yours: https://forgnix.vercel.app/forge/erc721\nTrack onchain activity: https://forgnix.vercel.app\n@Nexulayer`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const success = await deploy({
      contractType, isAdvancedMode, mediaFile, description, nftName,
      socials, requestWhiteLabel, nftSymbol, nftSupply,
      royaltyFee, feeWei, currentFeeString, userCredits,
      address: address as string | undefined,
      onCreditDeducted: (newCredits) => {
        setUserCredits(newCredits);
        if (newCredits === 0) setRequestWhiteLabel(false);
      }
    });

    if (success) {
      setMediaFile(null);
      setDescription('');
    }
  };

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
        elementType="NFT"
        networkName={networkName}
        shareText={shareText}
        encodedShareText={encodedShareText}
        deployedAddress={deployedAddress}
        txHash={txHash}
        explorerUrl={explorerUrl}
        contractType={contractType}
        isAdvancedMode={isAdvancedMode}
        setIsAdvancedMode={setIsAdvancedMode}
        address={address}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      >
        <div className="mb-4 sm:mb-6 flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isAdvancedMode}
                onChange={() => setIsAdvancedMode(!isAdvancedMode)}
              />

              <div
                className={`block w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors ${isAdvancedMode ? "bg-[#2b7fff]" : "bg-[#1c398e]"
                  }`}
              ></div>

              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform transform ${isAdvancedMode ? "translate-x-4 sm:translate-x-5" : ""
                  }`}
              ></div>
            </div>

            <div className="ml-2.5 sm:ml-3 text-xs sm:text-sm font-medium text-secondary">
              Advanced Mode
              <span className="opacity-70 ml-1">(Metadata & Artwork)</span>
            </div>
          </label>
        </div>

        <WhiteLabelSection
          userCredits={userCredits}
          requestWhiteLabel={requestWhiteLabel}
          setRequestWhiteLabel={setRequestWhiteLabel}
        />

        <div
          className={
            isAdvancedMode
              ? "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6"
              : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6"
          }
        >
          <div
            className={
              isAdvancedMode
                ? "md:col-span-2 flex flex-col gap-3 sm:gap-4"
                : "contents"
            }
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                Collection Name
              </label>

              <input
                type="text"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="e.g. Bored Ape"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                Symbol
              </label>

              <input
                type="text"
                value={nftSymbol}
                onChange={(e) => setNftSymbol(e.target.value)}
                className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="e.g. BAPE"
              />
            </div>

            <div className={isAdvancedMode ? "" : "md:col-span-2"}>
              <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                Number of NFTs to mint
              </label>

              <input
                type="number"
                value={nftSupply}
                onChange={(e) => setNftSupply(e.target.value)}
                className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          {isAdvancedMode && (
            <div className="md:col-span-1 flex flex-col">
              <ImageUploader
                label="Artwork (PNG, JPG, GIF)"
                previewUrl={previewUrl}
                onImageChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {isAdvancedMode && (
          <AdvancedSettings
            contractType={contractType}
            description={description}
            setDescription={setDescription}
            socials={socials}
            setSocials={setSocials}
            royaltyFee={royaltyFee}
            setRoyaltyFee={setRoyaltyFee}
          />
        )}
      </NexuLayout>
    </div>
  );
}
