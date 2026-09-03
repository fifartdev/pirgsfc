"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { TeamSideField } from "@/components/club-admin/TeamSideField";
import { updateMatchAction } from "@/lib/club-admin/actions";

export interface MatchEditData {
  id: string;
  season?: string;
  team?: string;
  league?: string;
  venue?: string;
  opponentClub?: string;
  homeTeamName: string;
  awayTeamName: string;
  matchType?: string;
  matchDate?: string;
  kickoffTime?: string;
  matchweek?: string;
  isHomeMatch?: boolean;
  homeScore?: number;
  awayScore?: number;
  status?: string;
}

interface Props {
  match: MatchEditData;
  seasonOptions: { value: string; label: string }[];
  teamOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
  venueOptions: { value: string; label: string }[];
  clubOptions: { value: string; label: string }[];
}

export function EditMatchForm({ match, seasonOptions, teamOptions, leagueOptions, venueOptions, clubOptions }: Props) {
  const [state, formAction, isPending] = useActionState(updateMatchAction, null);

  // Derive each side's current select value from the stored isHomeMatch +
  // opponentClub (or fall back to "manual" using the plain-text name already
  // on the match, for matches created before opponentClub existed).
  const opponentDefault = match.opponentClub || "__manual__";
  const homeDefaultSelect = match.isHomeMatch ? "PYRGOS" : opponentDefault;
  const awayDefaultSelect = match.isHomeMatch ? opponentDefault : "PYRGOS";
  const homeDefaultManual = !match.isHomeMatch && !match.opponentClub ? match.homeTeamName : undefined;
  const awayDefaultManual = match.isHomeMatch && !match.opponentClub ? match.awayTeamName : undefined;

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/matches" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Πίσω στους αγώνες
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">
        Επεξεργασία — {match.homeTeamName} — {match.awayTeamName}
      </h1>

      {state?.success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Οι αλλαγές αποθηκεύτηκαν επιτυχώς.
        </div>
      )}
      {state?.error && (
        <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={match.id} />

        <FormField label="Σεζόν *" name="season" type="select" required defaultValue={match.season} options={seasonOptions} />
        <FormField label="Ομάδα PYRGOS AFC *" name="team" type="select" required defaultValue={match.team} options={teamOptions} />
        <FormField label="Διοργάνωση *" name="league" type="select" required defaultValue={match.league} options={leagueOptions} />
        <FormField
          label="Γήπεδο"
          name="venue"
          type="select"
          defaultValue={match.venue}
          options={[{ value: "", label: "— Χωρίς γήπεδο —" }, ...venueOptions]}
        />
        <div className="grid grid-cols-2 gap-4">
          <TeamSideField
            label="Γηπεδούχος"
            selectName="homeSelect"
            manualName="homeManual"
            clubOptions={clubOptions}
            defaultSelectValue={homeDefaultSelect}
            defaultManualValue={homeDefaultManual}
          />
          <TeamSideField
            label="Φιλοξενούμενος"
            selectName="awaySelect"
            manualName="awayManual"
            clubOptions={clubOptions}
            defaultSelectValue={awayDefaultSelect}
            defaultManualValue={awayDefaultManual}
          />
        </div>
        <FormField
          label="Τύπος αγώνα"
          name="matchType"
          type="select"
          defaultValue={match.matchType ?? "league"}
          options={[
            { value: "league", label: "Πρωτάθλημα" },
            { value: "cup", label: "Κύπελλο" },
            { value: "friendly", label: "Φιλικό" },
            { value: "tournament", label: "Τουρνουά" },
            { value: "playoff", label: "Play-off" },
          ]}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ημερομηνία *" name="matchDate" type="date" required defaultValue={match.matchDate} />
          <FormField label="Ώρα έναρξης" name="kickoffTime" defaultValue={match.kickoffTime} />
        </div>
        <FormField label="Αγωνιστική / Φάση" name="matchweek" defaultValue={match.matchweek} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Γκολ γηπεδούχου" name="homeScore" type="number" min={0} defaultValue={match.homeScore} />
          <FormField label="Γκολ φιλοξενούμενου" name="awayScore" type="number" min={0} defaultValue={match.awayScore} />
        </div>

        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={match.status ?? "scheduled"}
          options={[
            { value: "scheduled", label: "Προγραμματισμένος" },
            { value: "completed", label: "Ολοκληρώθηκε" },
            { value: "postponed", label: "Αναβλήθηκε" },
            { value: "cancelled", label: "Ακυρώθηκε" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link href="/club-admin/matches" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
