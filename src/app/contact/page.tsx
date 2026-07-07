import type { Metadata } from "next";
import { Mail, Phone, MapPin, Megaphone, Handshake, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { CLUB, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PYRGOS FC — general enquiries, media, sponsorships, and academy. Contact details, stadium address, and social links.",
  openGraph: {
    title: "Contact | PYRGOS FC",
    description: "Get in touch with PYRGOS FC.",
  },
};

const departments = [
  {
    icon: Mail,
    title: "General Enquiries",
    text: "Questions about the club, tickets, or matchdays.",
    contact: "hello@pyrgosfc.com",
  },
  {
    icon: Megaphone,
    title: "Media",
    text: "Press accreditation, interviews, and media requests.",
    contact: "media@pyrgosfc.com",
  },
  {
    icon: Handshake,
    title: "Sponsorships",
    text: "Partnership and commercial opportunities with the club.",
    contact: "partners@pyrgosfc.com",
  },
  {
    icon: GraduationCap,
    title: "Academy",
    text: "Trials, registrations, and youth development programmes.",
    contact: "academy@pyrgosfc.com",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              We&apos;re Listening
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              Contact <span className="text-gradient-gold">the Club</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Whether you&apos;re a supporter, a partner, a journalist, or a
              future academy star — the door at PYRGOS FC is always open.
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
                <article className="glass group h-full rounded-2xl p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-night">
                    <dept.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-base font-bold uppercase tracking-wide text-white">
                    {dept.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{dept.text}</p>
                  <a
                    href={`mailto:${dept.contact}`}
                    className="mt-4 inline-block text-sm font-semibold text-gold transition-colors hover:text-gold-bright"
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
                eyebrow="Send a Message"
                title="Write to Us"
                description="Fill in the form and the right department will get back to you, usually within two working days."
              />
              <div className="mt-10">
                <ContactForm />
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <SectionHeading eyebrow="Find Us" title="Club Details" />
              <ul className="mt-10 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-gold">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {CLUB.stadium.name}
                    </p>
                    <p className="mt-1 text-sm text-mist">{CLUB.contact.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-gold">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      Email
                    </p>
                    <a
                      href={`mailto:${CLUB.contact.email}`}
                      className="mt-1 block text-sm text-mist transition-colors hover:text-gold"
                    >
                      {CLUB.contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white/5 text-gold">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      Phone
                    </p>
                    <a
                      href={`tel:${CLUB.contact.phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm text-mist transition-colors hover:text-gold"
                    >
                      {CLUB.contact.phone}
                    </a>
                  </div>
                </li>
              </ul>

              {/* Map placeholder */}
              <div
                className="glass pitch-pattern relative mt-10 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl shadow-card"
                role="img"
                aria-label="Map placeholder showing the location of Pyrgos Stadium"
              >
                <span
                  className="absolute h-40 w-40 rounded-full bg-royal/20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative text-center">
                  <MapPin className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-widest text-white">
                    {CLUB.stadium.name}
                  </p>
                  <p className="mt-1 text-xs text-mist">Interactive map coming soon</p>
                </div>
              </div>

              <ul className="mt-8 flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-line px-4 py-2 font-display text-[0.65rem] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-gold/50 hover:text-gold-bright"
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
