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
    title: dict.teams.menTitle,
    description: dict.teams.menText,
    alternates: buildAlternates(resolvedLang, "/men"),
    openGraph: { title: `${dict.teams.menTitle} | PYRGOS AFC`, description: dict.teams.menText },
  };
}

export default async function MenPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const dict = getDict(lang);

  const [titleWord, ...rest] = dict.teams.menTitle.split(" ");
  const [matches, logoUrl, players, stats] = await Promise.all([
    getCmsMatches("men"),
    getCmsClubLogoUrl("pyrgos-afc-men"),
    getCmsPlayersByDepartment("men"),
    getCmsTeamStats("men"),
  ]);
  return (
    <TeamHub
      lang={lang}
      department="men"
      eyebrow={dict.teams.menEyebrow}
      title={titleWord}
      titleAccent={rest.join(" ")}
      text={dict.teams.menText}
      matches={matches}
      logoUrl={logoUrl}
      players={players}
      stats={stats}
    />
  );
}
