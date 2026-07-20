'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { NexulayerLogo, NexulayerText } from '@/components/ui/NexulayerLogo';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (val: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/' || pathname === '/dashboard';
  const isSimple = pathname.includes('/deploy/simple');
  const isMessage = pathname.includes('/deploy/message');
  const isERC20 = pathname.includes('/deploy/erc20');
  const isB20 = pathname.includes('/deploy/b20');
  const isERC721 = pathname.includes('/deploy/erc721');
  const isERC1155 = pathname.includes('/deploy/erc1155');

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navigateTo = (path: string) => {
    router.push(path);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:relative top-0 left-0 h-full z-40
        flex-shrink-0 flex flex-col transition-all duration-300 bg-bar
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-22 w-72' : 'w-72'}
      `}
      >
        <div
          className={`h-16 md:h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4 md:px-6'}`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl cursor-pointer ml-2 mt-4"
            >
              <NexulayerLogo className="text-[#0052FF]" size={36} />
            </button>
          ) : (
            <>
              <div className="flex items-center mr-2">
                <button type="button" className="flex h-12 w-12 items-center justify-center">
                  <NexulayerLogo className="text-[#0052FF]" size={32} />
                </button>
                <div className="flex items-center">
                  <NexulayerText className="text-[#0052FF]" size={20} />
                </div>
              </div>

              <button
                className="md:hidden p-2 text-secondary hover:text-foreground"
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="hidden md:block text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>

        <nav className={`flex-1 overflow-y-auto py-6 space-y-2 md:space-y-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <button
            onClick={() => navigateTo('/dashboard')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isHome ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-home flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>Dashboard</span>
          </button>

          {!isCollapsed && (
            <p className="px-3 mt-5 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">The Forge</p>
          )}

          <button
            onClick={() => navigateTo('/deploy/simple')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isSimple ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-document flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>Basic Contract</span>
          </button>

          <button
            onClick={() => navigateTo('/deploy/message')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isMessage ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-edit flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>On-Chain Message</span>
          </button>

          <button
            onClick={() => navigateTo('/deploy/erc20')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isERC20 ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-coins flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>ERC-20 Token</span>
          </button>

          <button
            onClick={() => navigateTo('/deploy/b20')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isB20 ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-bolt flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>B20 Asset (Base)</span>
          </button>

          <button
            onClick={() => navigateTo('/deploy/erc721')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isERC721 ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-picture flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>NFT Collection</span>
          </button>

          <button
            onClick={() => navigateTo('/deploy/erc1155')}
            className={`cursor-pointer w-full flex items-center py-2.5 rounded-xl transition-all duration-200 ${isERC1155 ? 'bg-accent/10 text-accent' : 'text-secondary hover:bar-button-hover'} ${isCollapsed ? 'hidden md:flex justify-center px-0' : 'px-3 text-sm font-medium'}`}
          >
            <i className="fi fi-rr-box flex text-xl"></i>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : 'block'}`}>ERC-1155 Token</span>
          </button>

          <div className="mt-8">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Other Services</p>
            )}
            <p className="px-3 text-xs font-medium text-secondary">coming soon</p>
          </div>
        </nav>

        <div>
          <div
            className={`mb-1 flex items-center px-5 py-4 ${isCollapsed ? 'hidden md:flex flex-col gap-4' : 'gap-4'}`}
          >
            <ThemeToggle />
            <span className={`text-sm font-medium text-secondary ${isCollapsed ? 'md:hidden' : 'block'}`}>
              Change Theme
            </span>
          </div>

          {/* 3. FOOTER */}
          <div
            className={`border-t border-card pt-3 pb-6 ${isCollapsed ? 'px-2 hidden md:flex flex-col items-center gap-4' : 'px-5 block'}`}
          >
            <div
              className={`flex justify-center gap-4 text-xs text-secondary mb-4 ${isCollapsed ? 'md:hidden' : 'flex'}`}
            >
              <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                Privacy
              </a>
              <a
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                Terms
              </a>
            </div>

            <div className={`flex ${isCollapsed ? 'flex-col gap-4' : 'justify-center gap-5 mb-4'}`}>
              <a
                href="https://x.com/Nexulayer"
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="text-secondary hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
