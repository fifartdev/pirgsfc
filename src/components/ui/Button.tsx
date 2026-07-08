import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "crimson" | "smoke" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  crimson: "bg-crimson text-white hover:bg-crimson-bright shadow-glow-crimson hover:shadow-glow-crimson font-semibold",
  smoke:
    "bg-smoke text-night hover:bg-smoke-bright shadow-glow-smoke hover:shadow-glow-smoke font-semibold",
  outline:
    "border border-line bg-transparent text-white hover:border-crimson/60 hover:text-crimson-bright",
  ghost: "bg-white/5 text-white hover:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  href,
  variant = "crimson",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-display uppercase tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
