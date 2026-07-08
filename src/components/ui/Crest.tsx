import { cn } from "@/lib/utils";

interface CrestProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-11 w-10",
  md: "h-16 w-14",
  lg: "h-28 w-24",
};

/**
 * The PYRGOS AFC crest, recreated as an inline SVG so no external logo asset
 * is required: a crimson shield with a diagonal sash and the white tower
 * ("pyrgos") crowned by a flame.
 */
export function Crest({ size = "sm", className }: CrestProps) {
  return (
    <svg
      viewBox="0 0 100 118"
      className={cn("shrink-0 drop-shadow-[0_0_14px_rgba(195,27,27,0.45)]", sizeClasses[size], className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="crest-shield">
          <path d="M50 4 C68 10 84 12 94 15 V56 C94 88 74 105 50 114 C26 105 6 88 6 56 V15 C16 12 32 10 50 4 Z" />
        </clipPath>
      </defs>

      {/* Shield ground */}
      <path
        d="M50 4 C68 10 84 12 94 15 V56 C94 88 74 105 50 114 C26 105 6 88 6 56 V15 C16 12 32 10 50 4 Z"
        fill="#f7f3f2"
        stroke="#8e0f10"
        strokeWidth="3"
      />

      <g clipPath="url(#crest-shield)">
        {/* Top band */}
        <path d="M0 0 H100 V26 C84 22 66 20 50 15 C34 20 16 22 0 26 Z" fill="#a31414" />
        {/* Diagonal sash */}
        <path d="M-10 22 L38 78 L26 96 L-10 54 Z" fill="#a31414" />
        <path d="M110 46 L64 100 L80 112 L110 78 Z" fill="#a31414" />

        {/* Tower */}
        <g>
          <path
            d="M36 52 H42 V46 H48 V52 H52 V46 H58 V52 H64 L61 96 H39 Z"
            fill="#ffffff"
            stroke="#2a0a0a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Door */}
          <path d="M45 96 V82 Q50 76 55 82 V96 Z" fill="#a31414" />
          {/* Flame stem */}
          <path d="M47 46 H53 V64 L50 68 L47 64 Z" fill="#c31b1b" stroke="#2a0a0a" strokeWidth="1.6" />
          {/* Flame */}
          <path
            d="M44 44 C40 36 44 28 52 26 C48 30 50 32 56 30 C66 27 72 30 78 26 C76 34 68 36 60 36 C66 38 72 37 76 40 C70 46 58 46 44 44 Z"
            fill="#c31b1b"
            stroke="#2a0a0a"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>

        {/* Ball */}
        <circle cx="50" cy="104" r="5" fill="none" stroke="#a31414" strokeWidth="1.8" />
        <path d="M45.5 102.5 L54.5 102.5 M50 99 V109 M46 106.5 L54 106.5" stroke="#a31414" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
