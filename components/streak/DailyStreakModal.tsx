import React, { useState } from 'react';
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

  const { streakData, isLoading: isStreakLoading, updateStreak } = useStreak(address);
  const { deploy } = useDeployer();

  if (!isOpen) return null;

  const handleShare = () => {
    const text = `I just hit a ${streakData?.currentCount || 0}-day on-chain streak on Base with Nexulayer! 🔥\n\nDeploy your first contract today:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://nexulayer.com`,
      '_blank',
    );
  };

  const handleDeploy = async () => {
    if (!address) return alert('Veuillez connecter votre wallet.');

    setIsDeploying(true);
    try {
      // CORRECTION 1 : Le contrat exige EXACTEMENT "GM" ou "GN", plus besoin de bidouiller la date !
      const uniqueMessage = choice;

      // CORRECTION 2 : Le prix exact défini dans FeeLib est 0.00002 ETH
      const feeWei = ethers.parseEther('0.00002');

      // CORRECTION 3 : On utilise un nouvel 'activeTab' pour cibler la bonne fonction
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
        console.log('Transaction confirmée, mise à jour de la streak...');
        await updateStreak();
      } else {
        throw new Error('Le déploiement a échoué.');
      }
    } catch (error: any) {
      console.error('Erreur lors du processus:', error);

      if (error?.code === 'ACTION_REJECTED') {
        alert("Transaction annulée par l'utilisateur.");
      } else if (error?.message?.includes('InsufficientFee') || error?.message?.includes('0xa458261b')) {
        alert('Erreur de frais : Le montant envoyé ne correspond pas aux frais requis par le contrat.');
      } else if (error?.message?.includes('execution reverted') || error?.code === 'CALL_EXCEPTION') {
        alert("La blockchain a rejeté la transaction. Vérifiez que vous avez assez d'ETH pour payer le gaz.");
      } else {
        alert(error.reason || error.message || "Une erreur est survenue lors de l'interaction avec le contrat.");
      }
    } finally {
      setIsDeploying(false);
    }
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
