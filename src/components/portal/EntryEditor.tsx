"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import { FieldRenderer, type Option } from "./Fields";
import { Panel, PortalButton, PortalLink, StatusChip } from "./Primitives";
import { saveCollectionItem, softDeleteItem, setItemStatus } from "@/lib/portal/actions";
import { COLLECTIONS, getPath, setPath, groupFields, type CollectionKey } from "@/lib/portal/schema";
import { cn } from "@/lib/utils";

/* ============================================================================
   ENTRY EDITOR

   Generated from the collection's field schema. Panels follow the declared
   groups; a leading tab rail keeps a long form (a service has thirty fields)
   navigable without endless scrolling.

   Saving is explicit. There is no autosave, because half-finished copy going
   live because someone tabbed away is worse than losing a paragraph.
   ========================================================================= */

export interface EditorRow {
  id?: string;
  slug: string | null;
  sort: number;
  status: "draft" | "published" | "archived";
  data: Record<string, unknown>;
  updatedAt?: string;
}

export function EntryEditor({
  collection,
  row,
  options,
  canPublish,
  readOnly,
}: {
  collection: CollectionKey;
  row: EditorRow;
  options: Record<string, Option[]>;
  canPublish: boolean;
  /** No database connected — the fields still render, but nothing can be saved. */
  readOnly?: boolean;
}) {
  const def = COLLECTIONS[collection];
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(row.data ?? {});
  const [sort, setSort] = useState(row.sort);
  const [status, setStatus] = useState(row.status);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => groupFields(def.fields), [def.fields]);
  const [activeGroup, setActiveGroup] = useState(groups[0]?.title ?? "");

  const update = (key: string, value: unknown) => {
    setData((prev) => setPath(prev, key, value));
    setDirty(true);
    setFeedback(null);
  };

  const slugValue = def.slugField ? (getPath(data, def.slugField) as string | undefined) : undefined;

  const missingRequired = def.fields
    .filter((f) => f.required)
    .filter((f) => {
      const v = getPath(data, f.key);
      if (Array.isArray(v)) return v.length === 0;
      return v === undefined || v === null || v === "";
    });

  const save = (nextStatus?: typeof status) => {
    const target = nextStatus ?? status;

    if (target === "published" && missingRequired.length > 0) {
      setFeedback({
        ok: false,
        message: `Cannot publish yet — ${missingRequired.map((f) => f.label).join(", ")} still needed.`,
      });
      return;
    }

    startTransition(async () => {
      const result = await saveCollectionItem({
        collection,
        id: row.id,
        data,
        slug: slugValue ?? null,
        sort,
        status: target,
      });

      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok) {
        setDirty(false);
        setStatus(target);
        if (!row.id && result.id) {
          router.replace(`/portal/content/${collection}/${result.id}`);
        }
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!row.id) return;
    if (!confirm(`Remove this ${def.singular.toLowerCase()}? It can be restored from the archive.`)) {
      return;
    }
    startTransition(async () => {
      const result = await softDeleteItem({ collection, id: row.id! });
      if (result.ok) router.push(`/portal/content/${collection}`);
      else setFeedback({ ok: false, message: result.message });
    });
  };

  const togglePublish = () => {
    if (!row.id) {
      save(status === "published" ? "draft" : "published");
      return;
    }
    const target = status === "published" ? "draft" : "published";
    if (target === "published" && missingRequired.length > 0) {
      setFeedback({
        ok: false,
        message: `Cannot publish yet — ${missingRequired.map((f) => f.label).join(", ")} still needed.`,
      });
      return;
    }
    startTransition(async () => {
      const result = await setItemStatus({ collection, id: row.id!, status: target });
      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok) {
        setStatus(target);
        router.refresh();
      }
    });
  };

  const publicHref =
    slugValue && ["services", "industries", "projects", "news"].includes(collection)
      ? `/${collection}/${slugValue}`
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* --- Action bar ------------------------------------------------------ */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-steel-600/15 bg-ink-950/94 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <StatusChip status={status} />
        {row.id && <span className="font-mono text-xs text-steel-500">{row.id.slice(0, 8)}</span>}
        {dirty && <span className="text-xs text-gold-400">Unsaved changes</span>}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {publicHref && status === "published" && (
            <PortalLink href={publicHref} target="_blank" variant="ghost" size="sm">
              <ExternalLink className="size-3.5" />
              View live
            </PortalLink>
          )}

          {row.id && (
            <PortalButton variant="danger" size="sm" onClick={remove} disabled={pending || readOnly}>
              <Trash2 className="size-3.5" />
              Remove
            </PortalButton>
          )}

          {canPublish && (
            <PortalButton variant="secondary" size="sm" onClick={togglePublish} disabled={pending || readOnly}>
              {status === "published" ? "Take offline" : "Publish"}
            </PortalButton>
          )}

          <PortalButton
            size="sm"
            onClick={() => save()}
            disabled={pending || readOnly || (!dirty && Boolean(row.id))}
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save
          </PortalButton>
        </div>
      </div>

      {feedback && (
        <p
          className={cn(
            "chamfer-sm flex items-start gap-2.5 border p-4 text-sm",
            feedback.ok
              ? "border-signal-green/40 bg-signal-green/8 text-steel-200"
              : "border-signal-red/45 bg-signal-red/8 text-steel-200",
          )}
        >
          {feedback.ok ? (
            <Check className="mt-0.5 size-4 shrink-0 text-signal-green" />
          ) : (
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal-red" />
          )}
          {feedback.message}
        </p>
      )}

      {/* --- Group rail -------------------------------------------------------- */}
      {groups.length > 1 && (
        <nav aria-label="Editor sections" className="flex flex-wrap gap-1.5">
          {groups.map((group) => (
            <button
              key={group.title}
              type="button"
              onClick={() => {
                setActiveGroup(group.title);
                document
                  .getElementById(`group-${group.title.replace(/\W+/g, "-")}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "chamfer-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                activeGroup === group.title
                  ? "border-gold-500/60 text-gold-400"
                  : "border-steel-600/22 text-steel-400 hover:text-steel-200",
              )}
            >
              {group.title}
            </button>
          ))}
        </nav>
      )}

      {/* --- Panels -------------------------------------------------------------- */}
      {groups.map((group) => (
        <div key={group.title} id={`group-${group.title.replace(/\W+/g, "-")}`} className="scroll-mt-24">
          <Panel title={group.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              {group.fields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={getPath(data, field.key)}
                  onChange={(next) => update(field.key, next)}
                  options={options}
                  className={field.wide ? "lg:col-span-2" : undefined}
                />
              ))}
            </div>
          </Panel>
        </div>
      ))}

      {/* --- Ordering ------------------------------------------------------------- */}
      <Panel title="Placement" description="Lower numbers appear first wherever this is listed.">
        <label className="flex max-w-xs flex-col gap-2">
          <span className="text-sm font-medium text-steel-200">Sort order</span>
          <input
            type="number"
            value={sort}
            onChange={(e) => {
              setSort(Number(e.target.value));
              setDirty(true);
            }}
            className="chamfer-sm h-11 w-full border border-steel-600/25 bg-ink-950 px-3.5 text-sm text-paper-50 focus:border-gold-500/70 focus:outline-none"
          />
        </label>
      </Panel>
    </div>
  );
}
