import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { NewRosterForm } from "./NewRosterForm";

export const metadata: Metadata = { title: "Νέα Εγγραφή Ρόστερ" };

export default async function NewRosterPage() {
  const { payload } = await requireClubAdmin();

  const [seasonsRes, teamsRes, playersRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "teams", sort: "name", limit: 50 }),
    payload.find({ collection: "players", sort: "lastName", limit: 300 }),
  ]);

  type Option = { value: string; label: string };

  const toOptions = <T extends { id: string | number }>(
    docs: T[],
    labelFn: (d: T) => string
  ): Option[] => docs.map((d) => ({ value: String(d.id), label: labelFn(d) }));

  return (
    <NewRosterForm
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], (d) => d.title)}
      teamOptions={toOptions(teamsRes.docs as { id: string; name: string }[], (d) => d.name)}
      playerOptions={toOptions(playersRes.docs as { id: string; fullName: string; firstName: string; lastName: string }[], (d) => d.fullName || `${d.firstName} ${d.lastName}`)}
    />
  );
}
