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

  // Fonction utilitaire pour insérer de la syntaxe Markdown à la position du curseur
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

    // Repositionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Gestion de l'upload d'image direct dans l'éditeur
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
        // Insère l'image en Markdown directement là où se trouve le curseur
        insertFormatting(`![Image](${result.url})`, '');
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
      // Réinitialise l'input file pour pouvoir uploader la même image si besoin
      e.target.value = '';
    }
  };

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 focus-within:border-neutral-500 transition-colors">
      {/* Barre d'outils (Toolbar) */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900 px-3 py-2 border-b border-neutral-800">
        <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded font-bold" title="Gras">
          B
        </button>
        <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded italic" title="Italique">
          I
        </button>
        <div className="w-px h-5 bg-neutral-700 mx-1"></div> {/* Séparateur */}

        <button type="button" onClick={() => insertFormatting('### ', '')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded font-semibold" title="Titre">
          H3
        </button>
        <button type="button" onClick={() => insertFormatting('- ', '')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded" title="Liste à puces">
          • Liste
        </button>
        <div className="w-px h-5 bg-neutral-700 mx-1"></div>

        <button type="button" onClick={() => insertFormatting('[Texte du lien](', ')')} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded" title="Ajouter un lien">
          🔗 Lien
        </button>

        {/* Bouton d'upload d'image caché sous un label */}
        <label className={`p-1.5 rounded cursor-pointer flex items-center gap-2 ${isUploading ? 'text-neutral-500' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`} title="Ajouter une image">
          {isUploading ? '⏳ Upload...' : '🖼️ Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>
      </div>

      {/* Zone de texte */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Rédigez votre contenu en Markdown..."}
        className="w-full bg-transparent p-4 text-white outline-none font-mono text-sm resize-y min-h-[150px]"
        required
      />
    </div>
  );
}
