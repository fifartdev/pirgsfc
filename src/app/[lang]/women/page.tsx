import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamHub } from "@/components/sections/TeamHub";
import { getDict, hasLang } from "@/i18n";
import { getCmsMatches, getCmsClubLogoUrl, getCmsPlayersByDepartment, getCmsTeamStats } from "@/lib/cms-data";
import { buildAlternates } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
}

// Re-render hourly so date-based picks (next match, upcoming vs. past) roll
// over on their own instead of freezing at the last build/club-admin save.
export const revalidate = 3600;

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
  const [matches, logoUrl, players, stats] = await Promise.all([
    getCmsMatches("women"),
    getCmsClubLogoUrl("pyrgos-afc-women"),
    getCmsPlayersByDepartment("women"),
    getCmsTeamStats("women"),
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
      stats={stats}
    />
  );
}
