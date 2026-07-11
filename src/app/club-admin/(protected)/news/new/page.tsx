"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { createNewsAction } from "@/lib/club-admin/actions";

export default function NewNewsPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createNewsAction, null);
  useEffect(() => { if (state?.success) router.push("/club-admin/news"); }, [state, router]);

  return (
    <div className="max-w-2xl">
      <Link href="/club-admin/news" className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Πίσω</Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Νέο Άρθρο</h1>
      {state?.error && <div className="mb-6 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
      <form action={formAction} className="space-y-5">
        <FormField label="Τίτλος (ελλ.) *" name="title" required placeholder="Τίτλος άρθρου…" />
        <FormField label="Τίτλος (αγγλ.)" name="titleEn" placeholder="Article title…" />
        <FormField label="Περίληψη (ελλ.)" name="excerpt" type="textarea" placeholder="Σύντομη περιγραφή…" />
        <FormField label="Περίληψη (αγγλ.)" name="excerptEn" type="textarea" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Συγγραφέας" name="author" defaultValue="Ομάδα Επικοινωνίας" />
          <FormField label="Author (EN)" name="authorEn" defaultValue="Club Media Team" />
        </div>
        <FormField label="Ημερομηνία δημοσίευσης" name="publishedDate" type="date" />
        <FormField label="Κατάσταση" name="status" type="select" defaultValue="draft" options={[
          { value: "draft", label: "Πρόχειρο" },
          { value: "published", label: "Δημοσιευμένο" },
          { value: "archived", label: "Αρχειοθετημένο" },
        ]} />
        <MediaUpload name="featuredImage" label="Κύρια εικόνα άρθρου" />
        <RichTextEditor name="content" label="Περιεχόμενο άρθρου (ελλ.)" />
        <RichTextEditor name="contentEn" label="Περιεχόμενο άρθρου (αγγλ.)" />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isPending ? "Αποθήκευση…" : "Αποθήκευση"}</button>
          <Link href="/club-admin/news" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5">Ακύρωση</Link>
        </div>
      </form>
    </div>
  );
}
