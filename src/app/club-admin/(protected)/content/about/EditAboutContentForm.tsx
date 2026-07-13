"use client";

import { useActionState, useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateAboutContentAction } from "@/lib/club-admin/actions";

export interface AboutTimelineEdit {
  year: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

export interface AboutContentEditData {
  heroEyebrow: string;
  heroEyebrowEn: string;
  heroTitle1: string;
  heroTitle1En: string;
  heroTitleAccent: string;
  heroTitleAccentEn: string;
  heroText: string;
  heroTextEn: string;
  missionEyebrow: string;
  missionEyebrowEn: string;
  missionTitle: string;
  missionTitleEn: string;
  mission1: string;
  mission1En: string;
  mission2: string;
  mission2En: string;
  mission3: string;
  mission3En: string;
  statFounded: string;
  statPlayers: string;
  statGroups: string;
  statCapacity: string;
  storyEyebrow: string;
  storyEyebrowEn: string;
  storyTitle: string;
  storyTitleEn: string;
  storyText: string;
  storyTextEn: string;
  timeline: AboutTimelineEdit[];
  stadiumEyebrow: string;
  stadiumEyebrowEn: string;
  stadiumTitle: string;
  stadiumTitleEn: string;
  stadiumText: string;
  stadiumTextEn: string;
  fansEyebrow: string;
  fansEyebrowEn: string;
  fansTitle: string;
  fansTitleEn: string;
  fansText: string;
  fansTextEn: string;
  fans1: string;
  fans1En: string;
  fans2: string;
  fans2En: string;
  quoteText: string;
  quoteTextEn: string;
  quoteName: string;
  quoteNameEn: string;
  quoteRole: string;
  quoteRoleEn: string;
}

const EMPTY_TIMELINE_ITEM: AboutTimelineEdit = { year: "", title: "", titleEn: "", text: "", textEn: "" };

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";

function reorder<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function EditAboutContentForm({ data }: { data: AboutContentEditData }) {
  const [state, formAction, isPending] = useActionState(updateAboutContentAction, null);
  const [timeline, setTimeline] = useState<AboutTimelineEdit[]>(data.timeline);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  function updateItem<K extends keyof AboutTimelineEdit>(index: number, key: K, val: AboutTimelineEdit[K]) {
    setTimeline((prev) => prev.map((t, i) => (i === index ? { ...t, [key]: val } : t)));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Περιεχόμενο — Σχετικά</h1>
      <p className="mb-8 text-sm text-gray-400">
        Το κείμενο της σελίδας &quot;Σχετικά&quot; — hero, αποστολή, στατιστικά, ιστορία/χρονολόγιο, γήπεδο,
        φίλαθλοι/κοινότητα και το απόφθεγμα. Οι &quot;Αξίες συλλόγου&quot; επεξεργάζονται ξεχωριστά στις
        Πληροφορίες Συλλόγου.
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
        <input type="hidden" name="timelineJson" value={JSON.stringify(timeline)} readOnly />

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Hero</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="heroEyebrow" defaultValue={data.heroEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="heroEyebrowEn" defaultValue={data.heroEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος μέρος 1 (ελλ.)" name="heroTitle1" defaultValue={data.heroTitle1} />
            <FormField label="Τίτλος μέρος 1 (αγγλ.)" name="heroTitle1En" defaultValue={data.heroTitle1En} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος έμφαση (ελλ.)" name="heroTitleAccent" defaultValue={data.heroTitleAccent} />
            <FormField label="Τίτλος έμφαση (αγγλ.)" name="heroTitleAccentEn" defaultValue={data.heroTitleAccentEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="heroText" type="textarea" defaultValue={data.heroText} />
            <FormField label="Κείμενο (αγγλ.)" name="heroTextEn" type="textarea" defaultValue={data.heroTextEn} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Αποστολή</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="missionEyebrow" defaultValue={data.missionEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="missionEyebrowEn" defaultValue={data.missionEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="missionTitle" defaultValue={data.missionTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="missionTitleEn" defaultValue={data.missionTitleEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Παράγραφος 1 (ελλ.)" name="mission1" type="textarea" defaultValue={data.mission1} />
            <FormField label="Παράγραφος 1 (αγγλ.)" name="mission1En" type="textarea" defaultValue={data.mission1En} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Παράγραφος 2 (ελλ.)" name="mission2" type="textarea" defaultValue={data.mission2} />
            <FormField label="Παράγραφος 2 (αγγλ.)" name="mission2En" type="textarea" defaultValue={data.mission2En} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Παράγραφος 3 (ελλ.)" name="mission3" type="textarea" defaultValue={data.mission3} />
            <FormField label="Παράγραφος 3 (αγγλ.)" name="mission3En" type="textarea" defaultValue={data.mission3En} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Στατιστικά (ίδιες τιμές και στις δύο γλώσσες)</h2>
          <div className="grid grid-cols-4 gap-4">
            <FormField label="Έτος ίδρυσης" name="statFounded" defaultValue={data.statFounded} />
            <FormField label="Παίκτες" name="statPlayers" defaultValue={data.statPlayers} />
            <FormField label="Ηλικιακά τμήματα" name="statGroups" defaultValue={data.statGroups} />
            <FormField label="Χωρητικότητα" name="statCapacity" defaultValue={data.statCapacity} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Ιστορία</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="storyEyebrow" defaultValue={data.storyEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="storyEyebrowEn" defaultValue={data.storyEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="storyTitle" defaultValue={data.storyTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="storyTitleEn" defaultValue={data.storyTitleEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="storyText" defaultValue={data.storyText} />
            <FormField label="Κείμενο (αγγλ.)" name="storyTextEn" defaultValue={data.storyTextEn} />
          </div>

          <div className="mt-6 mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Χρονολόγιο ({timeline.length})
            </h3>
            <button
              type="button"
              onClick={() => setTimeline((prev) => [...prev, { ...EMPTY_TIMELINE_ITEM }])}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <Plus className="h-3.5 w-3.5" /> Προσθήκη γεγονότος
            </button>
          </div>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setTimeline((p) => reorder(p, index, -1))} disabled={index === 0} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setTimeline((p) => reorder(p, index, 1))} disabled={index === timeline.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setTimeline((p) => p.filter((_, i) => i !== index))} className="rounded p-1.5 text-red-400 hover:bg-red-600/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  className="mb-3 w-32 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                  placeholder="Έτος"
                  value={item.year}
                  onChange={(e) => updateItem(index, "year", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Τίτλος (ελλ.)"
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Title (en)"
                    value={item.titleEn}
                    onChange={(e) => updateItem(index, "titleEn", e.target.value)}
                  />
                  <textarea
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Κείμενο (ελλ.)"
                    rows={2}
                    value={item.text}
                    onChange={(e) => updateItem(index, "text", e.target.value)}
                  />
                  <textarea
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Text (en)"
                    rows={2}
                    value={item.textEn}
                    onChange={(e) => updateItem(index, "textEn", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Γήπεδο</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="stadiumEyebrow" defaultValue={data.stadiumEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="stadiumEyebrowEn" defaultValue={data.stadiumEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="stadiumTitle" defaultValue={data.stadiumTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="stadiumTitleEn" defaultValue={data.stadiumTitleEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="stadiumText" type="textarea" defaultValue={data.stadiumText} />
            <FormField label="Κείμενο (αγγλ.)" name="stadiumTextEn" type="textarea" defaultValue={data.stadiumTextEn} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Φίλαθλοι &amp; Κοινότητα</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="fansEyebrow" defaultValue={data.fansEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="fansEyebrowEn" defaultValue={data.fansEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="fansTitle" defaultValue={data.fansTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="fansTitleEn" defaultValue={data.fansTitleEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="fansText" defaultValue={data.fansText} />
            <FormField label="Κείμενο (αγγλ.)" name="fansTextEn" defaultValue={data.fansTextEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Παράγραφος 1 (ελλ.)" name="fans1" type="textarea" defaultValue={data.fans1} />
            <FormField label="Παράγραφος 1 (αγγλ.)" name="fans1En" type="textarea" defaultValue={data.fans1En} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Παράγραφος 2 (ελλ.)" name="fans2" type="textarea" defaultValue={data.fans2} />
            <FormField label="Παράγραφος 2 (αγγλ.)" name="fans2En" type="textarea" defaultValue={data.fans2En} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Απόφθεγμα</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="quoteText" type="textarea" defaultValue={data.quoteText} />
            <FormField label="Κείμενο (αγγλ.)" name="quoteTextEn" type="textarea" defaultValue={data.quoteTextEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Όνομα (ελλ.)" name="quoteName" defaultValue={data.quoteName} />
            <FormField label="Όνομα (αγγλ.)" name="quoteNameEn" defaultValue={data.quoteNameEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Ιδιότητα (ελλ.)" name="quoteRole" defaultValue={data.quoteRole} />
            <FormField label="Ιδιότητα (αγγλ.)" name="quoteRoleEn" defaultValue={data.quoteRoleEn} />
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
