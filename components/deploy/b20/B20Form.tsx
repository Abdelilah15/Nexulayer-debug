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

export default function B20Form() {
  const { address, isConnected, chainId } = useAccount();
  const {
    isLoading,
    txHash,
    error,
    explorerUrl,
    isModalOpen,
    setIsModalOpen,
    networkName,
    deployedAddress,
    deploy,
    resetStates,
  } = useDeployer();

  const contractType = 'b20' as const;
  const [b20Type, setB20Type] = useState<'asset' | 'stablecoin'>('asset');
  const [userCredits, setUserCredits] = useState<number>(0);
  const [selectedRecord, setSelectedRecord] = useState<DeploymentRecord | null>(null);

  const [tokenName, setTokenName] = useState('My Token');
  const [tokenSymbol, setTokenSymbol] = useState('MTK');
  const [tokenSupply, setTokenSupply] = useState('10000');
  const [decimals, setDecimals] = useState('18');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [requestWhiteLabel, setRequestWhiteLabel] = useState(false);
  const [description, setDescription] = useState('');
  const [socials, setSocials] = useState({
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    farcaster: '',
    github: '',
    tags: '',
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaFile) setPreviewUrl(null);
  }, [mediaFile]);

  useEffect(() => {
    if (!isAdvancedMode && b20Type === 'stablecoin') setB20Type('asset');
  }, [isAdvancedMode, b20Type]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!address) {
        setUserCredits(0);
        return;
      }
      try {
        const win = window as any;
        if (win.ethereum) {
          const provider = new ethers.BrowserProvider(win.ethereum);
          const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
          const creditsBigInt = await factoryContract.getUserCredits(address);
          setUserCredits(Number(creditsBigInt));
          if (Number(creditsBigInt) > 0) setRequestWhiteLabel(true);
        }
      } catch (err) {
        setUserCredits(0);
      }
    };
    fetchCredits();
  }, [address, chainId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMediaFile(file);
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const calculateFeeWei = (): bigint => {
    const hasCredits = userCredits > 0;
    const base = isAdvancedMode ? ethers.parseEther('0.0001') : ethers.parseEther('0.00005');
    if (!requestWhiteLabel || hasCredits) return base;
    const wl = isAdvancedMode ? ethers.parseEther('0.0001') : ethers.parseEther('0.00005');
    return base + wl;
  };

  const feeWei = calculateFeeWei();
  const currentFeeString = ethers.formatEther(feeWei);
  const elementType = b20Type === 'stablecoin' ? 'B20 Stablecoin' : 'B20 Native Asset';
  const shareText = `🚀 I just deployed a ${elementType} contract on ${networkName}!\n\nCreate yours: https://forgnix.vercel.app/forge/b20\nTrack onchain activity: https://forgnix.vercel.app\n@monx`;
  const encodedShareText = encodeURIComponent(shareText);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const success = await deploy({
      contractType,
      isAdvancedMode,
      mediaFile,
      description,
      tokenName,
      socials,
      requestWhiteLabel,
      tokenSymbol,
      tokenSupply,
      feeWei,
      currentFeeString,
      userCredits,
      b20Type,
      currencyCode,
      decimals: parseInt(decimals) || 18,
      address: address as string | undefined,
      onCreditDeducted: (newCredits) => {
        setUserCredits(newCredits);
        if (newCredits === 0) setRequestWhiteLabel(false);
      },
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
        elementType={elementType}
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
                className={`block w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors ${isAdvancedMode ? 'bg-[#2b7fff]' : 'bg-[#1c398e]'}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform transform ${isAdvancedMode ? 'translate-x-4 sm:translate-x-5' : ''}`}
              ></div>
            </div>
            <div className="ml-2.5 sm:ml-3 text-xs sm:text-sm font-medium text-secondary">
              Advanced Mode <span className="opacity-70 ml-1">(Metadata & Artwork)</span>
            </div>
          </label>
        </div>

        <WhiteLabelSection
          userCredits={userCredits}
          requestWhiteLabel={requestWhiteLabel}
          setRequestWhiteLabel={setRequestWhiteLabel}
        />

        {isAdvancedMode && (
          <div className="mt-4 flex w-full rounded-full border border-card bg-transparent p-1.5 sm:mt-6 gap-4">
            <label
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-full py-2.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
                b20Type === 'asset' ? 'bg-[#2b7fff] text-white shadow-md' : 'bg-[#1c398e] text-white'
              }`}
            >
              <input
                type="radio"
                name="b20Type"
                value="asset"
                checked={b20Type === 'asset'}
                onChange={() => setB20Type('asset')}
                className="hidden"
              />
              Standard Asset
            </label>

            <label
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-full py-2.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
                b20Type === 'stablecoin' ? 'bg-[#2b7fff] text-white shadow-md' : 'bg-[#1c398e] text-white'
              }`}
            >
              <input
                type="radio"
                name="b20Type"
                value="stablecoin"
                checked={b20Type === 'stablecoin'}
                onChange={() => setB20Type('stablecoin')}
                className="hidden"
              />
              Stablecoin (6 Decimals)
            </label>
          </div>
        )}

        <div
          className={
            isAdvancedMode
              ? 'grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6'
              : 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6'
          }
        >
          <div className={isAdvancedMode ? 'md:col-span-2 flex flex-col gap-3 sm:gap-4' : 'contents'}>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                {b20Type === 'stablecoin' ? 'Stablecoin Name' : 'B20 Asset Name'}
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder={b20Type === 'stablecoin' ? 'e.g. Base USD' : 'e.g. Base Native Gold'}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">Symbol</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder={b20Type === 'stablecoin' ? 'e.g. USDb' : 'e.g. BNG'}
              />
            </div>

            <div
              className={
                isAdvancedMode
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:col-span-2'
              }
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                  Initial Supply Cap
                </label>
                <input
                  type="number"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                  className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="e.g. 1000000"
                />
              </div>

              {b20Type === 'asset' && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                    Decimals (6 - 18)
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="18"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    placeholder="18"
                  />
                </div>
              )}

              {isAdvancedMode && b20Type === 'stablecoin' && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    placeholder="e.g. USD, EUR, JPY"
                  />
                </div>
              )}
            </div>
          </div>

          {isAdvancedMode && (
            <div className="md:col-span-1 flex flex-col">
              <ImageUploader label="Token Logo (PNG, JPG)" previewUrl={previewUrl} onImageChange={handleImageChange} />
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
            royaltyFee="0"
            setRoyaltyFee={() => {}}
          />
        )}
      </NexuLayout>
    </div>
  );
}
