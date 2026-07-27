'use client';

import { Airdrop, AirdropTask, AirdropStep } from '@/app/lib/airdrops';
import MarkdownEditor from '@/components/airdrops/MarkdownEditor';

type Props = {
  formData: Partial<Airdrop>;
  setFormData: (data: Partial<Airdrop>) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function StepTwoTasks({ formData, setFormData, onBack, onNext }: Props) {
  const addTask = () => {
    const currentTasks = formData.tasks || [];
    setFormData({
      ...formData,
      tasks: [{ title: '', status: 'Open', deadline: null, reward_type: 'Points', steps: [] }, ...currentTasks]
    });
  };

  const updateTask = (taskIndex: number, field: keyof AirdropTask, value: any) => {
    const newTasks = [...(formData.tasks || [])];
    newTasks[taskIndex] = { ...newTasks[taskIndex], [field]: value };
    setFormData({ ...formData, tasks: newTasks });
  };

  const removeTask = (taskIndex: number) => {
    const newTasks = [...(formData.tasks || [])];
    newTasks.splice(taskIndex, 1);
    setFormData({ ...formData, tasks: newTasks });
  };

  const addStepToTask = (taskIndex: number) => {
    const newTasks = [...(formData.tasks || [])];
    const task = newTasks[taskIndex];
    task.steps = [...(task.steps || []), { step_order: (task.steps?.length || 0) + 1, title: '', content: '' }];
    setFormData({ ...formData, tasks: newTasks });
  };

  const updateStepInTask = (taskIndex: number, stepIndex: number, field: keyof AirdropStep, value: string) => {
    const newTasks = [...(formData.tasks || [])];
    newTasks[taskIndex].steps[stepIndex] = { ...newTasks[taskIndex].steps[stepIndex], [field]: value };
    setFormData({ ...formData, tasks: newTasks });
  };

  const removeStepFromTask = (taskIndex: number, stepIndex: number) => {
    const newTasks = [...(formData.tasks || [])];
    newTasks[taskIndex].steps.splice(stepIndex, 1);
    newTasks[taskIndex].steps.forEach((s: any, i: number) => (s.step_order = i + 1));
    setFormData({ ...formData, tasks: newTasks });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Quests & Tasks</h2>
          <button type="button" onClick={addTask} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg">
            + Add Task
          </button>
        </div>

        <div className="space-y-8">
          {formData.tasks?.map((task: AirdropTask, taskIdx: number) => (
            <div key={taskIdx} className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl relative">
              <div className="absolute top-5 right-5">
                <button type="button" onClick={() => removeTask(taskIdx)} className="text-red-400 hover:text-red-300 text-sm font-medium">Remove Task</button>
              </div>

              <h3 className="text-white font-bold mb-4 text-lg">Task {taskIdx + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Task Title *</label>
                  <input type="text" placeholder="e.g., Connect Wallet & Bridge" value={task.title} onChange={e => updateTask(taskIdx, 'title', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Reward Type</label>
                  <input type="text" placeholder="e.g., Points, NFT, Waitlist" value={task.reward_type} onChange={e => updateTask(taskIdx, 'reward_type', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Status</label>
                  <select value={task.status} onChange={e => updateTask(taskIdx, 'status', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none text-sm">
                    <option value="Open">🟢 Open</option>
                    <option value="Closed">🔴 Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Deadline</label>
                  <div className="flex gap-2">
                    <input type="date" value={task.deadline || ''} onChange={e => updateTask(taskIdx, 'deadline', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none text-sm" disabled={task.deadline === null} />
                    <button type="button" onClick={() => updateTask(taskIdx, 'deadline', task.deadline === null ? '' : null)} className={`px-3 py-2 rounded-lg text-xs font-medium border ${task.deadline === null ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                      No Limit
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-400 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Liquidity, Social, Testnet"
                    value={task.tags || ''}
                    onChange={e => updateTask(taskIdx, 'tags', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pl-6 border-l-2 border-neutral-800 space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-neutral-300 font-medium text-sm">Steps for this task</h4>
                  <button type="button" onClick={() => addStepToTask(taskIdx)} className="text-xs px-3 py-1.5 bg-neutral-800 text-white rounded-md hover:bg-neutral-700">+ Add Step</button>
                </div>

                {task.steps?.map((step: AirdropStep, stepIdx: number) => (
                  <div key={stepIdx} className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 relative">
                    <button type="button" onClick={() => removeStepFromTask(taskIdx, stepIdx)} className="absolute top-4 right-4 text-red-400 text-xs">✕</button>
                    <p className="text-xs text-neutral-500 font-bold mb-2">STEP {step.step_order}</p>
                    <input type="text" placeholder="Step Title" value={step.title} onChange={e => updateStepInTask(taskIdx, stepIdx, 'title', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white outline-none text-sm mb-3" />
                    <MarkdownEditor value={step.content} onChange={(val) => updateStepInTask(taskIdx, stepIdx, 'content', val)} />
                  </div>
                ))}
                {(!task.steps || task.steps.length === 0) && <p className="text-xs text-neutral-600">No steps added yet.</p>}
              </div>
            </div>
          ))}
          {(!formData.tasks || formData.tasks.length === 0) && <p className="text-center text-neutral-500 py-8">No tasks created. Click "Add Task" to start.</p>}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={onBack} className="px-6 py-3 border border-neutral-700 rounded-lg text-white hover:bg-neutral-800">
          ← Back
        </button>
        <button onClick={onNext} className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200">
          Next: Review & Publish →
        </button>
      </div>
    </div>
  );
}
