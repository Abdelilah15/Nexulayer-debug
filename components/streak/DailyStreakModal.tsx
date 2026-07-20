import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ethers } from 'ethers';
import DailyStreakHeader from './DailyStreakHeader';
import WeeklyProgress from './WeeklyProgress';
import MotivationQuote from './MotivationQuote';
import DailyDeployButton from './DailyDeployButton';
import { useStreak } from '@/app/hooks/useStreak';
import { useDeployer } from '@/app/hooks/useDeployer';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: string;
}

export default function DailyStreakModal({ isOpen, onClose, address }: DailyStreakModalProps) {
  const [choice, setChoice] = useState<'GM' | 'GN'>('GM');
  const [isDeploying, setIsDeploying] = useState(false);
  const hasUpdated = useRef(false);

  const { streakData, isLoading: isStreakLoading, updateStreak, refreshStreak } = useStreak(address);
  const { deploy, error: deployError } = useDeployer();

  useEffect(() => {
    if (isOpen && !hasUpdated.current) {
      hasUpdated.current = true;
      refreshStreak();
    }

    if (!isOpen) {
      hasUpdated.current = false;
    }
  }, [isOpen, refreshStreak]);

  useEffect(() => {
    if (deployError && deployError.includes('already claimed today')) {
      updateStreak().then(() => {
        alert('Your status has been synchronized! The blockchain indicates you have already claimed your GM/GN today.');
      });
    }
  }, [deployError, updateStreak]);

  if (!isOpen) return null;

  const handleShare = () => {
    const text = `I just hit a ${streakData?.currentCount || 0}-day on-chain streak on Base with Nexulayer! 🔥\n\nDeploy your first contract today:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://nexulayer.com`,
      '_blank',
    );
  };

  const handleDeploy = async () => {
    if (!address) return alert('Please connect your wallet.');
    setIsDeploying(true);

    const uniqueMessage = choice;
    const feeWei = ethers.parseEther('0.00002');

    const success = await deploy({
      contractType: 'daily',
      msgText: uniqueMessage,
      feeWei: feeWei,
      isAdvancedMode: false,
      requestWhiteLabel: false,
      userCredits: 0,
      address: address,
    } as any);

    if (success) {
      await updateStreak();
    } else {
      alert(deployError || 'An error occurred while interacting with the contract.');
    }

    setIsDeploying(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-md rounded-2xl sm:rounded-3xl border border-card shadow-2xl p-5 sm:p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="relative z-10">
          <DailyStreakHeader currentStreak={streakData?.currentCount || 0} onClose={onClose} onShare={handleShare} />

          {isStreakLoading ? (
            <div className="py-12 flex justify-center text-accent">
              <i className="fi fi-rr-spinner animate-spin text-2xl"></i>
            </div>
          ) : (
            <>
              <div className="mt-6 bg-background border border-card rounded-xl sm:rounded-2xl overflow-hidden">
                <div className="p-4 sm:p-5">
                  <WeeklyProgress history={streakData?.history || []} />
                </div>
                <div className="border-t border-card p-4 sm:p-5">
                  <MotivationQuote currentStreak={streakData?.currentCount || 0} />
                </div>
              </div>

              <DailyDeployButton
                choice={choice}
                setChoice={setChoice}
                onDeploy={handleDeploy}
                isLoading={isDeploying}
                isTodayDone={streakData?.isTodayDone || false}
              />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
