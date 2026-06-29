import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="flex h-screen text-foreground font-sans overflow-hidden bg-background">
      {/* La Sidebar n'a plus besoin d'arguments, elle se gère toute seule ! */}
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* On passe le titre à la Topbar */}
        <Topbar title={title} />
        
        <div className="flex-1 border-t border-l rounded-tl-3xl border-card overflow-y-auto p-8 bg-background">
          <div className="max-w-4xl mx-auto w-full">
            {/* Le contenu de la page s'injecte ici */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}