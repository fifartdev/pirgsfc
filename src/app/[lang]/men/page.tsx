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
  const [matches, logoUrl, players] = await Promise.all([
    getCmsMatches("men"),
    getCmsTeamLogoUrl("pyrgos-afc-men"),
    getCmsPlayersByDepartment("men"),
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
    />
  );
}
