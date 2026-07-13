"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface MediaUploadProps {
  name?: string;
  label: string;
  currentUrl?: string;
  currentId?: string;
  /** Suppresses the built-in hidden input — for use inside a repeater whose
   *  own submit-time serialization (e.g. a rowsJson blob) carries the id instead. */
  hideHiddenInput?: boolean;
  /** Called after a successful upload/clear — lets a parent (e.g. a repeater
   *  row) track the id/url in its own state instead of relying on form name. */
  onUploaded?: (id: string | undefined, url: string | undefined) => void;
}

export function MediaUpload({
  name,
  label,
  currentUrl,
  currentId,
  hideHiddenInput,
  onUploaded,
}: MediaUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl);
  const [mediaId, setMediaId] = useState<string | undefined>(currentId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setError(undefined);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, "") }));

      const res = await fetch("/api/media", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });

      const json = (await res.json()) as {
        doc?: { id: string | number; url?: string };
        errors?: { message: string }[];
      };

      if (!res.ok || (json.errors && json.errors.length > 0)) {
        throw new Error(json.errors?.[0]?.message ?? "Αποτυχία μεταφόρτωσης");
      }

      if (!json.doc) throw new Error("Αποτυχία μεταφόρτωσης");

      setMediaId(String(json.doc.id));
      setPreviewUrl(json.doc.url);
      onUploaded?.(String(json.doc.id), json.doc.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Αποτυχία μεταφόρτωσης.");
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    setPreviewUrl(undefined);
    setMediaId(undefined);
    setError(undefined);
    onUploaded?.(undefined, undefined);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>

      {!hideHiddenInput && <input type="hidden" name={name} value={mediaId ?? ""} />}

      <div className="flex flex-col gap-2">
        <div className="relative h-36 w-52 overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {previewUrl ? (
            <>
              <Image src={previewUrl} alt={label} fill className="object-cover" unoptimized />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
              <span>{uploading ? "Μεταφόρτωση…" : "Δεν έχει επιλεγεί εικόνα"}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {previewUrl ? "Αλλαγή εικόνας" : "Επιλογή εικόνας"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
