export default function NFTIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow */}
      <div className="absolute h-56 w-56 rounded-full bg-[#4F7CFF]/20 blur-3xl" />

      <svg
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        className="
          relative
          h-52
          w-52
          animate-float
          transition-all
          duration-500
          ease-out
          hover:scale-105
          hover:rotate-2
        "
      >
        {/* Main Card */}
        <rect
          x="40"
          y="28"
          width="140"
          height="164"
          rx="24"
          fill="none"
          stroke="#4F7CFF"
          strokeWidth="2"
        />

        {/* Image Area */}
        <rect
          x="58"
          y="48"
          width="104"
          height="78"
          rx="12"
          fill="rgba(79,124,255,.05)"
          stroke="#4F7CFF"
          strokeOpacity=".4"
        />

        {/* Sun */}
        <circle
          cx="140"
          cy="66"
          r="8"
          fill="#4F7CFF"
          fillOpacity=".85"
        />

        {/* Mountains */}
        <path
          d="M66 108L90 82L108 102L126 88L154 108"
          fill="none"
          stroke="#4F7CFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Divider */}
        <line
          x1="58"
          y1="140"
          x2="162"
          y2="140"
          stroke="#4F7CFF"
          strokeOpacity=".3"
        />

        {/* NFT Text */}
        <text
          x="110"
          y="166"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#4F7CFF"
        >
          NFT
        </text>

        {/* ERC721A Badge */}
        <g>
          <rect
            x="18"
            y="48"
            width="42"
            height="22"
            rx="11"
            fill="#18181B"
            stroke="#4F7CFF"
            strokeOpacity=".5"
          />
          <text
            x="39"
            y="63"
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="#4F7CFF"
            fontFamily="Inter, sans-serif"
          >
            721A
          </text>
        </g>

        {/* ERC1155 Badge */}
        <g>
          <rect
            x="160"
            y="148"
            width="44"
            height="22"
            rx="11"
            fill="#18181B"
            stroke="#4F7CFF"
            strokeOpacity=".5"
          />
          <text
            x="182"
            y="163"
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fill="#4F7CFF"
            fontFamily="Inter, sans-serif"
          >
            1155
          </text>
        </g>
      </svg>
    </div>
  );
}