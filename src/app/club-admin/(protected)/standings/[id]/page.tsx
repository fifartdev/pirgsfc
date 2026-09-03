import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditLeagueTableForm, type LeagueTableEditData, type LeagueTableRow } from "./EditLeagueTableForm";

type Option = { value: string; label: string };

const toOptions = <T extends { id: string | number }>(
  docs: T[],
  labelFn: (d: T) => string
): Option[] => docs.map((d) => ({ value: String(d.id), label: labelFn(d) }));

export default async function EditLeagueTablePage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let table: LeagueTableEditData;
  try {
    const doc = await payload.findByID({ collection: "league-tables", id, depth: 1 });
    const season = doc.season as { id?: string | number } | number | string | null;
    const league = doc.league as { id?: string | number } | number | string | null;
    const rawRows = (Array.isArray(doc.rows) ? doc.rows : []) as Record<string, unknown>[];

    table = {
      id: String(doc.id),
      season: season != null ? String(typeof season === "object" ? season.id : season) : undefined,
      league: league != null ? String(typeof league === "object" ? league.id : league) : undefined,
      leagueName:
        league != null && typeof league === "object" ? String((league as { name?: string }).name ?? "") : "",
      rows: rawRows.map(
        (r): LeagueTableRow => ({
          club: (() => {
            const club = r.club as { id?: string | number } | number | string | null | undefined;
            if (club == null) return "";
            return String(typeof club === "object" ? club.id ?? "" : club);
          })(),
          isPyrgos: Boolean(r.isPyrgos),
          played: (r.played as number | undefined) ?? 0,
          won: (r.won as number | undefined) ?? 0,
          drawn: (r.drawn as number | undefined) ?? 0,
          lost: (r.lost as number | undefined) ?? 0,
          goalsFor: (r.goalsFor as number | undefined) ?? 0,
          goalsAgainst: (r.goalsAgainst as number | undefined) ?? 0,
          points: (r.points as number | undefined) ?? 0,
          notes: (r.notes as string | undefined) ?? "",
        })
      ),
    };
  } catch {
    notFound();
  }

  const [seasonsRes, leaguesRes, clubsRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "leagues", sort: "name", limit: 50 }),
    payload.find({ collection: "clubs", where: { status: { equals: "active" } }, sort: "name", limit: 200 }),
  ]);

  return (
    <EditLeagueTableForm
      table={table}
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], (d) => d.title)}
      leagueOptions={toOptions(leaguesRes.docs as { id: string; name: string }[], (d) => d.name)}
      clubOptions={toOptions(clubsRes.docs as { id: string; name: string }[], (d) => d.name)}
    />
  );
}
