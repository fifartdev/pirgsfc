"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, Plus, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateLeagueTableAction, deleteLeagueTableAction } from "@/lib/club-admin/actions";

export interface LeagueTableRow {
  club: string;
  isPyrgos: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  notes: string;
}

export interface LeagueTableEditData {
  id: string;
  season?: string;
  league?: string;
  leagueName: string;
  rows: LeagueTableRow[];
}

interface Props {
  table: LeagueTableEditData;
  seasonOptions: { value: string; label: string }[];
  leagueOptions: { value: string; label: string }[];
  clubOptions: { value: string; label: string }[];
}

const EMPTY_ROW: LeagueTableRow = {
  club: "",
  isPyrgos: false,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
  notes: "",
};

const numberInput =
  "w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-white focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40";
const textInput =
  "w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40";
const selectInput =
  "w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-red-600/60 focus:outline-none focus:ring-1 focus:ring-red-600/40";

export function EditLeagueTableForm({ table, seasonOptions, leagueOptions, clubOptions }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<LeagueTableRow[]>(table.rows);
  const [state, formAction, isPending] = useActionState(updateLeagueTableAction, null);
  const [deleting, setDeleting] = useState(false);

  function updateRow<K extends keyof LeagueTableRow>(index: number, key: K, value: LeagueTableRow[K]) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function moveRow(index: number, direction: -1 | 1) {
    setRows((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleDelete() {
    if (!confirm("Διαγραφή ολόκληρου του πίνακα βαθμολογίας; Η ενέργεια δεν αναιρείται.")) return;
    setDeleting(true);
    const res = await deleteLeagueTableAction(table.id);
    if (res.success) {
      router.push("/club-admin/standings");
    } else {
      setDeleting(false);
      alert(res.error ?? "Σφάλμα διαγραφής.");
    }
  }

  return (
    <div>
      <Link
        href="/club-admin/standings"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στη βαθμολογία
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Επεξεργασία Πίνακα{table.leagueName ? ` — ${table.leagueName}` : ""}
        </h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-lg border border-red-600/30 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-600/10 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Διαγραφή πίνακα
        </button>
      </div>

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

      <form action={formAction}>
        <input type="hidden" name="id" value={table.id} />
        <input type="hidden" name="rowsJson" value={JSON.stringify(rows)} readOnly />

        <div className="mb-6 grid max-w-lg grid-cols-2 gap-4">
          <FormField label="Σεζόν *" name="season" type="select" required defaultValue={table.season} options={seasonOptions} />
          <FormField label="Διοργάνωση *" name="league" type="select" required defaultValue={table.league} options={leagueOptions} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Ομάδες ({rows.length})
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Προσθήκη ομάδας
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-2 py-3 text-left">#</th>
                <th className="min-w-[200px] px-2 py-3 text-left">Σύλλογος</th>
                <th className="px-2 py-3">PAFC</th>
                <th className="px-2 py-3">Αγ.</th>
                <th className="px-2 py-3">Ν</th>
                <th className="px-2 py-3">Ι</th>
                <th className="px-2 py-3">Η</th>
                <th className="px-2 py-3">ΓΥ</th>
                <th className="px-2 py-3">ΓΚ</th>
                <th className="px-2 py-3">Βαθμ.</th>
                <th className="min-w-[140px] px-2 py-3 text-left">Σημειώσεις</th>
                <th className="px-2 py-3 text-right">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.02]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-gray-400">
                    Δεν υπάρχουν ομάδες ακόμα. Πάτησε &quot;Προσθήκη ομάδας&quot;.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index} className={row.isPyrgos ? "bg-red-600/5" : undefined}>
                    <td className="px-2 py-2 text-center tabular-nums text-gray-400">{index + 1}</td>
                    <td className="px-2 py-2">
                      {row.isPyrgos ? (
                        <span className="font-semibold text-white">PYRGOS AFC</span>
                      ) : (
                        <select
                          className={selectInput}
                          value={row.club}
                          onChange={(e) => updateRow(index, "club", e.target.value)}
                        >
                          <option value="">— Επιλογή συλλόγου —</option>
                          {clubOptions.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.isPyrgos}
                        onChange={(e) => updateRow(index, "isPyrgos", e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-white/10 accent-red-600"
                      />
                    </td>
                    {(["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"] as const).map(
                      (key) => (
                        <td key={key} className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            className={numberInput}
                            value={row[key]}
                            onChange={(e) => updateRow(index, key, Number(e.target.value) || 0)}
                          />
                        </td>
                      )
                    )}
                    <td className="px-2 py-2">
                      <input
                        className={textInput}
                        value={row.notes}
                        onChange={(e) => updateRow(index, "notes", e.target.value)}
                        placeholder="π.χ. -3 βαθμοί"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => moveRow(index, -1)}
                          disabled={index === 0}
                          className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                          title="Μετακίνηση πάνω"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveRow(index, 1)}
                          disabled={index === rows.length - 1}
                          className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                          title="Μετακίνηση κάτω"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="rounded p-1.5 text-red-400 hover:bg-red-600/10"
                          title="Αφαίρεση ομάδας"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Η σειρά των ομάδων στον πίνακα καθορίζει τη θέση τους στη βαθμολογία (η πρώτη σειρά = 1η θέση).
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
          <Link
            href="/club-admin/standings"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
