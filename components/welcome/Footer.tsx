import Link from "next/link";
import React from "react";
import Nexulayer, { NexulayerLogo, NexulayerText } from "@/components/ui/NexulayerLogo";

export default function Footer() {
  return (
    <footer className="relative flex min-h-screen flex-col items-center justify-end bg-[#0052FF] pb-4 pt-8 sm:pb-10 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#0052ff]/10 blur-[180px]" />
      </div>

      <div className="relative w-full max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(0,82,255,0.08)] sm:rounded-[42px]">
          <div className="border-b border-slate-100 px-4 pb-5 pt-6 sm:px-10 sm:pb-10 sm:pt-16 lg:px-20 lg:pt-20">
            <div className="max-w-4xl">
              <div className="mb-3 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <div className="flex items-center gap-1.5 lg:hidden">
                  <NexulayerLogo className="text-[#0052FF]" size={40} />
                  <NexulayerText className="text-[#0052FF]" size={26} hideLetters={["N"]} />
                </div>
                <div className="hidden items-center gap-3 lg:flex">
                  <NexulayerLogo className="text-[#0052FF]" size={128} />
                  <NexulayerText className="text-[#0052FF]" size={82} hideLetters={["N"]} />
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
                Ready to build
                <br />
                smart contracts on Base?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
                Deploy B20, ERC20, ERC721A, ERC1155 token and NFT contracts from one modern platform.
              </p>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center rounded-full bg-[#0052FF] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1b67ff] hover:shadow-[0_15px_35px_rgba(0,82,255,.25)] sm:mt-10 sm:px-8 sm:py-4 sm:text-base"
              >
                Launch App
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-7 px-4 py-6 sm:grid-cols-1 sm:gap-14 sm:px-10 sm:py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-20">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:mb-6">
                Product
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/deploy">Deploy</FooterLink>
                <FooterLink href="/portfolio" disabled>Portfolio</FooterLink>
                <FooterLink href="/analytics" disabled>Analytics</FooterLink>
                <FooterLink href="/pricing" disabled>Pricing</FooterLink>
                <FooterLink href="/explorer" disabled>Explorer</FooterLink>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:mb-6">
                Contracts
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <FooterLink href="/deploy/b20">B20</FooterLink>
                <FooterLink href="/deploy/erc20">ERC20</FooterLink>
                <FooterLink href="/deploy/erc721">ERC721A</FooterLink>
                <FooterLink href="/deploy/erc1155">ERC1155</FooterLink>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-5 hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:mb-6 sm:block">
                Community
              </h3>

              <div className="flex flex-wrap items-center gap-5 sm:hidden">
                <span className="cursor-not-allowed text-slate-400 opacity-50" title="Coming soon">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
                    <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                  </svg>
                </span>

                <Link
                  href="https://x.com/Nexulayer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 transition-colors hover:text-[#0052FF]"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </Link>

                <span className="cursor-not-allowed text-slate-400 opacity-50" title="Coming soon">
                  <svg className="h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </span>

                <span className="cursor-not-allowed text-slate-400 opacity-50" title="Coming soon">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                </span>

                <span className="cursor-not-allowed text-slate-400 opacity-50" title="Coming soon">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M172.2 226.8c-14.6-2.9-28.2 8.9-28.2 23.8V301c0 10.2 7.1 18.4 16.7 22 18.2 6.8 31.3 24.4 31.3 45 0 26.5-21.5 48-48 48s-48-21.5-48-48V120c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v248c0 89.5 82.1 160.2 175 140.7 54.4-11.4 98.3-55.4 109.7-109.7 17.4-82.9-37-157.2-112.5-172.2zM209 0c-9.2-.5-17 6.8-17 16v31.6c0 8.5 6.6 15.5 15 15.9 129.4 7 233.4 112 240.9 241.5.5 8.4 7.5 15 15.9 15h32.1c9.2 0 16.5-7.8 16-17C503.4 139.8 372.2 8.6 209 0zm.3 96c-9.3-.7-17.3 6.7-17.3 16.1v32.1c0 8.4 6.5 15.3 14.8 15.9 76.8 6.3 138 68.2 144.9 145.2.8 8.3 7.6 14.7 15.9 14.7h32.2c9.3 0 16.8-8 16.1-17.3-8.4-110.1-96.5-198.2-206.6-206.7z" />
                  </svg>
                </span>
              </div>

              <div className="hidden sm:block sm:space-y-4">
                <FooterLink href="#" disabled>
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 opacity-40 grayscale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
                      <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                    </svg>
                    Discord
                  </span>
                </FooterLink>

                <FooterLink href="https://x.com/Nexulayer" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                    X (Twitter)
                  </span>
                </FooterLink>

                <FooterLink href="#" disabled>
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 opacity-40 grayscale" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <title>Telegram</title>
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Telegram
                  </span>
                </FooterLink>

                <FooterLink href="#" disabled>
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 opacity-40 grayscale" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                    </svg>
                    YouTube
                  </span>
                </FooterLink>

                <FooterLink href="#" disabled>
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 opacity-40 grayscale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M172.2 226.8c-14.6-2.9-28.2 8.9-28.2 23.8V301c0 10.2 7.1 18.4 16.7 22 18.2 6.8 31.3 24.4 31.3 45 0 26.5-21.5 48-48 48s-48-21.5-48-48V120c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v248c0 89.5 82.1 160.2 175 140.7 54.4-11.4 98.3-55.4 109.7-109.7 17.4-82.9-37-157.2-112.5-172.2zM209 0c-9.2-.5-17 6.8-17 16v31.6c0 8.5 6.6 15.5 15 15.9 129.4 7 233.4 112 240.9 241.5.5 8.4 7.5 15 15.9 15h32.1c9.2 0 16.5-7.8 16-17C503.4 139.8 372.2 8.6 209 0zm.3 96c-9.3-.7-17.3 6.7-17.3 16.1v32.1c0 8.4 6.5 15.3 14.8 15.9 76.8 6.3 138 68.2 144.9 145.2.8 8.3 7.6 14.7 15.9 14.7h32.2c9.3 0 16.8-8 16.1-17.3-8.4-110.1-96.5-198.2-206.6-206.7z" />
                    </svg>
                    Blog
                  </span>
                </FooterLink>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-4 py-4 text-sm text-slate-500 sm:gap-6 sm:px-10 sm:py-8 lg:flex-row lg:px-20">
            <div>© {new Date().getFullYear()} Nexulayer</div>
            <div className="font-medium text-[#0052FF]">Be active on Base.</div>
            <div className="flex gap-4 sm:gap-6">
              <FooterLink href="/privacy" disabled>Privacy</FooterLink>
              <FooterLink href="/terms" disabled>Terms</FooterLink>
              <FooterLink href="/cookies" disabled>Cookies</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  disabled = false,
  target,
  rel,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  target?: string;
  rel?: string;
}) {
  if (disabled) {
    return (
      <span
        className="block cursor-not-allowed text-[15px] font-medium text-slate-400 opacity-60"
        title="Coming soon"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="block text-[15px] font-medium text-slate-700 transition-all duration-200 hover:translate-x-1 hover:text-[#0052FF]"
    >
      {children}
    </Link>
  );
}
