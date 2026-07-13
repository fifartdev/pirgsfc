import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditRosterForm, type RosterEditData } from "./EditRosterForm";

type Option = { value: string; label: string };

const toOptions = <T extends { id: string | number }>(
  docs: T[],
  labelFn: (d: T) => string
): Option[] => docs.map((d) => ({ value: String(d.id), label: labelFn(d) }));

export default async function EditRosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let roster: RosterEditData;
  try {
    const doc = await payload.findByID({ collection: "rosters", id, depth: 1 });
    const player = doc.player as { id?: string | number; fullName?: string; firstName?: string; lastName?: string } | null;
    const season = doc.season as { id?: string | number } | number | string | null;
    const team = doc.team as { id?: string | number } | number | string | null;
    const stats = doc.stats as
      | {
          appearances?: number;
          goals?: number;
          assists?: number;
          yellowCards?: number;
          redCards?: number;
          minutesPlayed?: number;
          cleanSheets?: number;
        }
      | undefined;

    roster = {
      id: String(doc.id),
      season: season != null ? String(typeof season === "object" ? season.id : season) : undefined,
      team: team != null ? String(typeof team === "object" ? team.id : team) : undefined,
      player: player?.id != null ? String(player.id) : undefined,
      playerLabel: player ? (player.fullName || `${player.firstName ?? ""} ${player.lastName ?? ""}`.trim()) : undefined,
      shirtNumber: (doc.shirtNumber as number | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "active",
      isCaptain: Boolean(doc.isCaptain),
      isViceCaptain: Boolean(doc.isViceCaptain),
      joinedDate: doc.joinedDate ? (doc.joinedDate as string).slice(0, 10) : undefined,
      statsAppearances: stats?.appearances,
      statsGoals: stats?.goals,
      statsAssists: stats?.assists,
      statsYellowCards: stats?.yellowCards,
      statsRedCards: stats?.redCards,
      statsMinutesPlayed: stats?.minutesPlayed,
      statsCleanSheets: stats?.cleanSheets,
    };
  } catch {
    notFound();
  }

  const [seasonsRes, teamsRes, playersRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "teams", sort: "name", limit: 50 }),
    payload.find({ collection: "players", sort: "lastName", limit: 300 }),
  ]);

  return (
    <EditRosterForm
      roster={roster}
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], (d) => d.title)}
      teamOptions={toOptions(teamsRes.docs as { id: string; name: string }[], (d) => d.name)}
      playerOptions={toOptions(
        playersRes.docs as { id: string; fullName: string; firstName: string; lastName: string }[],
        (d) => d.fullName || `${d.firstName} ${d.lastName}`
      )}
    />
  );
}
