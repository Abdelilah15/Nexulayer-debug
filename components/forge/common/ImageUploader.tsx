'use client';
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  previewUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploader({ label, previewUrl, onImageChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-secondary mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()} 
        className="group relative flex-grow aspect-square border-2 border-dashed border-card hover:border-accent/50 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-colors bg-background"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/gif" 
          onChange={onImageChange} 
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full absolute inset-0" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
                <i className="fi fi-rr-picture"></i> Changer l'image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-secondary group-hover:text-accent transition-colors p-4 text-center">
            <i className="fi fi-rr-picture text-3xl mb-2"></i>
            <span className="text-xs font-medium bg-card px-3 py-1.5 rounded-lg group-hover:bg-accent/10">
              Importer une image
            </span>
          </div>
        )}
      </div>
    </div>
  );
}