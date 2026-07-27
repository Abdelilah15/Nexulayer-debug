'use client';

import { useRef, useState } from 'react';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // --- STANDARD FORMATTING LOGIC ---
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);

    const newText = `${textBefore}${before}${selectedText}${after}${textAfter}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();

      if (result.url) {
        insertFormatting(`![Image](${result.url})`, '');
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // --- LINK MODAL LOGIC ---
  const handleOpenLinkModal = () => {
    const el = textareaRef.current;
    if (!el) return;

    if (el.selectionStart === el.selectionEnd) {
      alert('Please select a word or phrase first.');
      return;
    }

    setSelection({ start: el.selectionStart, end: el.selectionEnd });
    setLinkUrl('');
    setIsModalOpen(true);
  };

  const handleSaveLink = () => {
    if (!linkUrl) return;

    const beforeText = value.substring(0, selection.start);
    const selectedText = value.substring(selection.start, selection.end);
    const afterText = value.substring(selection.end);

    const newText = `${beforeText}[${selectedText}](${linkUrl})${afterText}`;
    onChange(newText);
    setIsModalOpen(false);
  };

  return (
    <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 focus-within:border-neutral-500 transition-colors">

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900 px-3 py-2 border-b border-neutral-800">
        <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </button>

        <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Italic">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
        </button>

        <div className="w-px h-5 bg-neutral-700 mx-1"></div>

        <button type="button" onClick={() => insertFormatting('### ', '')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><path d="M4 18V6"/><path d="M20 18V6"/></svg>
        </button>

        <button type="button" onClick={() => insertFormatting('- ', '')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Bullet List">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
        </button>

        <div className="w-px h-5 bg-neutral-700 mx-1"></div>

        <button type="button" onClick={handleOpenLinkModal} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors" title="Add Link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>

        <label className={`p-1.5 rounded cursor-pointer flex items-center transition-colors ${isUploading ? 'text-neutral-500' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`} title="Upload Image">
          {isUploading ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>
      </div>

      {/* TEXT AREA */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Write your step content here in Markdown..."}
        className="w-full bg-transparent p-4 text-white outline-none font-mono text-sm resize-y min-h-[150px]"
        required
      />

      {/* LINK MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 w-full max-w-sm shadow-2xl">
            <h4 className="text-white font-medium mb-3 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Insert Link
            </h4>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLink}
                className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
