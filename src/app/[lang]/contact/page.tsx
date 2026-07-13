import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Megaphone, Handshake, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { getCmsClubInfo } from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  return {
    title: `${dict.contact.title1} ${dict.contact.titleAccent}`,
    description: dict.contact.text,
    alternates: buildAlternates(resolvedLang, "/contact"),
    openGraph: {
      title: `${dict.contact.title1} ${dict.contact.titleAccent} | PYRGOS AFC`,
      description: dict.contact.text,
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const clubInfo = await getCmsClubInfo();

  const departments = [
    { icon: Mail, ...dict.contact.departments.general, contact: "hello@pyrgosafc.com" },
    { icon: Megaphone, ...dict.contact.departments.media, contact: "media@pyrgosafc.com" },
    {
      icon: Handshake,
      ...dict.contact.departments.sponsorships,
      contact: "partners@pyrgosafc.com",
    },
    {
      icon: GraduationCap,
      ...dict.contact.departments.academy,
      contact: "academy@pyrgosafc.com",
    },
  ];

  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-crimson-bright">
              {dict.contact.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              {dict.contact.title1}{" "}
              <span className="text-gradient-crimson">{dict.contact.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {dict.contact.text}
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Departments */}
      <section className="relative pb-8">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, index) => (
              <AnimatedReveal key={dept.title} delay={index * 0.08}>
                <article className="glass group h-full rounded-2xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-crimson/30">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-crimson/30 bg-crimson/10 text-crimson-bright transition-all duration-300 group-hover:bg-crimson group-hover:text-white">
                    <dept.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-base font-bold uppercase tracking-wide text-white">
                    {dept.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{dept.text}</p>
                  <a
                    href={`mailto:${dept.contact}`}
                    className="mt-4 inline-block text-sm font-semibold text-crimson-bright transition-colors hover:text-white"
                  >
                    {dept.contact}
                  </a>
                </article>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Form + details */}
      <section className="relative py-16 pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <AnimatedReveal>
              <SectionHeading
                eyebrow={dict.contact.formEyebrow}
                title={dict.contact.formTitle}
                description={dict.contact.formText}
              />
              <div className="mt-10">
                <ContactForm strings={dict.contact.form} />
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <SectionHeading
                eyebrow={dict.contact.detailsEyebrow}
                title={dict.contact.detailsTitle}
              />
              <ul className="mt-10 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-crimson-bright">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {clubInfo.stadiumName[lang]}
                    </p>
                    <p className="mt-1 text-sm text-mist">{clubInfo.contactAddress[lang]}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-crimson-bright">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {dict.contact.emailLabel}
                    </p>
                    <a
                      href={`mailto:${clubInfo.contactEmail}`}
                      className="mt-1 block text-sm text-mist transition-colors hover:text-crimson-bright"
                    >
                      {clubInfo.contactEmail}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-crimson-bright">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {dict.contact.phoneLabel}
                    </p>
                    <a
                      href={`tel:${clubInfo.contactPhone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm text-mist transition-colors hover:text-crimson-bright"
                    >
                      {clubInfo.contactPhone}
                    </a>
                  </div>
                </li>
              </ul>

              {/* Map placeholder */}
              <div
                className="glass pitch-pattern relative mt-10 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl shadow-card"
                role="img"
                aria-label={dict.contact.mapAria}
              >
                <span
                  className="absolute h-40 w-40 rounded-full bg-crimson/20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative text-center">
                  <MapPin className="mx-auto h-10 w-10 text-crimson-bright" aria-hidden="true" />
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-widest text-white">
                    {clubInfo.stadiumName[lang]}
                  </p>
                  <p className="mt-1 text-xs text-mist">{dict.contact.mapSoon}</p>
                </div>
              </div>

              <ul className="mt-8 flex flex-wrap gap-3">
                {clubInfo.socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-line px-4 py-2 font-display text-[0.65rem] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-crimson/50 hover:text-crimson-bright"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AnimatedReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
