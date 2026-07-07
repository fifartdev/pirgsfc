import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";

export default function NotFound() {
  return (
    <section className="noise relative flex min-h-svh items-center overflow-hidden bg-night">
      <div className="stadium-lights" aria-hidden="true" />
      <Container className="relative py-40 text-center">
        <Crest size="lg" className="mx-auto" />
        <p className="mt-10 font-display text-7xl font-extrabold text-gradient-gold sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
          The Ball Went Out of Play
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back onto the pitch.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="gold">
            Back to Home
          </Button>
          <Button href="/matches" variant="outline">
            View Matches
          </Button>
        </div>
      </Container>
    </section>
  );
}
