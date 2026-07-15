'use client';
import React, { useState } from 'react';
import PricingWarningModal from '../modals/PricingWarningModal';

interface WhiteLabelSectionProps {
  userCredits: number;
  requestWhiteLabel: boolean;
  setRequestWhiteLabel: (val: boolean) => void;
}

export default function WhiteLabelSection({ 
  userCredits, 
  requestWhiteLabel, 
  setRequestWhiteLabel 
}: WhiteLabelSectionProps) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <>
      {userCredits > 0 ? (
        <div className="p-5 bg-emerald-500/10 rounded-xl animate-in fade-in duration-300 flex items-center justify-between">
          <div>
            <h4 className="text-emerald-500 font-bold flex items-center gap-2 text-lg">
              <i className="fi fi-rr-gem"></i> Premium White Label
            </h4>
            <p className="text-sm text-emerald-600/80 mt-1 max-w-[90%] dark:text-emerald-400/80">
              One credit will automatically be used to remove Forgenix branding. No additional ETH fees required.
            </p>
          </div>
          <div className="bg-emerald-500/20 text-emerald-500 px-5 py-3 rounded-xl flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-3xl font-black leading-none">{userCredits}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Credits</span>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-background border border-card rounded-xl animate-in fade-in duration-300 flex items-center justify-between">
          <div>
            <h4 className="text-accent font-medium flex items-center gap-2">
              <i className="fi fi-rr-gem"></i> White Label
            </h4>
            <p className="text-sm text-secondary mt-1 max-w-[80%]">
              Removes Forgenix branding from your smart contracts.
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={requestWhiteLabel} 
                onChange={(e) => { 
                  const isChecked = e.target.checked; 
                  setRequestWhiteLabel(isChecked); 
                  if (isChecked) setIsPricingModalOpen(true); 
                }} 
              />
              <div className={`block w-12 h-7 rounded-full transition-colors ${requestWhiteLabel ? 'bg-[#2b7fff]' : 'bg-[#1c398e]'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform ${requestWhiteLabel ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>
      )}

      {/* MODAL (Uniquement injectée si on coche le toggle payant) */}
      <PricingWarningModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </>
  );
}