"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { FormField } from "@/components/club-admin/FormField";
import { MediaUpload } from "@/components/club-admin/MediaUpload";
import { RichTextEditor } from "@/components/club-admin/RichTextEditor";
import { updatePlayerAction } from "@/lib/club-admin/actions";

export interface PlayerEditData {
  id: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  fullName?: string;
  position?: string;
  nationality?: string;
  nationalityEn?: string;
  preferredFoot?: string;
  status?: string;
  defaultShirtNumber?: number;
  heightCm?: number;
  weightKg?: number;
  profileImageId?: string;
  profileImageUrl?: string;
  biography?: unknown;
  biographyEn?: unknown;
}

export function EditPlayerForm({ player }: { player: PlayerEditData }) {
  const [state, formAction, isPending] = useActionState(updatePlayerAction, null);

  useEffect(() => {
    if (state?.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/club-admin/players"
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Πίσω στους παίκτες
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">
        Επεξεργασία — {player.fullName ?? `${player.firstName} ${player.lastName}`}
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
        <input type="hidden" name="id" value={player.id} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα" name="firstName" required defaultValue={player.firstName} />
          <FormField label="Επώνυμο" name="lastName" required defaultValue={player.lastName} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Όνομα (αγγλ.)" name="firstNameEn" defaultValue={player.firstNameEn} />
          <FormField label="Επώνυμο (αγγλ.)" name="lastNameEn" defaultValue={player.lastNameEn} />
        </div>

        <FormField
          label="Θέση"
          name="position"
          type="select"
          required
          defaultValue={player.position}
          options={[
            { value: "goalkeeper", label: "Τερματοφύλακας" },
            { value: "defender", label: "Αμυντικός" },
            { value: "midfielder", label: "Μέσος" },
            { value: "forward", label: "Επιθετικός" },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Εθνικότητα" name="nationality" defaultValue={player.nationality ?? "Ελληνική"} />
          <FormField label="Nationality (EN)" name="nationalityEn" defaultValue={player.nationalityEn ?? "Greek"} />
        </div>

        <FormField
          label="Προτιμώμενο πόδι"
          name="preferredFoot"
          type="select"
          defaultValue={player.preferredFoot}
          options={[
            { value: "right", label: "Δεξί" },
            { value: "left", label: "Αριστερό" },
            { value: "both", label: "Αμφίπλευρος" },
          ]}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Αρ. φανέλας"
            name="defaultShirtNumber"
            type="number"
            min={1}
            max={99}
            defaultValue={player.defaultShirtNumber}
          />
          <FormField
            label="Ύψος (cm)"
            name="heightCm"
            type="number"
            min={100}
            max={230}
            defaultValue={player.heightCm}
          />
          <FormField
            label="Βάρος (kg)"
            name="weightKg"
            type="number"
            min={40}
            max={150}
            defaultValue={player.weightKg}
          />
        </div>

        <FormField
          label="Κατάσταση"
          name="status"
          type="select"
          defaultValue={player.status ?? "active"}
          options={[
            { value: "active", label: "Ενεργός" },
            { value: "inactive", label: "Ανενεργός" },
            { value: "transferred", label: "Μεταγραφή" },
            { value: "retired", label: "Απόσυρση" },
          ]}
        />

        <MediaUpload
          name="profileImage"
          label="Φωτογραφία παίκτη"
          currentUrl={player.profileImageUrl}
          currentId={player.profileImageId}
        />

        <RichTextEditor name="biography" label="Βιογραφικό (ελλ.)" defaultValue={player.biography} />
        <RichTextEditor name="biographyEn" label="Βιογραφικό (αγγλ.)" defaultValue={player.biographyEn} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
          <Link
            href="/club-admin/players"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  );
}
