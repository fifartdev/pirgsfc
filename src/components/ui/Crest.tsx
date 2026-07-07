import { cn } from "@/lib/utils";

interface CrestProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-24 w-24 text-3xl",
};

/**
 * Text-based crest mark for PYRGOS FC — a shield-inspired circular badge
 * built purely with CSS so no external logo asset is required.
 */
export function Crest({ size = "sm", className }: CrestProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-b from-navy-700 via-navy-900 to-night font-display font-extrabold tracking-tight text-gold shadow-glow-gold",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      <span
        className="absolute inset-[3px] rounded-full border border-gold/25"
        aria-hidden="true"
      />
      PFC
    </span>
  );
}
