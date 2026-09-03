import type { Metadata } from "next";
import { requireClubAdmin } from "@/lib/club-admin/auth";
import { NewMatchForm } from "./NewMatchForm";

export const metadata: Metadata = { title: "Νέος Αγώνας" };

export default async function NewMatchPage() {
  const { payload } = await requireClubAdmin();

  const [seasonsRes, teamsRes, leaguesRes, venuesRes, clubsRes] = await Promise.all([
    payload.find({ collection: "seasons", sort: "-startYear", limit: 50 }),
    payload.find({ collection: "teams", sort: "name", limit: 50 }),
    payload.find({ collection: "leagues", sort: "name", limit: 50 }),
    payload.find({ collection: "venues", sort: "name", limit: 50 }),
    payload.find({ collection: "clubs", where: { status: { equals: "active" } }, sort: "name", limit: 200 }),
  ]);

  type Option = { value: string; label: string };

  const toOptions = (docs: { id: string | number; [key: string]: unknown }[], labelKey: string): Option[] =>
    docs.map((d) => ({ value: String(d.id), label: String(d[labelKey] ?? "") }));

  return (
    <NewMatchForm
      seasonOptions={toOptions(seasonsRes.docs as { id: string; title: string }[], "title")}
      teamOptions={toOptions(teamsRes.docs as { id: string; name: string }[], "name")}
      leagueOptions={toOptions(leaguesRes.docs as { id: string; name: string }[], "name")}
      venueOptions={toOptions(venuesRes.docs as { id: string; name: string }[], "name")}
      clubOptions={toOptions(clubsRes.docs as { id: string; name: string }[], "name")}
    />
  );
}
