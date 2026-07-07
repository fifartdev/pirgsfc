import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffCard } from "@/components/cards/StaffCard";
import { staff } from "@/data/staff";

export const metadata: Metadata = {
  title: "Coaching Staff",
  description:
    "The coaching and technical staff behind PYRGOS FC — head coach, assistants, medical team, and the people who build the club's identity every day.",
  openGraph: {
    title: "Coaching Staff | PYRGOS FC",
    description: "The coaching and technical staff behind PYRGOS FC.",
  },
};

export default function StaffPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-night pb-16 pt-40 sm:pb-24">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
              Behind the Team
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
              Coaching <span className="text-gradient-gold">Staff</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Standards are set before the players ever step on the pitch. Meet
              the coaches, medics, and specialists who build PYRGOS FC every
              single day.
            </p>
          </AnimatedReveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {staff.map((member, index) => (
              <AnimatedReveal key={member.slug} delay={(index % 2) * 0.1}>
                <StaffCard member={member} />
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="clip-diagonal relative bg-navy-950 py-24">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow="The Standard"
              title="One Building. One Mission."
              description="From the analysis room to the physio table, every member of staff works towards the same goal — a team the city of Pyrgos can be proud of."
              align="center"
            />
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
