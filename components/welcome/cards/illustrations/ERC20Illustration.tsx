export default function ERC20Illustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Blue Glow */}
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
          hover:rotate-3
        "
      >
        {/* Outer Hexagon */}
        <polygon
          points="110,18 185,60 185,160 110,202 35,160 35,60"
          fill="none"
          stroke="#4F7CFF"
          strokeWidth="2"
        />

        {/* Inner Hexagon */}
        <polygon
          points="110,45 160,73 160,147 110,175 60,147 60,73"
          fill="none"
          stroke="#4F7CFF"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />

        {/* Connections */}
        <g stroke="#4F7CFF" strokeOpacity="0.45" strokeWidth="1.5">
          <line x1="110" y1="18" x2="110" y2="45" />
          <line x1="185" y1="60" x2="160" y2="73" />
          <line x1="185" y1="160" x2="160" y2="147" />
          <line x1="110" y1="202" x2="110" y2="175" />
          <line x1="35" y1="160" x2="60" y2="147" />
          <line x1="35" y1="60" x2="60" y2="73" />
        </g>

        {/* Nodes */}
        <g fill="#4F7CFF">
          <circle cx="110" cy="18" r="4" />
          <circle cx="185" cy="60" r="4" />
          <circle cx="185" cy="160" r="4" />
          <circle cx="110" cy="202" r="4" />
          <circle cx="35" cy="160" r="4" />
          <circle cx="35" cy="60" r="4" />

          <circle cx="110" cy="45" r="3" />
          <circle cx="160" cy="73" r="3" />
          <circle cx="160" cy="147" r="3" />
          <circle cx="110" cy="175" r="3" />
          <circle cx="60" cy="147" r="3" />
          <circle cx="60" cy="73" r="3" />
        </g>

        {/* Center Circle */}
        <circle
          cx="110"
          cy="110"
          r="36"
          fill="white"
          fillOpacity="0.04"
          stroke="#4F7CFF"
          strokeOpacity="0.5"
        />

        {/* ERC20 */}
        <text
          x="110"
          y="118"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="26"
          fontWeight="700"
          fill="#4F7CFF"
        >
          ERC20
        </text>
      </svg>
    </div>
  );
}