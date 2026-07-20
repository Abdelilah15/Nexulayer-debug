'use client';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import DashboardLayout from '../../components/DashboardLayout';
import NetworkAlert from '@/components/deploy/NetworkAlert';
import { FEE_MANAGER_ADDRESS, getUsdcAddress, FEE_MANAGER_ABI, USDC_ABI } from '../lib/contracts';

const TIERS = [
  { id: 1, name: "Starter", credits: 50, price: 0.3, badge: "Popular" },
  { id: 2, name: "Pro", credits: 100, price: 0.6, badge: "Best Value" },
  { id: 3, name: "Studio", credits: 200, price: 1.0, badge: "Best Price" }
];

export default function PricingPage() {

  const { address, isConnected, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  const currentUsdcAddress = getUsdcAddress(chainId);

  const handlePurchase = async (tierId: number, credits: number, priceUSDC: number) => {
    setIsLoading(tierId);
    setError('');
    setStatusMsg('Checking wallet...');

    try {
      const win = window as any;
      if (!win.ethereum) throw new Error("Wallet not detected");

      const provider = new ethers.BrowserProvider(win.ethereum);
      const signer = await provider.getSigner();

      // 4. On utilise currentUsdcAddress ici
      const usdcContract = new ethers.Contract(currentUsdcAddress, USDC_ABI, signer);
      const feeManagerContract = new ethers.Contract(FEE_MANAGER_ADDRESS, FEE_MANAGER_ABI, signer);

      const decimals = await usdcContract.decimals();
      const amountToApprove = ethers.parseUnits(priceUSDC.toString(), decimals);

      setStatusMsg('Checking USDC balance...');
      const balance = await usdcContract.balanceOf(address);
      if (balance < amountToApprove) {
        throw new Error("Insufficient USDC balance.");
      }

      setStatusMsg('Checking allowances...');
      const allowance = await usdcContract.allowance(address, FEE_MANAGER_ADDRESS);

      if (allowance < amountToApprove) {
        setStatusMsg('Please approve USDC spending in your wallet...');
        const txApprove = await usdcContract.approve(FEE_MANAGER_ADDRESS, amountToApprove);
        await txApprove.wait();
      }

      setStatusMsg('Purchase in progress, please confirm the transaction...');
      const txPurchase = await feeManagerContract.purchaseSubscription(tierId);
      const receipt = await txPurchase.wait();

      setStatusMsg('');
      alert(`🎉 Congratulations! ${credits} credits have been added to your account.`);

    } catch (err: any) {
      console.error(err);
      setError(err.reason || err.message || "An error occurred during the purchase.");
      setStatusMsg('');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <NetworkAlert />
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
            Deploy with White Label
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-xl text-secondary">
            Purchase USDC credits to remove "Created with Nexulayer" from your future Smart Contracts.
          </p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-500/10 text-red-500 rounded-lg sm:rounded-xl text-center text-sm sm:text-base font-medium">
            {error}
          </div>
        )}

        {statusMsg && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-accent/10 text-accent rounded-lg sm:rounded-xl text-center flex justify-center items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TIERS.map((tier) => (
            <div key={tier.id} className="bg-card border border-card rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col relative overflow-hidden">
              {tier.badge && (
                <div className="absolute top-0 right-0 bg-[#2b7fff] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg">
                  {tier.badge}
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{tier.name}</h3>
              <div className="mt-3 sm:mt-4 flex items-baseline text-4xl sm:text-5xl font-extrabold text-accent">
                {tier.price} <span className="ml-1.5 sm:ml-2 text-lg sm:text-xl font-medium text-secondary">USDC</span>
              </div>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-secondary">
                Get <strong className="text-foreground">{tier.credits} credits</strong> for white-label deployments.
              </p>

              <div className="mt-6 sm:mt-8 flex-1">
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center text-sm sm:text-base text-secondary">
                    <span className="text-emerald-500 mr-2">✔</span> No Nexulayer branding
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-secondary">
                    <span className="text-emerald-500 mr-2">✔</span> 5 credits per deployment
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-secondary">
                    <span className="text-emerald-500 mr-2">✔</span> Valid for life
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(tier.id, tier.credits, tier.price)}
                disabled={isLoading !== null || !isConnected}
                className={`mt-6 sm:mt-8 w-full py-2.5 sm:py-3 px-4 bg-[#2b7fff] hover:bg-[#1a5fc0] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                  isLoading === tier.id
                    ? 'bg-background text-secondary cursor-wait'
                    : !isConnected
                      ? 'bg-background text-secondary cursor-not-allowed'
                      : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                {isLoading === tier.id ? 'Processing...' : isConnected ? 'Purchase' : 'Connect Wallet'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
