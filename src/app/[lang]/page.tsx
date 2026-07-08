import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { NextMatch } from "@/components/sections/NextMatch";
import { LatestResults } from "@/components/sections/LatestResults";
import { TeamHighlights } from "@/components/sections/TeamHighlights";
import { DepartmentsSection } from "@/components/sections/DepartmentsSection";
import { FeaturedPlayers } from "@/components/sections/FeaturedPlayers";
import { ClubValues } from "@/components/sections/ClubValues";
import { LatestNews } from "@/components/sections/LatestNews";
import { SponsorsStrip } from "@/components/sections/SponsorsStrip";
import { FanCTA } from "@/components/sections/FanCTA";
import { getNextMatch, getRecentResults } from "@/data/matches";
import { getFeaturedPlayers } from "@/data/players";
import { getLatestArticles } from "@/data/news";
import { getDict, hasLang } from "@/i18n";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const nextMatch = getNextMatch("men");
  const recentResults = getRecentResults(3);
  const featuredPlayers = getFeaturedPlayers();
  const latestArticles = getLatestArticles(3);

  return (
    <>
      <Hero
        lang={lang}
        nextMatch={nextMatch}
        strings={{
          eyebrow: dict.home.heroEyebrow,
          title1: dict.home.heroTitle1,
          titleAccent: dict.home.heroTitleAccent,
          title2: dict.home.heroTitle2,
          text: dict.home.heroText,
          viewMatches: dict.common.viewMatches,
          meetTheTeam: dict.common.meetTheTeam,
          nextMatch: dict.common.nextMatch,
          competition: nextMatch ? dict.competitions[nextMatch.competition] : "",
          versus: dict.common.versus,
          matchPreview: dict.common.matchPreview,
        }}
      />
      {nextMatch && <NextMatch match={nextMatch} lang={lang} />}
      <LatestResults matches={recentResults} lang={lang} />
      <TeamHighlights lang={lang} />
      <DepartmentsSection lang={lang} />
      <FeaturedPlayers players={featuredPlayers} lang={lang} />
      <ClubValues lang={lang} />
      <LatestNews articles={latestArticles} lang={lang} />
      <SponsorsStrip lang={lang} />
      <FanCTA lang={lang} />
    </>
  );
}
