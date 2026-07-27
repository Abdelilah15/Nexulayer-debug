import { Airdrop } from '@/app/lib/airdrops';

type Props = {
  airdrop: Airdrop;
};

export default function ProjectCard({ airdrop }: Props) {
  return (
    <div className="bg-card border border-card rounded-2xl p-6 shadow-custom flex flex-col">
      <p className="text-xs text-secondary mb-6 uppercase tracking-wider font-semibold border-b border-card pb-2">
        Project
      </p>
      <div className="flex items-start gap-4 mb-6">
        {airdrop.logo ? (
          <img
            src={airdrop.logo}
            alt={airdrop.title}
            className="w-16 h-16 rounded-2xl object-cover border border-card shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-area flex items-center justify-center text-2xl font-bold border border-card text-foreground shadow-sm">
            {airdrop.title.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{airdrop.title}</h1>
          <p className="text-secondary font-medium">{airdrop.category || 'DeFi'}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
  {airdrop.website && (
    <a
      href={airdrop.website}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C23.732 2 30 8.26801 30 16C30 23.732 23.732 30 16 30C8.26801 30 2 23.732 2 16C2 8.26801 8.26801 2 16 2ZM11.3975 21C11.6711 22.6516 12.0743 24.1304 12.5742 25.3574C13.0574 26.5434 13.6204 27.4696 14.2197 28.0918C14.8177 28.7126 15.4189 29 16 29C16.5811 29 17.1823 28.7126 17.7803 28.0918C18.3796 27.4696 18.9426 26.5434 19.4258 25.3574C19.9257 24.1304 20.3289 22.6516 20.6025 21H11.3975ZM3.99707 21C5.64244 24.9453 9.17571 27.9056 13.4688 28.7529C12.7651 28.0109 12.1521 26.9732 11.6475 25.7344C11.0999 24.3903 10.669 22.782 10.3848 21H3.99707ZM21.6152 21C21.331 22.782 20.9001 24.3903 20.3525 25.7344C19.8477 26.9734 19.2341 28.0109 18.5303 28.7529C22.8237 27.9059 26.3574 24.9456 28.0029 21H21.6152ZM3.62695 12C3.21988 13.2601 3 14.6044 3 16C3 17.3956 3.21988 18.7399 3.62695 20H10.2422C10.0848 18.7314 10 17.3883 10 16C10 14.6117 10.0848 13.2686 10.2422 12H3.62695ZM11.25 12C11.0882 13.2591 11 14.6027 11 16C11 17.3973 11.0882 18.7409 11.25 20H20.75C20.9118 18.7409 21 17.3973 21 16C21 14.6027 20.9118 13.2591 20.75 12H11.25ZM21.7578 12C21.9152 13.2686 22 14.6117 22 16C22 17.3883 21.9152 18.7314 21.7578 20H28.373C28.7801 18.7399 29 17.3956 29 16C29 14.6044 28.7801 13.2601 28.373 12H21.7578ZM13.4688 3.24609C9.17562 4.09333 5.64246 7.05465 3.99707 11H10.3848C10.669 9.21801 11.0999 7.60966 11.6475 6.26562C12.1523 5.02656 12.7649 3.98815 13.4688 3.24609ZM16 3C15.4189 3 14.8177 3.28739 14.2197 3.9082C13.6204 4.53038 13.0574 5.45661 12.5742 6.64258C12.0743 7.86958 11.6711 9.34842 11.3975 11H20.6025C20.3289 9.34842 19.9257 7.86958 19.4258 6.64258C18.9426 5.45661 18.3796 4.53038 17.7803 3.9082C17.1823 3.28739 16.5811 3 16 3ZM18.5303 3.24609C19.2343 3.98818 19.8476 5.02629 20.3525 6.26562C20.9001 7.60966 21.331 9.21801 21.6152 11H28.0029C26.3574 7.05436 22.8238 4.09308 18.5303 3.24609Z" fill="currentColor"/>
      </svg>
      Website
    </a>
  )}
  {airdrop.twitter && (
    <a
      href={airdrop.twitter}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M9.23677 7.004L14.0763 1.49939H12.9295L8.72732 6.27897L5.37105 1.49939H1.5L6.57533 8.72696L1.5 14.4994H2.64688L7.08449 9.45199L10.6289 14.4994H14.5L9.23648 7.004H9.23677ZM7.66595 8.79063L7.15172 8.07093L3.06012 2.34418H4.82166L8.12363 6.96585L8.63787 7.68555L12.93 13.693H11.1685L7.66595 8.79091V8.79063Z"/>
      </svg>
      Twitter
    </a>
  )}
  {airdrop.discord && (
    <a
      href={airdrop.discord}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
        <path d="M100,140a8,8,0,1,1-8-8A8,8,0,0,1,100,140Zm64-8a8,8,0,1,0,8,8A8,8,0,0,0,164,132Zm72.83,57.25-67,29.71a12.36,12.36,0,0,1-5,1,12.13,12.13,0,0,1-11.38-7.88l-9.15-24.81c-5.36.45-10.81.69-16.34.69s-11-.24-16.34-.69l-9.15,24.81A12.13,12.13,0,0,1,91.13,220a12.36,12.36,0,0,1-5-1l-67-29.71a12,12,0,0,1-6.8-13.88L41.9,59a12.06,12.06,0,0,1,9.77-8.91l36.06-5.92a12.18,12.18,0,0,1,13.73,8.91l4.12,16.22a195.47,195.47,0,0,1,44.84,0l4.12-16.22a12.18,12.18,0,0,1,13.73-8.91l36.06,5.92A12.06,12.06,0,0,1,214.1,59l29.53,116.38A12,12,0,0,1,236.83,189.25Zm-1-11.91L206.35,61A4.07,4.07,0,0,0,203,58L167,52.05a4.15,4.15,0,0,0-4.69,3L158.4,70.38a166.74,166.74,0,0,1,18.68,4.08,4,4,0,1,1-2.16,7.7A176.21,176.21,0,0,0,128,76a176.21,176.21,0,0,0-46.92,6.16,4,4,0,1,1-2.16-7.7A166.74,166.74,0,0,1,97.6,70.38L93.71,55a4.15,4.15,0,0,0-4.69-3L53,58a4.07,4.07,0,0,0-3.31,3L20.12,177.34a4,4,0,0,0,2.29,4.59l67,29.71a4.16,4.16,0,0,0,3.35,0A4,4,0,0,0,95,209.35l8.45-22.88a171.49,171.49,0,0,1-24.53-4.92,4,4,0,0,1,2.16-7.71A176.21,176.21,0,0,0,128,180a176.21,176.21,0,0,0,46.92-6.16,4,4,0,0,1,2.16,7.71,171.49,171.49,0,0,1-24.53,4.92L161,209.35a4,4,0,0,0,2.23,2.32,4.16,4.16,0,0,0,3.35,0l67-29.71A4,4,0,0,0,235.88,177.34Z"/>
      </svg>
      Discord
    </a>
  )}
  {airdrop.telegram && (
    <a
      href={airdrop.telegram}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
        <path d="M226.27,29.22a5,5,0,0,0-5.1-.87L18.51,107.66a10.22,10.22,0,0,0,1.75,19.56L76,138.16V200a12,12,0,0,0,7.51,11.13A12.1,12.1,0,0,0,88,212a12,12,0,0,0,8.62-3.68l28-29,43,37.71a12,12,0,0,0,7.89,3,12.47,12.47,0,0,0,3.74-.59,11.87,11.87,0,0,0,8-8.72L227.87,34.12A5,5,0,0,0,226.27,29.22ZM20,117.38a2.13,2.13,0,0,1,1.42-2.27L196.07,46.76l-117,83.85L21.81,119.37A2.12,2.12,0,0,1,20,117.38Zm70.87,85.38A4,4,0,0,1,84,200V143.7L118.58,174Zm88.58,6.14a4,4,0,0,1-6.57,2.09L86.43,135.18,218.13,40.8Z"/>
      </svg>
      Telegram
    </a>
  )}
  {airdrop.github && (
    <a
      href={airdrop.github}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M21.0346 5.82524C21.9445 6.91709 22.3994 8.19091 22.3994 9.64671C22.3994 14.924 19.3969 16.4707 16.5763 16.9257C16.9402 17.5626 17.0312 18.2905 17.0312 19.0184V22.7489C17.0312 23.2038 16.7582 23.4768 16.3943 23.4768C16.0303 23.4768 15.6664 23.2038 15.6664 22.7489V19.0184C15.7574 18.1995 15.4844 17.4716 14.9385 16.9257L15.3934 15.7428C18.214 15.3789 21.1256 14.469 21.1256 9.55572C21.1256 8.37289 20.6707 7.28104 19.8518 6.37117L19.6698 5.64327C20.0338 4.7334 20.0338 3.73254 19.7608 2.91365C19.3059 3.00464 18.396 3.18661 16.8492 4.27846L16.3033 4.36945C14.1196 3.82352 11.9359 3.82352 9.75222 4.36945L9.2063 4.27846C7.56853 3.2776 6.65866 3.00464 6.20372 3.00464C5.93076 3.91451 5.93076 4.91537 6.29471 5.73426L6.11274 6.46215C5.20286 7.37203 4.74793 8.55486 4.74793 9.64671C4.74793 14.469 7.47754 15.4699 10.4801 15.8338L10.8441 17.0167C10.2981 17.5626 10.0252 18.2905 10.1162 19.0184V19.9283V20.0192V22.8399C10.1162 23.2038 9.84321 23.5677 9.38828 23.5677C9.02433 23.5677 8.66038 23.2948 8.66038 22.8399V20.7471C5.6578 21.3841 4.47497 19.8373 3.5651 18.6544C3.11016 18.1085 2.74621 17.6536 2.29127 17.5626C2.20029 17.4716 1.92733 17.1077 2.01831 16.7437C2.1093 16.3798 2.47325 16.1068 2.8372 16.2888C3.74707 16.4707 4.29299 17.1986 4.83892 17.8356C5.6578 18.9274 6.47669 19.9283 8.93334 19.3823V19.0184C8.84235 18.2905 9.02433 17.5626 9.38828 16.9257C6.65866 16.3798 3.47411 14.833 3.47411 9.64671C3.47411 8.19091 3.92904 6.91709 4.83892 5.82524C4.56595 4.55142 4.65694 3.18661 5.11188 2.09477L5.56681 1.73082C5.74879 1.63983 7.02261 1.36687 9.66124 3.00464C11.8449 2.45872 14.1196 2.45872 16.3033 3.00464C18.8509 1.27588 20.2158 1.54884 20.3977 1.63983L20.8527 2.00378C21.3076 3.2776 21.3986 4.55142 21.0346 5.82524Z"/>
      </svg>
      GitHub
    </a>
  )}
  {airdrop.whitepaper && (
    <a
      href={airdrop.whitepaper}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4C5 3.44772 5.44772 3 6 3H12V8C12 9.10457 12.8954 10 14 10H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4ZM19.9984 9.54063C19.9995 9.52723 20 9.51368 20 9.5C20 9.45831 19.9949 9.41782 19.9853 9.37911C19.9315 8.93793 19.7317 8.52463 19.4142 8.20711L13.7929 2.58579C13.4754 2.26826 13.0621 2.06853 12.6209 2.01471C12.5822 2.0051 12.5417 2 12.5 2C12.4863 2 12.4728 2.00055 12.4594 2.00163C12.4325 2.00054 12.4056 2 12.3787 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9.62132C20 9.59436 19.9995 9.56746 19.9984 9.54063ZM13 3.21644C13.0299 3.24014 13.0585 3.26565 13.0858 3.29289L18.7071 8.91421C18.7343 8.94146 18.7599 8.97011 18.7836 9H14C13.4477 9 13 8.55228 13 8V3.21644Z" fill="currentColor"/>
      </svg>
      Whitepaper
    </a>
  )}
  {airdrop.gitbook && (
    <a
      href={airdrop.gitbook}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <title>GitBook</title>
        <path d="M12.513 1.097c-.645 0-1.233.34-2.407 1.017L3.675 5.82A7.233 7.233 0 0 0 0 12.063v.236a7.233 7.233 0 0 0 3.667 6.238L7.69 20.86c2.354 1.36 3.531 2.042 4.824 2.042 1.292.001 2.47-.678 4.825-2.038l4.251-2.453c1.177-.68 1.764-1.02 2.087-1.579.323-.56.324-1.24.323-2.6v-2.63a1.04 1.04 0 0 0-1.558-.903l-8.728 5.024c-.587.337-.88.507-1.201.507-.323 0-.616-.168-1.204-.506l-5.904-3.393c-.297-.171-.446-.256-.565-.271a.603.603 0 0 0-.634.368c-.045.111-.045.282-.043.625.002.252 0 .378.025.494.053.259.189.493.387.667.089.077.198.14.416.266l6.315 3.65c.589.34.884.51 1.207.51.324 0 .617-.17 1.206-.509l7.74-4.469c.202-.116.302-.172.377-.13.075.044.075.16.075.392v1.193c0 .34.001.51-.08.649-.08.14-.227.224-.522.394l-6.382 3.685c-1.178.68-1.767 1.02-2.413 1.02-.646 0-1.236-.34-2.412-1.022l-5.97-3.452-.043-.025a4.106 4.106 0 0 1-2.031-3.52V11.7c0-.801.427-1.541 1.12-1.944a1.979 1.979 0 0 1 1.982-.001l4.946 2.858c1.174.679 1.762 1.019 2.407 1.02.645 0 1.233-.34 2.41-1.017l7.482-4.306a1.091 1.091 0 0 0 0-1.891L14.92 2.11c-1.175-.675-1.762-1.013-2.406-1.013Z"/>
      </svg>
      Gitbook
    </a>
  )}
  {airdrop.linkedin && (
    <a
      href={airdrop.linkedin}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
        <path d="M216,28H40A12,12,0,0,0,28,40V216a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28Zm4,188a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM92,112v64a4,4,0,0,1-8,0V112a4,4,0,0,1,8,0Zm88,28v36a4,4,0,0,1-8,0V140a24,24,0,0,0-48,0v36a4,4,0,0,1-8,0V112a4,4,0,0,1,8,0v6.87A32,32,0,0,1,180,140ZM96,84a8,8,0,1,1-8-8A8,8,0,0,1,96,84Z"/>
      </svg>
      LinkedIn
    </a>
  )}
  {airdrop.medium && (
    <a
      href={airdrop.medium}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-2 hover:bg-hover border border-card rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 text-secondary hover:text-foreground"
    >
      <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M71.5 142.3c.6-5.9-1.7-11.8-6.1-15.8L20.3 72.1V64h140.2l108.4 237.7L364.2 64h133.7v8.1l-38.6 37c-3.3 2.5-5 6.7-4.3 10.8v272c-.7 4.1 1 8.3 4.3 10.8l37.7 37v8.1H307.3v-8.1l39.1-37.9c3.8-3.8 3.8-5 3.8-10.8V171.2L241.5 447.1h-14.7L100.4 171.2v184.9c-1.1 7.8 1.5 15.6 7 21.2l50.8 61.6v8.1h-144v-8L65 377.3c5.4-5.6 7.9-13.5 6.5-21.2V142.3z"/>
      </svg>
      Medium
    </a>
  )}
</div>
    </div>
  );
}
