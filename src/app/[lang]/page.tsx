import type { Metadata } from "next";
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
import {
  getCmsLatestArticles,
  getCmsFeaturedPlayers,
  getCmsNextMatch,
  getCmsRecentResults,
  getCmsHomeContent,
} from "@/lib/cms-data";
import { getDict, hasLang } from "@/i18n";
import { buildAlternates } from "@/lib/utils";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: buildAlternates(hasLang(lang) ? lang : "el", "/") };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  const dict = getDict(lang);
  const [nextMatch, recentResults, featuredPlayers, latestArticles, homeContent] = await Promise.all([
    getCmsNextMatch("men"),
    getCmsRecentResults(3),
    getCmsFeaturedPlayers(),
    getCmsLatestArticles(3),
    getCmsHomeContent(),
  ]);

  return (
    <>
      <Hero
        lang={lang}
        nextMatch={nextMatch}
        strings={{
          eyebrow: homeContent.heroEyebrow[lang],
          title1: homeContent.heroTitle1[lang],
          titleAccent: homeContent.heroTitleAccent[lang],
          title2: homeContent.heroTitle2[lang],
          text: homeContent.heroText[lang],
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
