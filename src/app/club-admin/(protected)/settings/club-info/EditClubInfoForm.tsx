"use client";

import { useActionState, useState } from "react";
import { useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { updateClubInfoAction } from "@/lib/club-admin/actions";

export interface ClubValueEdit {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface ClubSponsorEdit {
  name: string;
  tier: string;
  tagline: string;
  taglineEn: string;
  url: string;
  logoId?: string;
  logoUrl?: string;
}

export interface ClubInfoEditData {
  name: string;
  nameEn: string;
  shortName: string;
  founded?: number;
  logoId?: string;
  logoUrl?: string;
  colorsPrimary: string;
  colorsSecondary: string;
  colorsAccent: string;
  stadiumName: string;
  stadiumNameEn: string;
  stadiumCapacity: string;
  stadiumOpened?: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactAddressEn: string;
  contactCity: string;
  contactPostalCode: string;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
  socialYoutube: string;
  socialTiktok: string;
  about: unknown;
  aboutEn: unknown;
  values: ClubValueEdit[];
  sponsors: ClubSponsorEdit[];
}

const EMPTY_VALUE: ClubValueEdit = { title: "", titleEn: "", description: "", descriptionEn: "" };
const EMPTY_SPONSOR: ClubSponsorEdit = { name: "", tier: "partner", tagline: "", taglineEn: "", url: "" };

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";

function reorder<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function EditClubInfoForm({ data }: { data: ClubInfoEditData }) {
  const [state, formAction, isPending] = useActionState(updateClubInfoAction, null);
  const [values, setValues] = useState<ClubValueEdit[]>(data.values);
  const [sponsors, setSponsors] = useState<ClubSponsorEdit[]>(data.sponsors);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  function updateValue<K extends keyof ClubValueEdit>(index: number, key: K, val: ClubValueEdit[K]) {
    setValues((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: val } : v)));
  }
  function updateSponsor<K extends keyof ClubSponsorEdit>(index: number, key: K, val: ClubSponsorEdit[K]) {
    setSponsors((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: val } : s)));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Πληροφορίες Συλλόγου</h1>
      <p className="mb-8 text-sm text-gray-400">
        Στοιχεία, επικοινωνία, δίκτυα, αξίες και χορηγοί — εμφανίζονται στο footer και στις σελίδες
        &quot;Σχετικά&quot; / &quot;Επικοινωνία&quot; του δημόσιου ιστοτόπου.
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
        <input type="hidden" name="valuesJson" value={JSON.stringify(values)} readOnly />
        <input
          type="hidden"
          name="sponsorsJson"
          value={JSON.stringify(sponsors.map((s) => ({ ...s, logo: s.logoId })))}
          readOnly
        />

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Βασικά στοιχεία</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Επίσημο όνομα (ελλ.)" name="name" defaultValue={data.name} />
            <FormField label="Επίσημο όνομα (αγγλ.)" name="nameEn" defaultValue={data.nameEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Σύντομο όνομα" name="shortName" defaultValue={data.shortName} />
            <FormField label="Ίδρυση (έτος)" name="founded" type="number" defaultValue={data.founded} />
          </div>
          <div className="mt-4">
            <MediaUpload name="logo" label="Λογότυπο / Έμβλημα" currentId={data.logoId} currentUrl={data.logoUrl} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Χρώματα συλλόγου</h2>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Κύριο χρώμα (hex)" name="colorsPrimary" defaultValue={data.colorsPrimary} />
            <FormField label="Δευτερεύον χρώμα (hex)" name="colorsSecondary" defaultValue={data.colorsSecondary} />
            <FormField label="Χρώμα έμφασης (hex)" name="colorsAccent" defaultValue={data.colorsAccent} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Γήπεδο έδρας</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Όνομα γηπέδου (ελλ.)" name="stadiumName" defaultValue={data.stadiumName} />
            <FormField label="Όνομα γηπέδου (αγγλ.)" name="stadiumNameEn" defaultValue={data.stadiumNameEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Χωρητικότητα" name="stadiumCapacity" defaultValue={data.stadiumCapacity} />
            <FormField label="Έτος κατασκευής" name="stadiumOpened" type="number" defaultValue={data.stadiumOpened} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Στοιχεία επικοινωνίας</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" name="contactEmail" type="email" defaultValue={data.contactEmail} />
            <FormField label="Τηλέφωνο" name="contactPhone" defaultValue={data.contactPhone} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Διεύθυνση (ελλ.)" name="contactAddress" defaultValue={data.contactAddress} />
            <FormField label="Διεύθυνση (αγγλ.)" name="contactAddressEn" defaultValue={data.contactAddressEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Πόλη" name="contactCity" defaultValue={data.contactCity} />
            <FormField label="ΤΚ" name="contactPostalCode" defaultValue={data.contactPostalCode} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Μέσα κοινωνικής δικτύωσης</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Instagram URL" name="socialInstagram" defaultValue={data.socialInstagram} />
            <FormField label="X / Twitter URL" name="socialTwitter" defaultValue={data.socialTwitter} />
            <FormField label="Facebook URL" name="socialFacebook" defaultValue={data.socialFacebook} />
            <FormField label="YouTube URL" name="socialYoutube" defaultValue={data.socialYoutube} />
            <FormField label="TikTok URL" name="socialTiktok" defaultValue={data.socialTiktok} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Σχετικά με τον σύλλογο</h2>
          <div className="space-y-4">
            <RichTextEditor name="about" label="Κείμενο (ελλ.)" defaultValue={data.about} />
            <RichTextEditor name="aboutEn" label="Κείμενο (αγγλ.)" defaultValue={data.aboutEn} />
          </div>
        </div>

        <div className={SECTION}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Αξίες συλλόγου ({values.length})
            </h2>
            <button
              type="button"
              onClick={() => setValues((prev) => [...prev, { ...EMPTY_VALUE }])}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <Plus className="h-3.5 w-3.5" /> Προσθήκη αξίας
            </button>
          </div>
          <div className="space-y-4">
            {values.length === 0 && (
              <p className="text-sm text-gray-500">Δεν έχουν προστεθεί αξίες ακόμα.</p>
            )}
            {values.map((v, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setValues((p) => reorder(p, index, -1))} disabled={index === 0} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setValues((p) => reorder(p, index, 1))} disabled={index === values.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setValues((p) => p.filter((_, i) => i !== index))} className="rounded p-1.5 text-red-400 hover:bg-red-600/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Τίτλος (ελλ.)"
                    value={v.title}
                    onChange={(e) => updateValue(index, "title", e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Title (en)"
                    value={v.titleEn}
                    onChange={(e) => updateValue(index, "titleEn", e.target.value)}
                  />
                  <textarea
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Περιγραφή (ελλ.)"
                    rows={2}
                    value={v.description}
                    onChange={(e) => updateValue(index, "description", e.target.value)}
                  />
                  <textarea
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Description (en)"
                    rows={2}
                    value={v.descriptionEn}
                    onChange={(e) => updateValue(index, "descriptionEn", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={SECTION}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Χορηγοί ({sponsors.length})
            </h2>
            <button
              type="button"
              onClick={() => setSponsors((prev) => [...prev, { ...EMPTY_SPONSOR }])}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <Plus className="h-3.5 w-3.5" /> Προσθήκη χορηγού
            </button>
          </div>
          <div className="space-y-4">
            {sponsors.length === 0 && (
              <p className="text-sm text-gray-500">Δεν έχουν προστεθεί χορηγοί ακόμα.</p>
            )}
            {sponsors.map((s, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setSponsors((p) => reorder(p, index, -1))} disabled={index === 0} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setSponsors((p) => reorder(p, index, 1))} disabled={index === sponsors.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setSponsors((p) => p.filter((_, i) => i !== index))} className="rounded p-1.5 text-red-400 hover:bg-red-600/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Όνομα χορηγού"
                    value={s.name}
                    onChange={(e) => updateSponsor(index, "name", e.target.value)}
                  />
                  <select
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-red-600/60 focus:outline-none"
                    value={s.tier}
                    onChange={(e) => updateSponsor(index, "tier", e.target.value)}
                  >
                    <option value="principal">Κύριος χορηγός</option>
                    <option value="official">Επίσημος χορηγός</option>
                    <option value="partner">Συνεργάτης</option>
                  </select>
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Tagline (ελλ.)"
                    value={s.tagline}
                    onChange={(e) => updateSponsor(index, "tagline", e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Tagline (en)"
                    value={s.taglineEn}
                    onChange={(e) => updateSponsor(index, "taglineEn", e.target.value)}
                  />
                  <input
                    className="col-span-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none"
                    placeholder="Σύνδεσμος (https://...)"
                    value={s.url}
                    onChange={(e) => updateSponsor(index, "url", e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <MediaUpload
                    label="Λογότυπο χορηγού"
                    currentId={s.logoId}
                    currentUrl={s.logoUrl}
                    hideHiddenInput
                    onUploaded={(id, url) => {
                      updateSponsor(index, "logoId", id);
                      updateSponsor(index, "logoUrl", url);
                    }}
                  />
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
