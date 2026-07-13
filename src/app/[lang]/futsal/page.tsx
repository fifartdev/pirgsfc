import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamHub } from "@/components/sections/TeamHub";
import { getDict, hasLang } from "@/i18n";
import { getCmsMatches, getCmsTeamLogoUrl, getCmsPlayersByDepartment, getCmsTeamStats } from "@/lib/cms-data";
import { buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = hasLang(lang) ? lang : "el";
  const dict = getDict(resolvedLang);
  return {
    title: dict.teams.futsalTitle,
    description: dict.teams.futsalText,
    alternates: buildAlternates(resolvedLang, "/futsal"),
    openGraph: {
      title: `${dict.teams.futsalTitle} | PYRGOS AFC`,
      description: dict.teams.futsalText,
    },
  };
}

export default async function FutsalPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const dict = getDict(lang);

  const [titleWord, ...rest] = dict.teams.futsalTitle.split(" ");
  const [matches, logoUrl, players, stats] = await Promise.all([
    getCmsMatches("futsal"),
    getCmsTeamLogoUrl("pyrgos-afc-futsal"),
    getCmsPlayersByDepartment("futsal"),
    getCmsTeamStats("futsal"),
  ]);
  return (
    <TeamHub
      lang={lang}
      department="futsal"
      eyebrow={dict.teams.futsalEyebrow}
      title={titleWord}
      titleAccent={rest.join(" ")}
      text={dict.teams.futsalText}
      matches={matches}
      logoUrl={logoUrl}
      players={players}
      stats={stats}
    />
  );
}
