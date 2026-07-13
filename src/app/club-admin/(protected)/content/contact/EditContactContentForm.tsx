"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { updateContactContentAction } from "@/lib/club-admin/actions";

export interface ContactContentEditData {
  heroEyebrow: string;
  heroEyebrowEn: string;
  heroTitle1: string;
  heroTitle1En: string;
  heroTitleAccent: string;
  heroTitleAccentEn: string;
  heroText: string;
  heroTextEn: string;
  deptGeneralTitle: string;
  deptGeneralTitleEn: string;
  deptGeneralText: string;
  deptGeneralTextEn: string;
  deptGeneralEmail: string;
  deptMediaTitle: string;
  deptMediaTitleEn: string;
  deptMediaText: string;
  deptMediaTextEn: string;
  deptMediaEmail: string;
  deptSponsorshipsTitle: string;
  deptSponsorshipsTitleEn: string;
  deptSponsorshipsText: string;
  deptSponsorshipsTextEn: string;
  deptSponsorshipsEmail: string;
  deptAcademyTitle: string;
  deptAcademyTitleEn: string;
  deptAcademyText: string;
  deptAcademyTextEn: string;
  deptAcademyEmail: string;
  formEyebrow: string;
  formEyebrowEn: string;
  formTitle: string;
  formTitleEn: string;
  formText: string;
  formTextEn: string;
  detailsEyebrow: string;
  detailsEyebrowEn: string;
  detailsTitle: string;
  detailsTitleEn: string;
}

const SECTION = "rounded-xl border border-white/10 bg-white/[0.02] p-6";
const SECTION_TITLE = "mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400";

function DepartmentFields({
  label,
  prefix,
  data,
}: {
  label: string;
  prefix: string;
  data: ContactContentEditData;
}) {
  const get = (suffix: string) => (data as unknown as Record<string, string>)[`${prefix}${suffix}`];
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</h3>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Τίτλος (ελλ.)" name={`${prefix}Title`} defaultValue={get("Title")} />
        <FormField label="Τίτλος (αγγλ.)" name={`${prefix}TitleEn`} defaultValue={get("TitleEn")} />
        <FormField label="Κείμενο (ελλ.)" name={`${prefix}Text`} defaultValue={get("Text")} />
        <FormField label="Κείμενο (αγγλ.)" name={`${prefix}TextEn`} defaultValue={get("TextEn")} />
      </div>
      <div className="mt-3">
        <FormField label="Email" name={`${prefix}Email`} type="email" defaultValue={get("Email")} />
      </div>
    </div>
  );
}

export function EditContactContentForm({ data }: { data: ContactContentEditData }) {
  const [state, formAction, isPending] = useActionState(updateContactContentAction, null);

  useEffect(() => {
    if (state?.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Περιεχόμενο — Επικοινωνία</h1>
      <p className="mb-8 text-sm text-gray-400">
        Το κείμενο της σελίδας Επικοινωνίας — hero, τα τέσσερα τμήματα επικοινωνίας και οι επικεφαλίδες της φόρμας
        / των στοιχείων συλλόγου. Η διεύθυνση, το τηλέφωνο, το κύριο email και τα social links προέρχονται από τις
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
          <h2 className={SECTION_TITLE}>Τμήματα Επικοινωνίας</h2>
          <div className="space-y-4">
            <DepartmentFields label="Γενικές Πληροφορίες" prefix="deptGeneral" data={data} />
            <DepartmentFields label="Μέσα Ενημέρωσης" prefix="deptMedia" data={data} />
            <DepartmentFields label="Χορηγίες" prefix="deptSponsorships" data={data} />
            <DepartmentFields label="Υποδομές" prefix="deptAcademy" data={data} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Φόρμα επικοινωνίας</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="formEyebrow" defaultValue={data.formEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="formEyebrowEn" defaultValue={data.formEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="formTitle" defaultValue={data.formTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="formTitleEn" defaultValue={data.formTitleEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Κείμενο (ελλ.)" name="formText" type="textarea" defaultValue={data.formText} />
            <FormField label="Κείμενο (αγγλ.)" name="formTextEn" type="textarea" defaultValue={data.formTextEn} />
          </div>
        </div>

        <div className={SECTION}>
          <h2 className={SECTION_TITLE}>Στοιχεία συλλόγου (επικεφαλίδα)</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Υπότιτλος (ελλ.)" name="detailsEyebrow" defaultValue={data.detailsEyebrow} />
            <FormField label="Υπότιτλος (αγγλ.)" name="detailsEyebrowEn" defaultValue={data.detailsEyebrowEn} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Τίτλος (ελλ.)" name="detailsTitle" defaultValue={data.detailsTitle} />
            <FormField label="Τίτλος (αγγλ.)" name="detailsTitleEn" defaultValue={data.detailsTitleEn} />
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
