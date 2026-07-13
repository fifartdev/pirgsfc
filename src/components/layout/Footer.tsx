import Link from "next/link";
import { Crest } from "@/components/ui/Crest";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS, FOOTER_EXTRA_PATHS } from "@/lib/constants";
import { getCmsClubInfo } from "@/lib/cms-data";
import { getDict } from "@/i18n";
import { localeHref } from "@/lib/utils";
import type { Lang } from "@/types";

interface FooterProps {
  lang: Lang;
}

export async function Footer({ lang }: FooterProps) {
  const dict = getDict(lang);
  const clubInfo = await getCmsClubInfo();

  const links = [
    ...NAV_ITEMS.map((item) => ({
      href: localeHref(lang, item.path),
      label: dict.nav[item.key],
    })),
    ...FOOTER_EXTRA_PATHS.map((item) => ({
      href: localeHref(lang, item.path),
      label: dict.common[item.key],
    })),
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ash-950">
      <div className="stadium-lights opacity-40" aria-hidden="true" />
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={localeHref(lang, "/")} className="inline-flex items-center gap-3">
              <Crest size="md" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
                  Pyrgos AFC
                </span>
                <span className="mt-1 font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-crimson-bright/90">
                  {dict.common.est}
                </span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-mist">{dict.footer.statement}</p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-crimson-bright">
              {dict.footer.explore}
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-crimson-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-crimson-bright">
              {dict.footer.contact}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>{clubInfo.contactAddress[lang]}</li>
              <li>
                <a
                  href={`mailto:${clubInfo.contactEmail}`}
                  className="transition-colors hover:text-crimson-bright"
                >
                  {clubInfo.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${clubInfo.contactPhone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-crimson-bright"
                >
                  {clubInfo.contactPhone}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-3">
              {clubInfo.socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-line px-4 py-1.5 font-display text-[0.65rem] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-crimson/50 hover:text-crimson-bright"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-crimson-bright">
              {dict.footer.partners}
            </h2>
            <ul className="mt-5 space-y-3">
              {clubInfo.sponsors.slice(0, 4).map((sponsor) => (
                <li key={sponsor.id} className="text-sm">
                  <span className="font-semibold text-white/85">{sponsor.name}</span>
                  <span className="block text-xs text-mist">{sponsor.tagline[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-mist sm:flex-row">
          <p>
            © {new Date().getFullYear()} {clubInfo.name[lang]}. {dict.footer.rights}
          </p>
          <p className="font-display uppercase tracking-[0.25em] text-crimson-bright/80">
            {dict.common.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}
