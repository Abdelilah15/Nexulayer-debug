'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Airdrop, AirdropTask, Investor } from '@/app/lib/airdrops';
import StepOneInfo from './StepOneInfo';
import StepTwoTasks from './StepTwoTasks';
import StepThreeReview from './StepThreeReview';

type AirdropFormProps = {
  initialData?: Airdrop;
};

export default function AirdropForm({ initialData }: AirdropFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const parseJSONField = <T,>(field: any): T[] => {
    if (!field) return [];
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch { return []; }
    }
    return field;
  };

  const [formData, setFormData] = useState<Partial<Airdrop>>({
    ...initialData,
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    logo: initialData?.logo || '',
    description: initialData?.description || '',
    situation: initialData?.situation || '',
    is_rewarding: initialData?.is_rewarding || false,
    category: initialData?.category || 'DeFi',
    status: initialData?.status || 'Potential',
    raised_funds: initialData?.raised_funds || '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    discord: initialData?.discord || '',
    telegram: initialData?.telegram || '',
    github: initialData?.github || '',
    whitepaper: initialData?.whitepaper || '',
    gitbook: initialData?.gitbook || '',
    linkedin: initialData?.linkedin || '',
    medium: initialData?.medium || '',
    investors: parseJSONField<Investor>(initialData?.investors),
    tasks: parseJSONField<AirdropTask>(initialData?.tasks),
  });

  // 🌟 NEW: Handle Airdrop Deletion / Cancellation
  const handleCancelOrDelete = async () => {
    if (!isEditing) {
      router.push('/admin/airdrops');
      return;
    }

    if (!confirm('Are you sure you want to delete this airdrop? This action cannot be undone.')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/airdrops/${initialData.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete airdrop');
      router.push('/admin/airdrops');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    let finalFunds = formData.raised_funds?.trim() || '';
    if (finalFunds && !finalFunds.startsWith('$')) {
      finalFunds = `$ ${finalFunds}`;
    }

    const payload = {
      ...formData,
      raised_funds: finalFunds,
      investors: JSON.stringify(formData.investors),
      tasks: JSON.stringify(formData.tasks),
    };

    try {
      const url = isEditing ? `/api/admin/airdrops/${initialData.id}` : '/api/admin/airdrops';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Save error');
      }

      router.push('/admin/airdrops');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="pb-20">
      {/* HEADER WIZARD */}
      <div className="flex items-center justify-between mb-8 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className={`flex items-center gap-3 ${currentStep === stepNumber ? 'text-white' : 'text-neutral-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep === stepNumber ? 'bg-white text-black' : 'bg-neutral-800'}`}>
                {stepNumber}
              </div>
              <span className="hidden sm:inline font-medium">
                {stepNumber === 1 ? 'Information' : stepNumber === 2 ? 'Quests' : 'Review'}
              </span>
              {stepNumber !== 3 && <div className="hidden sm:block w-8 h-px bg-neutral-800 mx-2" />}
            </div>
          ))}
        </div>

        {/* 🌟 NEW: DELETE / CANCEL BUTTON 🌟 */}
        <button
          onClick={handleCancelOrDelete}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            isEditing
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          {isEditing ? '🗑️ Delete Airdrop' : '✕ Cancel'}
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}

      {/* RENDER STEPS */}
      {currentStep === 1 && (
        <StepOneInfo formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(2)} />
      )}

      {currentStep === 2 && (
        <StepTwoTasks formData={formData} setFormData={setFormData} onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />
      )}

      {currentStep === 3 && (
        <StepThreeReview formData={formData} onBack={() => setCurrentStep(2)} onSubmit={handleSubmit} isLoading={isLoading} isEditing={isEditing} />
      )}
    </div>
  );
}
