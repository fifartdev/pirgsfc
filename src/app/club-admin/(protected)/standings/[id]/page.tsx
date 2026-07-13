import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditStandingForm, type StandingEditData } from "./EditStandingForm";

type Option = { value: string; label: string };

const toOptions = <T extends { id: string | number }>(
  docs: T[],
  labelFn: (d: T) => string
): Option[] => docs.map((d) => ({ value: String(d.id), label: labelFn(d) }));

export default async function EditStandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let standing: StandingEditData;
  try {
    const doc = await payload.findByID({ collection: "standings", id, depth: 1 });
    const season = doc.season as { id?: string | number } | number | string | null;
    const league = doc.league as { id?: string | number } | number | string | null;

    standing = {
      id: String(doc.id),
      season: season != null ? String(typeof season === "object" ? season.id : season) : undefined,
      league: league != null ? String(typeof league === "object" ? league.id : league) : undefined,
      teamName: (doc.teamName as string) ?? "",
      teamNameEn: (doc.teamNameEn as string | undefined) ?? undefined,
      isPyrgos: Boolean(doc.isPyrgos),
      position: (doc.position as number | undefined) ?? undefined,
      played: (doc.played as number | undefined) ?? 0,
      won: (doc.won as number | undefined) ?? 0,
      drawn: (doc.drawn as number | undefined) ?? 0,
      lost: (doc.lost as number | undefined) ?? 0,
      goalsFor: (doc.goalsFor as number | undefined) ?? 0,
      goalsAgainst: (doc.goalsAgainst as number | undefined) ?? 0,
      points: (doc.points as number | undefined) ?? 0,
      notes: (doc.notes as string | undefined) ?? undefined,
    };
  } catch {
    notFound();
  }

  const [seasonsRes, leaguesRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "leagues", sort: "name", limit: 50 }),
  ]);

  return (
    <EditStandingForm
      standing={standing}
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], (d) => d.title)}
      leagueOptions={toOptions(leaguesRes.docs as { id: string; name: string }[], (d) => d.name)}
    />
  );
}
