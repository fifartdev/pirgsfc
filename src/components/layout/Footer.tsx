import Link from "next/link";
import { Crest } from "@/components/ui/Crest";
import { Container } from "@/components/ui/Container";
import { CLUB, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { sponsors } from "@/data/sponsors";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-950">
      <div className="stadium-lights opacity-40" aria-hidden="true" />
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Crest size="md" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
                  Pyrgos FC
                </span>
                <span className="mt-1 font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-gold/80">
                  Est. {CLUB.founded}
                </span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-mist">
              {CLUB.statement}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Explore
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-gold-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>{CLUB.contact.address}</li>
              <li>
                <a
                  href={`mailto:${CLUB.contact.email}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {CLUB.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CLUB.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {CLUB.contact.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-line px-4 py-1.5 font-display text-[0.65rem] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-gold/50 hover:text-gold-bright"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Club Partners
            </h2>
            <ul className="mt-5 space-y-3">
              {sponsors.slice(0, 4).map((sponsor) => (
                <li key={sponsor.id} className="text-sm">
                  <span className="font-semibold text-white/85">{sponsor.name}</span>
                  <span className="block text-xs text-mist">{sponsor.tagline}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-mist sm:flex-row">
          <p>
            © {new Date().getFullYear()} {CLUB.name}. All rights reserved.
          </p>
          <p className="font-display uppercase tracking-[0.25em] text-gold/70">
            {CLUB.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}
