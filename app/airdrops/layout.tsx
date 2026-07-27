'use client';
import React, { useState } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';

export default function AirdropsLayout({ children }: { children: React.ReactNode }) {
  // 🌟 ADDED: State to control the mobile menu 🌟
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans transition-colors duration-300">
      {/* Intégration de la Sidebar commune à Nexulayer */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Intégration de la Topbar commune à Nexulayer */}
        <Topbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Zone de contenu principal, avec défilement indépendant */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
