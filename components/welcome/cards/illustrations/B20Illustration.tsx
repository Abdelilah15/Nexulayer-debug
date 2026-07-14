export default function B20Illustration() {
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
        {/* Outer Circle */}
        <circle
          cx="110"
          cy="110"
          r="95"
          fill="none"
          stroke="#4F7CFF"
          strokeWidth="2"
        />

        {/* Vertical Grid */}
        <g stroke="#4F7CFF" strokeOpacity="0.45" strokeWidth="1">
          <line x1="50" y1="36" x2="50" y2="184" />
          <line x1="70" y1="26" x2="70" y2="194" />
          <line x1="90" y1="20" x2="90" y2="200" />
          <line x1="110" y1="15" x2="110" y2="205" />
          <line x1="130" y1="20" x2="130" y2="200" />
          <line x1="150" y1="26" x2="150" y2="194" />
          <line x1="170" y1="36" x2="170" y2="184" />
        </g>

        {/* Horizontal Grid */}
        <g stroke="#4F7CFF" strokeOpacity="0.45" strokeWidth="1">
          <line x1="36" y1="50" x2="184" y2="50" />
          <line x1="26" y1="70" x2="194" y2="70" />
          <line x1="20" y1="90" x2="200" y2="90" />
          <line x1="15" y1="110" x2="205" y2="110" />
          <line x1="20" y1="130" x2="200" y2="130" />
          <line x1="26" y1="150" x2="194" y2="150" />
          <line x1="36" y1="170" x2="184" y2="170" />
        </g>

        {/* Latitude */}
        <ellipse
          cx="110"
          cy="110"
          rx="95"
          ry="70"
          fill="none"
          stroke="#4F7CFF"
          strokeOpacity="0.45"
        />

        <ellipse
          cx="110"
          cy="110"
          rx="95"
          ry="45"
          fill="none"
          stroke="#4F7CFF"
          strokeOpacity="0.45"
        />

        {/* Longitude */}
        <ellipse
          cx="110"
          cy="110"
          rx="70"
          ry="95"
          fill="none"
          stroke="#4F7CFF"
          strokeOpacity="0.45"
        />

        <ellipse
          cx="110"
          cy="110"
          rx="45"
          ry="95"
          fill="none"
          stroke="#4F7CFF"
          strokeOpacity="0.45"
        />

        {/* Center Ring */}
        <circle
          cx="110"
          cy="110"
          r="34"
          fill="white"
          fillOpacity="0.04"
          stroke="#4F7CFF"
          strokeOpacity="0.5"
        />

        {/* B20 */}
        <text
          x="110"
          y="123"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="44"
          fontWeight="700"
          fill="#4F7CFF"
        >
          B20
        </text>
      </svg>
    </div>
  );
}