import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  accent?: "gold" | "royal";
  className?: string;
}

export function StatCard({ value, label, accent = "gold", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-6 text-center shadow-card",
        className
      )}
    >
      <span
        className={cn(
          "absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full",
          accent === "gold" ? "bg-gold" : "bg-royal"
        )}
        aria-hidden="true"
      />
      <p
        className={cn(
          "font-display text-4xl font-extrabold tabular-nums sm:text-5xl",
          accent === "gold" ? "text-gradient-gold" : "text-gradient-royal"
        )}
      >
        {value}
      </p>
      <p className="mt-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mist">
        {label}
      </p>
    </div>
  );
}
