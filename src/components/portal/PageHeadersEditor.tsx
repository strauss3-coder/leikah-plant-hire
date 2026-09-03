"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, ChevronDown, Loader2, Save } from "lucide-react";
import { FieldRenderer } from "./Fields";
import { Panel, PortalButton } from "./Primitives";
import { saveSingleton } from "@/lib/portal/actions";
import type { FieldDef } from "@/lib/portal/schema";
import { cn } from "@/lib/utils";

/* ============================================================================
   PAGE HEADERS

   The `pages` singleton is a map of route key -> header block. Rendering it as
   an accordion of identical field sets keeps fifteen page headers manageable in
   one screen rather than fifteen separate routes.
   ========================================================================= */

const FIELDS: FieldDef[] = [
  { key: "title", label: "Page title", type: "text", required: true },
  { key: "eyebrow", label: "Eyebrow", type: "text", required: true },
  { key: "headline", label: "Headline", type: "textarea", required: true, wide: true },
  { key: "lead", label: "Lead paragraph", type: "textarea", required: true, wide: true },
  { key: "image", label: "Header image", type: "media" },
];

const ROUTE_LABELS: Record<string, string> = {
  services: "/services",
  industries: "/industries",
  projects: "/projects",
  maintenance: "/maintenance",
  supply: "/supply",
  emergency: "/emergency",
  "health-safety": "/health-safety",
  gallery: "/gallery",
  careers: "/careers",
  news: "/news",
  testimonials: "/testimonials",
  faq: "/faq",
  contact: "/contact",
  quote: "/quote",
};

export function PageHeadersEditor({
  data: initial,
  readOnly,
}: {
  data: Record<string, Record<string, unknown>>;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [open, setOpen] = useState<string | null>(Object.keys(initial)[0] ?? null);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (pageKey: string, field: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
    setDirty(true);
    setFeedback(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await saveSingleton({ key: "pages", data });
      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok) {
        setDirty(false);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-steel-600/15 bg-ink-950/94 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <span className="text-xs text-steel-500">
          {Object.keys(data).length} page headers
        </span>
        {dirty && <span className="text-xs text-gold-400">Unsaved changes</span>}
        <PortalButton
          className="ml-auto"
          size="sm"
          onClick={save}
          disabled={pending || !dirty || readOnly}
        >
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save and publish
        </PortalButton>
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

      <Panel className="overflow-hidden">
        <ul className="-m-6 divide-y divide-steel-600/12">
          {Object.entries(data).map(([pageKey, block]) => {
            const isOpen = open === pageKey;
            return (
              <li key={pageKey}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : pageKey)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-ink-850"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-steel-500 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-paper-50">
                      {String(block.title ?? pageKey)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-steel-500">
                      {String(block.headline ?? "")}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-xs text-steel-500 sm:block">
                    {ROUTE_LABELS[pageKey] ?? `/${pageKey}`}
                  </span>
                </button>

                {isOpen && (
                  <div className="grid gap-6 border-t border-steel-600/12 bg-ink-950/40 px-6 py-6 lg:grid-cols-2">
                    {FIELDS.map((field) => (
                      <FieldRenderer
                        key={field.key}
                        field={field}
                        value={block[field.key]}
                        onChange={(next) => update(pageKey, field.key, next)}
                        options={{}}
                        className={field.wide ? "lg:col-span-2" : undefined}
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
