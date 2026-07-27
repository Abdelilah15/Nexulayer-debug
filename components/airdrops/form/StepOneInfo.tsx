'use client';

import { useState } from 'react';
import { Airdrop, Investor } from '@/app/lib/airdrops';

type Props = {
  formData: Partial<Airdrop>;
  setFormData: (data: Partial<Airdrop>) => void;
  onNext: () => void;
};

export default function StepOneInfo({ formData, setFormData, onNext }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  // --- LOGO UPLOAD LOGIC ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create FormData to send the file
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      // Pointing to your existing upload API route
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Assuming your API returns { url: 'https://...' }
      // Adjust 'data.url' if your API returns the link under a different key (e.g., data.fileUrl)
      setFormData({ ...formData, logo: data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading the logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // --- INVESTOR LOGIC ---
  const addInvestor = () => {
    const currentInvestors = formData.investors || [];
    setFormData({ ...formData, investors: [...currentInvestors, { name: '', logo: '', tier: 'Others' }] });
  };

  const updateInvestor = (index: number, field: keyof Investor, value: string) => {
    const newInvestors = [...(formData.investors || [])];
    newInvestors[index] = { ...newInvestors[index], [field]: value };
    setFormData({ ...formData, investors: newInvestors });
  };

  const handleInvestorLogoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      // Met à jour l'URL du logo pour l'investisseur spécifique
      updateInvestor(index, 'logo', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Erreur lors de l'upload du logo de l'investisseur.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeInvestor = (index: number) => {
    const newInvestors = [...(formData.investors || [])];
    newInvestors.splice(index, 1);
    setFormData({ ...formData, investors: newInvestors });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-white">Project Details</h2>

        {/* 🌟 PROJECT LOGO UPLOAD SECTION 🌟 */}
        <div className="mb-8 flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-950 flex items-center justify-center overflow-hidden group">
            {formData.logo ? (
              <img src={formData.logo} alt="Project Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-600 text-xs text-center px-2">No Logo</span>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
            </div>

            {/* Hidden File Input covering the square */}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Project Logo</h3>
            <p className="text-neutral-500 text-sm mb-2">
              Upload a square image (PNG, JPG). Recommended size: 400x400px.
            </p>
            {isUploading && <span className="text-blue-400 text-sm animate-pulse">Uploading image...</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Slug (URL) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Project Category</label>
            <select
              value={formData.category || 'DeFi'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 appearance-none"
            >
              <option value="DeFi">DeFi</option>
              <option value="Blockchain">Blockchain (L1/L2)</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="GameFi">GameFi</option>
              <option value="NFT">NFT</option>
              <option value="SocialFi">SocialFi</option>
              <option value="Wallet">Wallet</option>
              <option value="Exchange / DEX">Exchange / DEX</option>
              <option value="AI">AI</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500"
            />
          </div>
          <div className="flex flex-col md:col-span-2 gap-2">
            <label className="block text-sm font-bold text-blue-400 mb-2">
              Current Situation
            </label>
            <input
              type="text"
              placeholder="e.g., Claim is live until August 30! Eligible users can claim now."
              value={formData.situation || ''}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              className="w-full bg-blue-950/20 border border-blue-500/30 rounded-lg p-3 text-white outline-none focus:border-blue-500 placeholder-neutral-600"
            />
            <div className="md:col-span-2 flex items-center justify-between bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <div>
                <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                  <span className="text-green-500">●</span> Add to Rewarding Section
                </h3>
                <p className="text-neutral-400 text-sm">
                  Turn this on to manually feature this project in the Rewarding carousel on the home page.
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_rewarding: !formData.is_rewarding })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  formData.is_rewarding ? 'bg-green-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formData.is_rewarding ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Raised Funds (e.g., $ 7.00M)</label>
            <input
              type="text"
              placeholder="$ 7.00M"
              value={formData.raised_funds || ''}
              onChange={(e) => setFormData({ ...formData, raised_funds: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Airdrop Status</label>
            <select
              value={formData.status || 'Potential'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 appearance-none"
            >
              <option value="Potential">🟡 Potential</option>
              <option value="Confirmed">🟢 Confirmed</option>
              <option value="Snapshot">📸 Snapshot</option>
              <option value="Verification">🔍 Verification</option>
              <option value="Reward Available">🏆 Reward Available</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-6 border-t border-neutral-800 mt-2">
            <h3 className="text-lg font-medium text-white mb-4">Links & Socials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Website</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Twitter / X</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Discord</label>
                <input
                  type="url"
                  placeholder="https://discord.gg/..."
                  value={formData.discord || ''}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Telegram</label>
                <input
                  type="url"
                  placeholder="https://t.me/..."
                  value={formData.telegram || ''}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">GitHub</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.github || ''}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Whitepaper</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.whitepaper || ''}
                  onChange={(e) => setFormData({ ...formData, whitepaper: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Gitbook</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.gitbook || ''}
                  onChange={(e) => setFormData({ ...formData, gitbook: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/..."
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Medium</label>
                <input
                  type="url"
                  placeholder="https://medium.com/..."
                  value={formData.medium || ''}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none focus:border-neutral-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INVESTORS SECTION */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Investors</h2>
          <button
            type="button"
            onClick={addInvestor}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg"
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {formData.investors?.map((investor: Investor, index: number) => (
            <div
              key={index}
              className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800 relative"
            >
              <select
                value={investor.tier}
                onChange={(e) => updateInvestor(index, 'tier', e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-white rounded p-2 text-sm outline-none"
              >
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
                <option value="Tier 4">Tier 4</option>
                <option value="Tier 5">Tier 5</option>
                <option value="Others">Others</option>
              </select>
              <input
                type="text"
                placeholder="Investor Name"
                value={investor.name}
                onChange={(e) => updateInvestor(index, 'name', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 text-white rounded p-2 text-sm outline-none"
              />

              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Logo URL"
                  value={investor.logo}
                  onChange={(e) => updateInvestor(index, 'logo', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded p-2 text-sm outline-none"
                />

                <div className="relative">
                  <button
                    type="button"
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-2 rounded text-xs font-medium whitespace-nowrap border border-neutral-700 transition-colors"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInvestorLogoUpload(index, e)}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeInvestor(index)}
                className="text-red-400 hover:text-red-300 text-sm p-2"
              >
                ✕
              </button>
            </div>
          ))}
          {(!formData.investors || formData.investors.length === 0) && (
            <p className="text-neutral-500 text-center py-4 text-sm">No investors added.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
        >
          Next: Quests & Tasks →
        </button>
      </div>
    </div>
  );
}
