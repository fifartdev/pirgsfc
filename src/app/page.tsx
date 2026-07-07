import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { NextMatch } from "@/components/sections/NextMatch";
import { LatestResults } from "@/components/sections/LatestResults";
import { TeamHighlights } from "@/components/sections/TeamHighlights";
import { FeaturedPlayers } from "@/components/sections/FeaturedPlayers";
import { ClubValues } from "@/components/sections/ClubValues";
import { LatestNews } from "@/components/sections/LatestNews";
import { SponsorsStrip } from "@/components/sections/SponsorsStrip";
import { FanCTA } from "@/components/sections/FanCTA";
import { getNextMatch, getRecentResults } from "@/data/matches";
import { getFeaturedPlayers } from "@/data/players";
import { getLatestArticles } from "@/data/news";

export const metadata: Metadata = {
  title: "PYRGOS FC | Official Football Club Website",
  description:
    "The official digital home of PYRGOS FC. Discover fixtures, results, roster, news, staff, and the story of the club.",
};

export default function HomePage() {
  const nextMatch = getNextMatch();
  const recentResults = getRecentResults(3);
  const featuredPlayers = getFeaturedPlayers();
  const latestArticles = getLatestArticles(3);

  return (
    <>
      <Hero nextMatch={nextMatch} />
      {nextMatch && <NextMatch match={nextMatch} />}
      <LatestResults matches={recentResults} />
      <TeamHighlights />
      <FeaturedPlayers players={featuredPlayers} />
      <ClubValues />
      <LatestNews articles={latestArticles} />
      <SponsorsStrip />
      <FanCTA />
    </>
  );
}
