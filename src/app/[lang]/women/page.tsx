import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamHub } from "@/components/sections/TeamHub";
import { getDict, hasLang } from "@/i18n";
import { getCmsMatches, getCmsTeamLogoUrl, getCmsPlayersByDepartment } from "@/lib/cms-data";
import { buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  return {
    title: dict.teams.womenTitle,
    description: dict.teams.womenText,
    alternates: buildAlternates(resolvedLang, "/women"),
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

  const [titleWord, ...rest] = dict.teams.womenTitle.split(" ");
  const [matches, logoUrl, players] = await Promise.all([
    getCmsMatches("women"),
    getCmsTeamLogoUrl("pyrgos-afc-women"),
    getCmsPlayersByDepartment("women"),
  ]);
  return (
    <TeamHub
      lang={lang}
      department="women"
      eyebrow={dict.teams.womenEyebrow}
      title={titleWord}
      titleAccent={rest.join(" ")}
      text={dict.teams.womenText}
      matches={matches}
      logoUrl={logoUrl}
      players={players}
    />
  );
}
