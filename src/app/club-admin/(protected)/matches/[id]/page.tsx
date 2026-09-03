import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditMatchForm, type MatchEditData } from "./EditMatchForm";

type Option = { value: string; label: string };

const toOptions = (docs: { id: string | number; [key: string]: unknown }[], labelKey: string): Option[] =>
  docs.map((d) => ({ value: String(d.id), label: String(d[labelKey] ?? "") }));

const toRelationId = (value: unknown): string | undefined => {
  if (value == null) return undefined;
  if (typeof value === "object") return String((value as { id?: string | number }).id ?? "");
  return String(value);
};

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let match: MatchEditData;
  try {
    const doc = await payload.findByID({ collection: "matches", id, depth: 0 });
    match = {
      id: String(doc.id),
      season: toRelationId(doc.season),
      team: toRelationId(doc.team),
      league: toRelationId(doc.league),
      venue: toRelationId(doc.venue),
      opponentClub: toRelationId(doc.opponentClub),
      homeTeamName: (doc.homeTeamName as string) ?? "",
      awayTeamName: (doc.awayTeamName as string) ?? "",
      matchType: (doc.matchType as string | undefined) ?? undefined,
      matchDate: doc.matchDate ? (doc.matchDate as string).slice(0, 10) : undefined,
      kickoffTime: (doc.kickoffTime as string | undefined) ?? undefined,
      matchweek: (doc.matchweek as string | undefined) ?? undefined,
      isHomeMatch: Boolean(doc.isHomeMatch),
      homeScore: (doc.homeScore as number | undefined) ?? undefined,
      awayScore: (doc.awayScore as number | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "scheduled",
    };
  } catch {
    notFound();
  }

  const [seasonsRes, teamsRes, leaguesRes, venuesRes, clubsRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "teams", sort: "name", limit: 50 }),
    payload.find({ collection: "leagues", sort: "name", limit: 50 }),
    payload.find({ collection: "venues", sort: "name", limit: 50 }),
    payload.find({ collection: "clubs", where: { status: { equals: "active" } }, sort: "name", limit: 200 }),
  ]);

  return (
    <EditMatchForm
      match={match}
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], "title")}
      teamOptions={toOptions(teamsRes.docs as { id: string; name: string }[], "name")}
      leagueOptions={toOptions(leaguesRes.docs as { id: string; name: string }[], "name")}
      venueOptions={toOptions(venuesRes.docs as { id: string; name: string }[], "name")}
      clubOptions={toOptions(clubsRes.docs as { id: string; name: string }[], "name")}
    />
  );
}
