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
    title: dict.teams.womenTitle,
    description: dict.teams.womenText,
    openGraph: {
      title: `${dict.teams.womenTitle} | PYRGOS AFC`,
      description: dict.teams.womenText,
    },
  };
}

export default async function WomenPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const dict = getDict(lang);

  const [title, ...rest] = dict.teams.womenTitle.split(" ");
  return (
    <TeamHub
      lang={lang}
      department="women"
      eyebrow={dict.teams.womenEyebrow}
      title={title}
      titleAccent={rest.join(" ")}
      text={dict.teams.womenText}
    />
  );
}
