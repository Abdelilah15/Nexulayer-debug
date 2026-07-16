import React from "react";

interface FireIconProps {
  active?: boolean;
  size?: number;
  className?: string;
}

export default function FireIcon({
  active = true,
  size = 72,
  className = "",
}: FireIconProps) {
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <div
          className="absolute rounded-full bg-orange-500/20 blur-2xl"
          style={{
            width: size * 0.95,
            height: size * 0.95,
          }}
        />
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={`
          transition-all
          duration-500
          ${active
            ? "text-orange-500 drop-shadow-[0_0_18px_rgba(249,115,22,0.7)] animate-pulse"
            : "text-secondary/40 grayscale opacity-60"}
          ${className}
        `}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.963 2.286a.75.75 0 0 0-1.071-.136
          9.742 9.742 0 0 0-3.539 6.176
          7.547 7.547 0 0 1-1.705-1.715
          .75.75 0 0 0-1.152-.082
          9 9 0 1 0 10.184-2.077
          7.46 7.46 0 0 1-2.717-2.248ZM15.75
          14.25a3.75 3.75 0 1 1-7.313-1.172
          5.92 5.92 0 0 0 2.133 1
          5.99 5.99 0 0 1 1.925-3.546
          3.75 3.75 0 0 1 3.255 3.718Z"
        />
      </svg>
    </div>
  );
}