import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    // We ensure the main container uses the element background color
    <div className="flex h-screen text-foreground font-sans overflow-hidden bg-body">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-body">
        <Topbar title={title} />
        
        {/* 
          DASHBOARD CONTENT BOX:
          We add 'bg-background' and 'rounded-tl-2xl' to create that elegant, 
          smooth rounded corner at the top-left of the main workspace.
        */}
        <div className="flex-1 rounded-tl-2xl overflow-y-auto p-8 border-t border border-card bg-background">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}