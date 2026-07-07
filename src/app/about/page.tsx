import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";
import { StatCard } from "@/components/cards/StatCard";
import { ClubValues } from "@/components/sections/ClubValues";
import { CLUB } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Club",
  description:
    "The story, mission, values, and vision of PYRGOS FC — a modern football club built to represent the city of Pyrgos with courage, discipline, and pride.",
  openGraph: {
    title: "The Club | PYRGOS FC",
    description:
      "The story, mission, values, and vision of PYRGOS FC.",
  },
};

const timeline = [
  {
    year: "2026",
    title: "The Club Is Born",
    text: "PYRGOS FC is founded with a single mission: to give the city of Pyrgos a team worthy of its history, its people, and its ambition.",
  },
  {
    year: "2026",
    title: "The First Squad",
    text: "Twenty players sign for the project — a blend of proven leaders, hungry talents, and the first academy graduates ready to carry the badge.",
  },
  {
    year: "2026",
    title: "Pyrgos Stadium Opens",
    text: "The gates of Pyrgos Stadium open for the first time. Twelve and a half thousand seats, one voice, and an atmosphere already famous across the region.",
  },
  {
    year: "Beyond",
    title: "The Vision",
    text: "Promotion, silverware, and an academy that becomes the beating heart of the region. The future is not a dream here — it is a plan.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section className="noise relative overflow-hidden bg-night pb-20 pt-40 sm:pb-28">
        <div className="stadium-lights" aria-hidden="true" />
        <Container className="relative">
          <AnimatedReveal>
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-14">
              <Crest size="lg" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-gold">
                  Est. {CLUB.founded} · The Pride of Pyrgos
                </p>
                <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-6xl">
                  Where Tradition{" "}
                  <span className="text-gradient-gold">Meets Ambition</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  PYRGOS FC exists to represent the city with courage,
                  discipline, and pride. We are a club built by our community,
                  for our community — and driven by the relentless pursuit of
                  glory.
                </p>
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      </section>

      {/* Mission */}
      <section className="clip-diagonal relative bg-navy-950 py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <AnimatedReveal>
              <SectionHeading
                eyebrow="Our Mission"
                title="One City. One Team. One Dream."
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-mist">
                <p>
                  Every club has a beginning. Ours starts with a simple belief:
                  that football can unite a city, inspire a generation, and
                  create moments that live forever.
                </p>
                <p>
                  Every match is a promise. Every training session is a step
                  forward. Every supporter is part of the story. From the first
                  whistle at Pyrgos Stadium to the last minute of every away
                  trip, this team plays for something bigger than results.
                </p>
                <p>
                  Our badge is not just worn. It is carried — by players who
                  give everything, coaches who demand more, and a city that
                  never stops believing.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/roster" variant="gold">
                  Meet the Squad
                </Button>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <StatCard value="2026" label="Founded" accent="gold" />
                <StatCard value="20" label="First-Team Players" accent="royal" />
                <StatCard value="9" label="Academy Age Groups" accent="royal" />
                <StatCard value="12.5K" label="Stadium Capacity" accent="gold" />
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* History timeline */}
      <section className="relative py-24 sm:py-32">
        <Container>
          <AnimatedReveal>
            <SectionHeading
              eyebrow="Our Story"
              title="A Club With History in the Making"
              description="Young in years. Old in soul. The chapters are being written right now."
              align="center"
            />
          </AnimatedReveal>

          <ol className="relative mx-auto mt-16 max-w-3xl space-y-10 border-l border-line pl-8 sm:pl-12">
            {timeline.map((item, index) => (
              <AnimatedReveal key={item.title} delay={index * 0.1}>
                <li className="relative">
                  <span
                    className="absolute -left-[2.55rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-night sm:-left-[3.55rem]"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <Badge variant="gold">{item.year}</Badge>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.text}</p>
                </li>
              </AnimatedReveal>
            ))}
          </ol>
        </Container>
      </section>

      <ClubValues />

      {/* Stadium */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container>
          <div className="gradient-border noise relative overflow-hidden rounded-3xl p-8 shadow-card sm:p-14">
            <div className="stadium-lights opacity-70" aria-hidden="true" />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <AnimatedReveal>
                <SectionHeading
                  eyebrow="Home Ground"
                  title="Pyrgos Stadium"
                  description="Twelve and a half thousand voices. One fortress. The place where the city gathers and the team becomes unbeatable."
                />
                <dl className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-mist">Capacity</dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-gold">
                      {CLUB.stadium.capacity}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-mist">Opened</dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-gold">
                      {CLUB.stadium.opened}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs uppercase tracking-widest text-mist">Address</dt>
                    <dd className="mt-1 text-sm text-white/85">{CLUB.stadium.address}</dd>
                  </div>
                </dl>
                <div className="mt-8">
                  <Button href="/matches" variant="gold">
                    See It On Matchday
                  </Button>
                </div>
              </AnimatedReveal>

              {/* CSS stadium illustration */}
              <AnimatedReveal delay={0.15}>
                <div
                  className="relative mx-auto aspect-[4/3] w-full max-w-md"
                  aria-hidden="true"
                >
                  <div className="absolute inset-x-6 bottom-6 top-16 rounded-[50%] border border-royal/40 bg-navy-800/60" />
                  <div className="absolute inset-x-14 bottom-12 top-24 rounded-[50%] border border-gold/30 bg-navy-900" />
                  <div className="absolute inset-x-24 bottom-[4.5rem] top-32 rounded-[50%] border border-emerald-500/40 bg-emerald-900/30" />
                  <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 bg-emerald-400/40" />
                  <div className="absolute left-1/2 top-[58%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/40" />
                  <span className="absolute left-6 top-6 h-16 w-1 rotate-12 rounded bg-gradient-to-b from-gold/80 to-transparent" />
                  <span className="absolute right-6 top-6 h-16 w-1 -rotate-12 rounded bg-gradient-to-b from-gold/80 to-transparent" />
                  <span className="absolute left-4 top-3 h-3 w-6 rounded-full bg-gold/90 blur-[2px]" />
                  <span className="absolute right-4 top-3 h-3 w-6 rounded-full bg-gold/90 blur-[2px]" />
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Fans / community */}
      <section className="clip-diagonal relative bg-navy-950 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedReveal>
              <SectionHeading
                eyebrow="Fans & Community"
                title="The Twelfth Player"
                description="Football means nothing without the people it belongs to."
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-mist">
                <p>
                  From free coaching clinics in the city park to walking
                  football for older residents, PYRGOS FC runs community
                  programmes in five neighbourhoods across the city — because a
                  club is not the stadium or the trophies. It is the people.
                </p>
                <p>
                  On matchdays, the supporters have already won points on their
                  own this season. Away from home, they out-sing home crowds.
                  This is what it means to be the Pride of Pyrgos.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact" variant="gold">
                  Get Involved
                </Button>
                <Button href="/calendar" variant="outline">
                  Community Events
                </Button>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.15}>
              <blockquote className="glass relative rounded-3xl p-8 shadow-card sm:p-10">
                <span
                  className="absolute -top-5 left-8 font-display text-7xl font-extrabold leading-none text-gold/40"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-lg leading-relaxed text-white/90">
                  You have made this club feel like it has existed for a hundred
                  years. We will win together, we will lose together, and we
                  will grow together. That is what a football club is.
                </p>
                <footer className="mt-6 border-t border-line pt-5">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
                    Nikos Stavrou
                  </p>
                  <p className="text-xs text-mist">Captain, PYRGOS FC</p>
                </footer>
              </blockquote>
            </AnimatedReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
