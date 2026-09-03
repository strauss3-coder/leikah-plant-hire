"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Paperclip, Trash2, X } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { STORAGE_BUCKETS } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

/* ============================================================================
   ATTACHMENTS

   Photographs of a failure tell us more in one frame than three paragraphs, so
   this is deliberately prominent on the quote form.

   Files upload straight to Supabase Storage from the browser and only the
   resulting object paths travel through the server action — so a 20 MB
   photograph never has to pass through a serverless function body limit. When
   storage is not configured the picker still records the file names, so the
   enquiry carries a note of what the sender intended to send.
   ========================================================================= */

export interface Attachment {
  name: string;
  path: string;
  size: number;
  type: string;
}

const MAX_FILES = 10;
const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDrop({
  value,
  onChange,
  label = "Photographs, specifications or drawings",
  hint = "Photographs of the machine, the fault or the site. JPG, PNG or PDF, up to 20 MB each.",
  max = MAX_FILES,
}: {
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
  label?: string;
  hint?: string;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setError(null);

      const room = max - value.length;
      if (room <= 0) {
        setError(`You can attach up to ${max} files.`);
        return;
      }

      const selected = Array.from(files).slice(0, room);
      const rejected = selected.filter(
        (f) => f.size > MAX_BYTES || (ACCEPTED.length > 0 && !ACCEPTED.includes(f.type) && f.type !== ""),
      );

      if (rejected.length) {
        setError(
          rejected.some((f) => f.size > MAX_BYTES)
            ? "Some files are over 20 MB. Send those by email and we will match them up."
            : "Some file types are not accepted. Use JPG, PNG, PDF or Office documents.",
        );
      }

      const accepted = selected.filter((f) => !rejected.includes(f));
      if (!accepted.length) return;

      setBusy(true);
      const supabase = getBrowserSupabase();
      const uploaded: Attachment[] = [];

      for (const file of accepted) {
        if (!supabase) {
          // Storage not configured — record the intent so the enquiry is honest
          // about what the sender tried to attach.
          uploaded.push({ name: file.name, path: "", size: file.size, type: file.type });
          continue;
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.enquiries)
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          setError("One or more files could not be uploaded. You can send them by email instead.");
          continue;
        }

        uploaded.push({ name: file.name, path, size: file.size, type: file.type });
      }

      setBusy(false);
      if (uploaded.length) onChange([...value, ...uploaded]);
      if (inputRef.current) inputRef.current.value = "";
    },
    [value, onChange, max],
  );

  return (
    <div className="flex flex-col gap-3">
      <span className="flex items-baseline gap-2 text-sm font-medium text-steel-200">
        {label}
        <span className="text-xs text-steel-500">optional — but it helps a lot</span>
      </span>
      <p className="text-xs leading-relaxed text-steel-500">{hint}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "chamfer-sm flex flex-col items-center justify-center gap-3 border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-gold-500 bg-gold-500/6" : "border-steel-600/30 bg-ink-900/60",
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-gold-500" />
        ) : (
          <Paperclip className="size-6 text-steel-400" />
        )}

        <p className="text-sm text-steel-300">
          Drag files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-gold-400 underline underline-offset-4 hover:text-gold-300"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-steel-500 tabular">
          {value.length} of {max} attached
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={(e) => void handleFiles(e.target.files)}
          className="sr-only"
          aria-label="Choose files to attach"
        />
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-signal-red">
          <X className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}

      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="chamfer-sm flex items-center gap-3 border border-steel-600/22 bg-ink-900 px-4 py-3"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="size-4 shrink-0 text-gold-500" />
              ) : (
                <FileText className="size-4 shrink-0 text-gold-500" />
              )}
              <span className="flex-1 truncate text-sm text-steel-200">{file.name}</span>
              <span className="shrink-0 text-xs text-steel-500 tabular">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 text-steel-500 transition-colors hover:text-signal-red"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
