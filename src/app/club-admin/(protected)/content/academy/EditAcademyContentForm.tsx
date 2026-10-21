"use client";

import { useActionState, useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateAcademyContentAction } from "@/lib/club-admin/actions";
import { ACADEMY_GROUP_FIELDS, ACADEMY_TEXT_SECTIONS } from "@/lib/academy-fields";

type GroupEdit = Record<string, string>;

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";
const INPUT =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none";

const EMPTY_GROUP: GroupEdit = Object.fromEntries(
  ACADEMY_GROUP_FIELDS.flatMap(({ key }) => [[key, ""], [`${key}En`, ""]])
);

function reorder<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function EditAcademyContentForm({ texts, groups: initialGroups }: { texts: Record<string, string>; groups: GroupEdit[] }) {
  const [state, formAction, isPending] = useActionState(updateAcademyContentAction, null);
  const [groups, setGroups] = useState<GroupEdit[]>(initialGroups);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  function updateGroup(index: number, key: string, value: string) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, [key]: value } : g)));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Περιεχόμενο — Υποδομές</h1>
      <p className="mb-8 text-sm text-gray-400">
        Τα κείμενα και τα τμήματα (ηλικιακές κατηγορίες) της σελίδας &quot;Υποδομές&quot;.
      </p>

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

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="groupsJson" value={JSON.stringify(groups)} readOnly />

        {ACADEMY_TEXT_SECTIONS.map((section) => (
          <div key={section.title} className={SECTION}>
            <h2 className={SECTION_TITLE}>{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((f) => {
                const type = "textarea" in f ? "textarea" : undefined;
                return (
                  <div key={f.key} className="grid grid-cols-2 gap-4">
                    <FormField label={`${f.label} (ελλ.)`} name={f.key} type={type} defaultValue={texts[f.key]} />
                    <FormField label={`${f.label} (αγγλ.)`} name={`${f.key}En`} type={type} defaultValue={texts[`${f.key}En`]} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className={SECTION}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Τμήματα ({groups.length})
            </h2>
            <button
              type="button"
              onClick={() => setGroups((p) => [...p, { ...EMPTY_GROUP }])}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Προσθήκη τμήματος
            </button>
          </div>
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setGroups((p) => reorder(p, index, -1))} disabled={index === 0} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30" title="Μετακίνηση πάνω">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setGroups((p) => reorder(p, index, 1))} disabled={index === groups.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30" title="Μετακίνηση κάτω">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setGroups((p) => p.filter((_, i) => i !== index))} className="rounded p-1.5 text-red-400 hover:bg-red-600/10" title="Αφαίρεση τμήματος">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ACADEMY_GROUP_FIELDS.flatMap((f) =>
                    [
                      { name: f.key, placeholder: `${f.label} (ελλ.)` },
                      { name: `${f.key}En`, placeholder: `${f.label} (αγγλ.)` },
                    ].map(({ name, placeholder }) =>
                      "textarea" in f ? (
                        <textarea key={name} className={INPUT} rows={3} placeholder={placeholder} value={group[name] ?? ""} onChange={(e) => updateGroup(index, name, e.target.value)} />
                      ) : (
                        <input key={name} className={INPUT} placeholder={placeholder} value={group[name] ?? ""} onChange={(e) => updateGroup(index, name, e.target.value)} />
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
          </button>
        </div>
      </form>
    </div>
  );
}
