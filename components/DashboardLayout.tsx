'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  // Nouvel état pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bar overflow-hidden font-sans">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar 
          title={title} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        {/* 
          - border-t est toujours là
          - border-l n'apparaît que sur sm:
          - l'arrondi en haut à gauche n'apparaît que sur sm: / md:
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-background border-t border-card sm:border-l rounded-tl-none sm:rounded-tl-2xl md:rounded-tl-3xl shadow-sm">
          <div className="max-w-7xl w-full mx-auto pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}