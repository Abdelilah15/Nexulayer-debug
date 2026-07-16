import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DailyStreakHeader from './DailyStreakHeader';
import WeeklyProgress from './WeeklyProgress';
import MotivationQuote from './MotivationQuote';
import DailyDeployButton from './DailyDeployButton';
import { useStreak } from '@/app/hooks/useStreak';
import { useDeployer } from '@/app/hooks/useDeployer';
import { useReadContract } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '../app/lib/contracts.ts';

interface DailyStreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    address?: string;
}

export default function DailyStreakModal({ isOpen, onClose, address }: DailyStreakModalProps) {
    // ---------------------------------------------------------
    // 1. TOUS LES HOOKS DOIVENT ÊTRE ICI (AVANT LE IF)
    // ---------------------------------------------------------
    const [choice, setChoice] = useState<'GM' | 'GN'>('GM');
    const [isDeploying, setIsDeploying] = useState(false);
    
    const { streakData, isLoading: isStreakLoading, updateStreak } = useStreak(address);
    
    // Le hook useDeployer doit être appelé inconditionnellement, ici :
    const { deploy } = useDeployer(); 

    // ---------------------------------------------------------
    // 2. LES RETOURS CONDITIONNELS DOIVENT ÊTRE EN DESSOUS
    // ---------------------------------------------------------
    if (!isOpen) return null;

    const handleShare = () => {
        const text = `I just hit a ${streakData?.currentCount || 0}-day on-chain streak on Base with Forgenix! 🔥\n\nDeploy your first contract today:`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://forgenix.com`, '_blank');
    };

    const handleDeploy = async () => {
        if (!address) return alert("Veuillez connecter votre wallet.");

        setIsDeploying(true);
        try {
            // Appel au Smart Contract via useDeployer
            const success = await deploy({
                activeTab: 'message',
                msgText: choice,
                feeWei: BigInt(0), 
                isAdvancedMode: false,
                requestWhiteLabel: false,
                userCredits: 0,
                address: address
            } as any); 

            // Mise à jour de la BDD SEULEMENT SI le déploiement a réussi
            if (success) {
                console.log("Transaction confirmée, mise à jour de la streak...");
                await updateStreak(); 
            } else {
                throw new Error("Le déploiement a échoué.");
            }

        } catch (error) {
            console.error("Erreur lors du processus:", error);
            // On peut enlever l'alert ici si useDeployer gère déjà l'affichage des erreurs
        } finally {
            setIsDeploying(false);
        }
    };

    return createPortal(
        // ... (votre code d'affichage de la modale ne change pas)
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-md rounded-2xl sm:rounded-3xl border border-card shadow-2xl p-5 sm:p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* ... le reste de la modale ... */}
                
                <div className="relative z-10">
                    <DailyStreakHeader
                        currentStreak={streakData?.currentCount || 0}
                        onClose={onClose}
                        onShare={handleShare}
                    />

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
        document.body
    );
}