"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crest } from "@/components/ui/Crest";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-card"
          : "border-b border-transparent bg-gradient-to-b from-night/90 to-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Crest size="sm" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold uppercase tracking-wide text-white transition-colors group-hover:text-gold-bright">
              Pyrgos FC
            </span>
            <span className="mt-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold/80">
              Est. 2026
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 font-display text-[0.8rem] font-semibold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  isActive(link.href)
                    ? "text-gold"
                    : "text-white/75 hover:text-white"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/matches"
            className="inline-flex items-center rounded-full bg-gold px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-night transition-all duration-300 hover:bg-gold-bright hover:shadow-glow-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Matchday
          </Link>
        </div>

        <MobileNav pathname={pathname} />
      </nav>
    </header>
  );
}
