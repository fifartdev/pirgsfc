import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface EditInPayloadProps {
  collection: string;
  id: string;
  backHref: string;
  backLabel: string;
  entityLabel: string;
}

/**
 * For complex edits (rich text, media, relationships), we redirect to the
 * Payload admin panel.  Club admins who need this must have superadmin role,
 * or the superadmin performs the rich-content edit.
 *
 * This component shows a clean bridge UI with the entity title and a direct
 * link to the Payload editor.
 */
export function EditInPayload({
  collection,
  id,
  backHref,
  backLabel,
  entityLabel,
}: EditInPayloadProps) {
  const payloadUrl = `/admin/collections/${collection}/${id}`;

  return (
    <div className="max-w-2xl">
      <Link
        href={backHref}
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">
        Επεξεργασία — {entityLabel}
      </h1>
      <p className="mb-8 text-sm text-gray-400">ID: {id}</p>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-sm text-gray-300">
          Για πλήρη επεξεργασία (πλούσιο κείμενο, εικόνες, σχέσεις), ανοίξτε
          αυτήν την εγγραφή στο Payload admin panel.
        </p>
        <Link
          href={payloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Άνοιγμα στο Payload Admin
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
