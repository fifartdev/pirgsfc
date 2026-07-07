"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Crest } from "@/components/ui/Crest";
import { NAV_LINKS, CLUB } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  pathname: string;
}

export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-full rounded bg-white transition-all duration-300",
              open && "top-1.5 rotate-45"
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-1.5 h-0.5 w-full rounded bg-white transition-all duration-300",
              open && "opacity-0"
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-3 h-0.5 w-full rounded bg-white transition-all duration-300",
              open && "top-1.5 -rotate-45"
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night/97 pt-24 backdrop-blur-xl"
          >
            <div
              className="stadium-lights opacity-60"
              aria-hidden="true"
            />
            <nav aria-label="Mobile navigation" className="relative px-6 pb-10">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between border-b border-line py-4 font-display text-2xl font-bold uppercase tracking-wide transition-colors",
                        isActive(link.href) ? "text-gold" : "text-white hover:text-gold-bright"
                      )}
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      {link.label}
                      <span className="text-sm text-mist" aria-hidden="true">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.35 }}
                className="mt-8 flex flex-col items-start gap-6"
              >
                <Link
                  href="/matches"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full bg-gold px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-night shadow-glow-gold"
                >
                  Next Matchday
                </Link>
                <div className="flex items-center gap-3 text-mist">
                  <Crest size="sm" />
                  <p className="font-display text-xs uppercase tracking-[0.25em]">
                    {CLUB.tagline}
                  </p>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
