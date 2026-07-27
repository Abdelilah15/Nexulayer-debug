'use client';

import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { AirdropTask } from '@/app/lib/airdrops';

export default function AirdropTasks({ tasksRaw }: { tasksRaw: any }) {
  const tasks: AirdropTask[] = useMemo(() => {
    if (!tasksRaw) return [];
    if (typeof tasksRaw === 'string') {
      try { return JSON.parse(tasksRaw); } catch { return []; }
    }
    return tasksRaw;
  }, [tasksRaw]);

  // Default to the first task (which is the most recently added based on our admin logic)
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-card border border-card rounded-xl text-secondary shadow-custom">
        No tasks available for this project yet.
      </div>
    );
  }

  const selectedTask = tasks[selectedIdx];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

      {/* LEFT COLUMN: TASK LIST */}
      <div className="md:col-span-4 lg:col-span-3">
        <h3 className="text-lg font-bold text-foreground mb-4">Available Quests</h3>

        {/* 🌟 Horizontal on Mobile, Vertical Stack on Desktop 🌟 */}
        <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden md:block md:overflow-visible md:snap-none md:space-x-0 md:space-y-3 md:pb-0">
          {tasks.map((task, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-[260px] md:w-full shrink-0 snap-start text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedIdx === idx
                  ? 'bg-card border-[#0052FF] shadow-custom'
                  : 'bg-body border-card hover:border-accent/50 hover:bg-hover text-secondary'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${task.status === 'Open' ? 'text-green-500' : 'text-red-500'}`}>
                  {task.status}
                </span>
                <span className="text-[10px] md:text-xs bg-area border border-card px-2 py-0.5 rounded text-secondary font-medium">
                  {task.reward_type}
                </span>
              </div>
              <h4 className={`font-semibold text-sm ${selectedIdx === idx ? 'text-foreground' : 'text-foreground/80'}`}>
                {task.title}
              </h4>
              {task.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.split(',').map((tag, i) => (
                    <span key={i} className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded uppercase tracking-wide whitespace-nowrap">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: STEPS FOR SELECTED TASK */}
      <div className="md:col-span-8 lg:col-span-9">
        <div className="bg-card border border-card rounded-2xl p-2 sm:p-6 shadow-custom">
          <div className="border-b border-card pb-6 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedTask.title}</h2>
              <p className="text-secondary text-sm">Follow these steps to complete the quest and earn {selectedTask.reward_type.toLowerCase()}.</p>
            </div>
          </div>

          <div className="space-y-8">
            {selectedTask.steps && selectedTask.steps.length > 0 ? (
              selectedTask.steps.map((step) => (
                <div key={step.step_order} className="relative pl-8 md:pl-10">
                  {/* Step Timeline Node */}
                  <div className="absolute left-0 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-foreground text-[#0052FF] font-black flex items-center justify-center text-xs md:text-sm border border-card">
                    {step.step_order}
                  </div>
                  {/* Connecting Line */}
                  <div className="absolute left-3 md:left-4 top-8 bottom-[-2rem] w-px bg-[#0052FF] last:hidden"></div>

                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {step.title}
                  </h3>

                  {/* 🌟 FIXED PROSE CLASSES: Removed /90 and added prose-li 🌟 */}
                  <div className="prose prose-sm md:prose-base max-w-none prose-img:rounded-xl pt-4 border-t border-card prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground text-[var(--foreground)]">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 border-b border-dotted border-current text-[#0052FF] font-bold hover:opacity-80 transition-colors no-underline"
                          >
                            {props.children}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 ml-0.5" aria-hidden="true">
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
              ))
            ) : (
              <p className="text-secondary">No specific steps defined for this task.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
