'use client';

import { Airdrop, Investor } from '@/app/lib/airdrops';
import ReactMarkdown from 'react-markdown';

type Props = {
  formData: Partial<Airdrop>;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEditing: boolean;
};

export default function StepThreeReview({ formData, onBack, onSubmit, isLoading, isEditing }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-neutral-800 pb-4">
          Review & Publish
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
            <p className="text-xs text-neutral-500 mb-4 uppercase tracking-wider">Project</p>
            <div className="flex items-center gap-4 mb-4">
              {formData.logo ? (
                <img src={formData.logo} alt="logo" className="w-12 h-12 rounded-lg border border-neutral-800" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center font-bold">?</div>
              )}
              <div>
                <h3 className="font-bold text-lg">{formData.title || 'Project Name'}</h3>
                <p className="text-sm text-neutral-400">{formData.category}</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
            <p className="text-xs text-neutral-500 mb-4 uppercase tracking-wider">Description</p>
            <p className="text-sm text-neutral-300 line-clamp-4">
              {formData.description || 'No description provided.'}
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5">
            <p className="text-xs text-neutral-500 mb-4 uppercase tracking-wider">Funding</p>
            <p className="text-sm text-neutral-400 mb-1">Raised Funds</p>
            <p className="font-mono text-xl font-bold text-white mb-4">{formData.raised_funds || 'N/A'}</p>

            <p className="text-sm text-neutral-400 mb-2">Investors Preview</p>
            <div className="flex flex-col gap-2">
              {formData.investors?.slice(0, 2).map((inv: Investor, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                  {inv.logo ? <img src={inv.logo} className="w-5 h-5 rounded-full" alt="logo" /> : <div className="w-5 h-5 rounded-full bg-neutral-800" />}
                  {inv.name} <span className="text-xs text-neutral-500">({inv.tier})</span>
                </div>
              ))}
              {formData.investors && formData.investors.length > 2 && (
                <p className="text-xs text-blue-400">+ {formData.investors.length - 2} remaining</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Quests Preview ({formData.tasks?.length || 0} tasks)
          </h3>
          {formData.tasks?.map((task: any, idx: number) => (
            <div key={idx} className="mb-6 bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
              <h4 className="font-bold text-white mb-2">{task.title}</h4>
              <div className="pl-4 border-l border-neutral-800">
                {task.steps?.map((step: any, sIdx: number) => (
                  <div key={sIdx} className="mb-2">
                    <p className="font-medium text-neutral-400 text-sm">Step {step.step_order}: {step.title}</p>
                    <div className="prose prose-invert prose-sm max-w-none opacity-80">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 border-b border-dotted border-current text-white hover:text-blue-400 transition-colors no-underline"
                            >
                              {props.children}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3 ml-0.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
                              </svg>
                            </a>
                          )
                        }}
                      >
                        {step.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={onBack} disabled={isLoading} className="px-6 py-3 border border-neutral-700 rounded-lg text-white hover:bg-neutral-800">
          ← Edit (Back)
        </button>
        <button onClick={onSubmit} disabled={isLoading} className="px-8 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors">
          {isLoading ? 'Publishing...' : isEditing ? 'Update Airdrop' : 'Publish Airdrop'}
        </button>
      </div>
    </div>
  );
}
