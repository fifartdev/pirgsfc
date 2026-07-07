import { cn } from "@/lib/utils";

type BadgeVariant =
  | "gold"
  | "royal"
  | "outline"
  | "success"
  | "danger"
  | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold/15 text-gold-bright border-gold/30",
  royal: "bg-royal/15 text-royal-bright border-royal/30",
  outline: "bg-transparent text-mist border-line",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  danger: "bg-red-500/15 text-red-300 border-red-500/30",
  neutral: "bg-white/8 text-white/80 border-white/10",
};

export function Badge({ children, variant = "outline", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
