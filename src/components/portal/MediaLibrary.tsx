"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { AlertTriangle, Check, Loader2, Search, X } from "lucide-react";
import { PortalButton } from "./Primitives";
import { saveMediaAsset } from "@/lib/portal/actions";
import { getMedia } from "@/lib/cms/media";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  slug: string;
  title: string;
  alt: string;
  caption: string | null;
  tags: string[];
  width: number | null;
  height: number | null;
}

const inputClass =
  "chamfer-sm w-full border border-steel-600/25 bg-ink-950 px-3.5 text-sm text-paper-50 " +
  "placeholder:text-steel-500 focus:border-gold-500/70 focus:outline-none";

export function MediaLibrary({
  items,
  readOnly,
}: {
  items: MediaItem[];
  readOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.tags))).sort(),
    [items],
  );
  const [tag, setTag] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (tag && !item.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        item.slug.includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.alt.toLowerCase().includes(q)
      );
    });
  }, [items, query, tag]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full lg:max-w-sm">
          <span className="sr-only">Search images</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, alt text or slug"
            className={cn(inputClass, "h-11 pl-10")}
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={cn(
              "chamfer-sm border px-3 py-1.5 text-xs font-medium transition-colors",
              tag === null
                ? "border-gold-500 bg-gold-500/15 text-gold-400"
                : "border-steel-600/25 text-steel-400 hover:text-steel-200",
            )}
          >
            All ({items.length})
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t === tag ? null : t)}
              className={cn(
                "chamfer-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                tag === t
                  ? "border-gold-500 bg-gold-500/15 text-gold-400"
                  : "border-steel-600/25 text-steel-400 hover:text-steel-200",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((item) => {
          const asset = getMedia(item.slug);
          const needsAlt = !item.alt.trim();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group chamfer relative overflow-hidden border border-steel-600/18 bg-ink-900 text-left transition-colors hover:border-gold-500/45"
            >
              <span className="relative block aspect-4/3">
                {asset.src && (
                  <Image src={asset.src} alt="" fill sizes="240px" className="object-cover" />
                )}
                {needsAlt && (
                  <span className="chamfer-sm absolute left-2 top-2 bg-signal-red/90 px-2 py-0.5 text-[0.625rem] font-bold text-paper-50 uppercase">
                    No alt text
                  </span>
                )}
              </span>
              <span className="block p-3">
                <span className="block truncate text-xs font-medium text-steel-200">
                  {item.title || item.slug}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-steel-500">
                  {item.width}×{item.height}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {!visible.length && (
        <p className="py-16 text-center text-sm text-steel-500">
          Nothing matches that search.
        </p>
      )}

      {selected && (
        <MediaDetail
          item={selected}
          readOnly={readOnly}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function MediaDetail({
  item,
  readOnly,
  onClose,
}: {
  item: MediaItem;
  readOnly?: boolean;
  onClose: () => void;
}) {
  const asset = getMedia(item.slug);
  const [title, setTitle] = useState(item.title);
  const [alt, setAlt] = useState(item.alt);
  const [caption, setCaption] = useState(item.caption ?? "");
  const [tags, setTags] = useState(item.tags.join(", "));
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const result = await saveMediaAsset({
        id: item.id,
        title,
        alt,
        caption,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setFeedback({ ok: result.ok, message: result.message });
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${item.slug}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
    >
      <div className="chamfer max-h-[90svh] w-full max-w-3xl overflow-y-auto border border-steel-600/20 bg-ink-900">
        <div className="flex items-center justify-between gap-4 border-b border-steel-600/15 px-6 py-4">
          <h2 className="font-mono text-sm text-steel-300">{item.slug}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="text-steel-400 transition-colors hover:text-paper-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="chamfer-sm relative aspect-4/3 overflow-hidden border border-steel-600/20">
            {asset.src && <Image src={asset.src} alt={alt} fill sizes="400px" className="object-cover" />}
          </div>

          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-steel-200">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={readOnly}
                className={cn(inputClass, "h-11")}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-steel-200">
                Alt text <span className="text-gold-500">*</span>
              </span>
              <span className="text-xs leading-relaxed text-steel-500">
                Describe what is in the photograph for someone who cannot see it. Say what the
                machine is doing, not that it is a photograph.
              </span>
              <textarea
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                disabled={readOnly}
                rows={3}
                className={cn(inputClass, "resize-y py-2.5 leading-relaxed")}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-steel-200">Caption</span>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={readOnly}
                rows={2}
                className={cn(inputClass, "resize-y py-2.5 leading-relaxed")}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-steel-200">Tags</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={readOnly}
                placeholder="workshop, engines, mechanical"
                className={cn(inputClass, "h-11")}
              />
            </label>

            {feedback && (
              <p
                className={cn(
                  "chamfer-sm flex items-start gap-2 border p-3 text-xs",
                  feedback.ok
                    ? "border-signal-green/40 bg-signal-green/8 text-steel-200"
                    : "border-signal-red/45 bg-signal-red/8 text-steel-200",
                )}
              >
                {feedback.ok ? (
                  <Check className="mt-0.5 size-3.5 shrink-0 text-signal-green" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-signal-red" />
                )}
                {feedback.message}
              </p>
            )}

            <PortalButton onClick={save} disabled={pending || readOnly} className="self-start">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Save details
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
