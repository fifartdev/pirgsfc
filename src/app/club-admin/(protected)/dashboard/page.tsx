import type { Metadata } from "next";
import Link from "next/link";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { Calendar, Users, Trophy, Newspaper, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Πίνακας Ελέγχου" };

type QuickStat = {
  label: string;
  value: number;
  href: string;
  icon: React.ElementType;
};

export default async function DashboardPage() {
  const { user, payload } = await requireClubAdmin();

  // Fetch quick stats from Payload
  const [matchesRes, playersRes, newsRes, seasonsRes] = await Promise.allSettled([
    payload.find({ collection: "matches", limit: 0 }),
    payload.find({ collection: "players", limit: 0 }),
    payload.find({ collection: "news", limit: 0 }),
    payload.find({ collection: "seasons", where: { isCurrent: { equals: true } }, limit: 1 }),
  ]);

  const totalMatches = matchesRes.status === "fulfilled" ? matchesRes.value.totalDocs : 0;
  const totalPlayers = playersRes.status === "fulfilled" ? playersRes.value.totalDocs : 0;
  const totalNews = newsRes.status === "fulfilled" ? newsRes.value.totalDocs : 0;
  const currentSeason =
    seasonsRes.status === "fulfilled" && seasonsRes.value.docs.length > 0
      ? (seasonsRes.value.docs[0] as { title?: string }).title
      : null;

  // Upcoming matches
  const upcomingRes = await payload
    .find({
      collection: "matches",
      where: { status: { equals: "scheduled" } },
      sort: "matchDate",
      limit: 5,
    })
    .catch(() => null);

  // Recent news
  const recentNewsRes = await payload
    .find({
      collection: "news",
      sort: "-publishedDate",
      limit: 5,
    })
    .catch(() => null);

  const stats: QuickStat[] = [
    { label: "Αγώνες", value: totalMatches, href: "/club-admin/matches", icon: Trophy },
    { label: "Παίκτες", value: totalPlayers, href: "/club-admin/players", icon: Users },
    { label: "Νέα", value: totalNews, href: "/club-admin/news", icon: Newspaper },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Καλωσήρθατε, {user.firstName ?? user.email} 👋
        </h1>
        {currentSeason && (
          <p className="mt-1 text-gray-400">
            Τρέχουσα σεζόν:{" "}
            <span className="font-semibold text-white">{currentSeason}</span>
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-red-600/40 hover:bg-white/[0.07]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600/20">
              <stat.icon className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-300" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming matches */}
        <div className="rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">
              <Calendar className="mr-2 inline-block h-4 w-4 text-red-400" />
              Επερχόμενοι Αγώνες
            </h2>
            <Link href="/club-admin/matches" className="text-xs text-gray-400 hover:text-white">
              Όλοι →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {!upcomingRes || upcomingRes.docs.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">
                Δεν βρέθηκαν επερχόμενοι αγώνες.
              </p>
            ) : (
              upcomingRes.docs.map((match) => {
                const m = match as {
                  id: string;
                  homeTeamName?: string;
                  awayTeamName?: string;
                  matchDate?: string;
                  matchweek?: string;
                };
                return (
                  <Link
                    key={m.id}
                    href={`/club-admin/matches/${m.id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-white/5"
                  >
                    <span className="text-gray-300">
                      {m.homeTeamName} — {m.awayTeamName}
                    </span>
                    <span className="text-gray-500">
                      {m.matchDate
                        ? new Date(m.matchDate).toLocaleDateString("el-GR")
                        : "—"}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Recent news */}
        <div className="rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">
              <Newspaper className="mr-2 inline-block h-4 w-4 text-red-400" />
              Πρόσφατα Νέα
            </h2>
            <Link href="/club-admin/news" className="text-xs text-gray-400 hover:text-white">
              Όλα →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {!recentNewsRes || recentNewsRes.docs.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">
                Δεν βρέθηκαν νέα.
              </p>
            ) : (
              recentNewsRes.docs.map((article) => {
                const a = article as {
                  id: string;
                  title?: string;
                  status?: string;
                  publishedDate?: string;
                };
                return (
                  <Link
                    key={a.id}
                    href={`/club-admin/news/${a.id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-white/5"
                  >
                    <span className="line-clamp-1 text-gray-300">{a.title ?? "—"}</span>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        a.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {a.status === "published" ? "Δημοσ." : "Πρόχ."}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Γρήγορες ενέργειες
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/club-admin/news/new", label: "Νέο άρθρο" },
            { href: "/club-admin/matches/new", label: "Νέος αγώνας" },
            { href: "/club-admin/players/new", label: "Νέος παίκτης" },
            { href: "/club-admin/rosters/new", label: "Νέα εγγραφή ρόστερ" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-red-600/40 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
