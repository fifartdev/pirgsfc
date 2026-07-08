import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamHub } from "@/components/sections/TeamHub";
import { getDict, hasLang } from "@/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDict(hasLang(lang) ? lang : "el");
  return {
    title: dict.teams.menTitle,
    description: dict.teams.menText,
    openGraph: { title: `${dict.teams.menTitle} | PYRGOS AFC`, description: dict.teams.menText },
  };
}

export default async function MenPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const dict = getDict(lang);

  const [title, ...rest] = dict.teams.menTitle.split(" ");
  return (
    <TeamHub
      lang={lang}
      department="men"
      eyebrow={dict.teams.menEyebrow}
      title={title}
      titleAccent={rest.join(" ")}
      text={dict.teams.menText}
    />
  );
}
