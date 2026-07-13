import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { NewStandingForm } from "./NewStandingForm";

export const metadata: Metadata = { title: "Νέα Εγγραφή Βαθμολογίας" };

type Option = { value: string; label: string };

const toOptions = <T extends { id: string | number }>(
  docs: T[],
  labelFn: (d: T) => string
): Option[] => docs.map((d) => ({ value: String(d.id), label: labelFn(d) }));

export default async function NewStandingPage() {
  const { payload } = await requireClubAdmin();

  const [seasonsRes, leaguesRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "leagues", sort: "name", limit: 50 }),
  ]);

  return (
    <NewStandingForm
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], (d) => d.title)}
      leagueOptions={toOptions(leaguesRes.docs as { id: string; name: string }[], (d) => d.name)}
    />
  );
}
