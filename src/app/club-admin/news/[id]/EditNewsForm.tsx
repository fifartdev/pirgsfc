"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { updateNewsAction } from "@/lib/club-admin/actions";

export interface NewsEditData {
  id: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  author?: string;
  authorEn?: string;
  status?: string;
  publishedDate?: string;
  readingTime?: number;
  featuredImageId?: string;
  featuredImageUrl?: string;
}

export function EditNewsForm({ article }: { article: NewsEditData }) {
  const [state, formAction, isPending] = useActionState(updateNewsAction, null);

  useEffect(() => {
    if (state?.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/news"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στα νέα
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">
        Επεξεργασία — {article.title}
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
        <input type="hidden" name="id" value={article.id} />

        <FormField label="Τίτλος (ελλ.)" name="title" required defaultValue={article.title} />
        <FormField label="Τίτλος (αγγλ.)" name="titleEn" defaultValue={article.titleEn} />

        <FormField
          label="Περίληψη (ελλ.)"
          name="excerpt"
          type="textarea"
          defaultValue={article.excerpt}
        />
        <FormField
          label="Περίληψη (αγγλ.)"
          name="excerptEn"
          type="textarea"
          defaultValue={article.excerptEn}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Συγγραφέας (ελλ.)"
            name="author"
            defaultValue={article.author ?? "Ομάδα Επικοινωνίας"}
          />
          <FormField
            label="Author (EN)"
            name="authorEn"
            defaultValue={article.authorEn ?? "Club Media Team"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Κατάσταση"
            name="status"
            type="select"
            defaultValue={article.status ?? "draft"}
            options={[
              { value: "draft", label: "Πρόχειρο" },
              { value: "published", label: "Δημοσιευμένο" },
              { value: "archived", label: "Αρχειοθετημένο" },
            ]}
          />
          <FormField
            label="Χρόνος ανάγνωσης (λεπτά)"
            name="readingTime"
            type="number"
            min={1}
            defaultValue={article.readingTime ?? 3}
          />
        </div>

        <FormField
          label="Ημερομηνία δημοσίευσης"
          name="publishedDate"
          type="date"
          defaultValue={article.publishedDate}
        />

        <MediaUpload
          name="featuredImage"
          label="Κύρια εικόνα άρθρου"
          currentUrl={article.featuredImageUrl}
          currentId={article.featuredImageId}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link
            href="/club-admin/news"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
