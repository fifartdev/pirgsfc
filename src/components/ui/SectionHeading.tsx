import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-crimson-bright",
            align === "center" && "justify-center"
          )}
        >
          <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden="true" />
          {eyebrow}
          {align === "center" && (
            <span className="inline-block h-px w-8 bg-crimson/70" aria-hidden="true" />
          )}
        </p>
      )}
      <h2 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-mist">{description}</p>
      )}
    </div>
  );
}
