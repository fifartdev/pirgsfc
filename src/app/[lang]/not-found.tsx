"use client";

import { useParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Crest } from "@/components/ui/Crest";
import { getDict, hasLang } from "@/i18n";
import { localeHref } from "@/lib/utils";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang && hasLang(params.lang) ? params.lang : "el";
  const dict = getDict(lang);

  return (
    <section className="noise relative flex min-h-svh items-center overflow-hidden bg-night">
      <div className="stadium-lights" aria-hidden="true" />
      <Container className="relative py-40 text-center">
        <Crest size="lg" className="mx-auto" />
        <p className="text-gradient-crimson mt-10 font-display text-7xl font-extrabold sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
          {dict.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">
          {dict.notFound.text}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={localeHref(lang, "/")} variant="crimson">
            {dict.notFound.backHome}
          </Button>
          <Button href={localeHref(lang, "/matches")} variant="outline">
            {dict.common.viewMatches}
          </Button>
        </div>
      </Container>
    </section>
  );
}
