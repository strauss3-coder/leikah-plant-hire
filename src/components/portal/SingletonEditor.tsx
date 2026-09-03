"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, Save } from "lucide-react";
import { FieldRenderer, type Option } from "./Fields";
import { Panel, PortalButton } from "./Primitives";
import { saveSingleton } from "@/lib/portal/actions";
import { SINGLETONS, getPath, setPath, groupFields } from "@/lib/portal/schema";
import { cn } from "@/lib/utils";

/* ============================================================================
   SINGLETON EDITOR

   Business information, the homepage, the about page and the safety page. Same
   field engine as the collection editor; the difference is that there is one
   record and it is always live, so saving publishes immediately.
   ========================================================================= */

export function SingletonEditor({
  singletonKey,
  data: initial,
  options,
  readOnly,
}: {
  singletonKey: string;
  data: Record<string, unknown>;
  options: Record<string, Option[]>;
  readOnly?: boolean;
}) {
  const def = SINGLETONS[singletonKey];
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => groupFields(def.fields), [def.fields]);
  const [active, setActive] = useState(groups[0]?.title ?? "");

  const update = (key: string, value: unknown) => {
    setData((prev) => setPath(prev, key, value));
    setDirty(true);
    setFeedback(null);
  };

  const missing = def.fields
    .filter((f) => f.required)
    .filter((f) => {
      const v = getPath(data, f.key);
      if (Array.isArray(v)) return v.length === 0;
      return v === undefined || v === null || v === "";
    });

  const save = () => {
    if (missing.length) {
      setFeedback({
        ok: false,
        message: `Still needed: ${missing.map((f) => f.label).join(", ")}.`,
      });
      return;
    }

    startTransition(async () => {
      const result = await saveSingleton({ key: singletonKey, data });
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
          Changes here go live on the site as soon as you save.
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

      {groups.length > 1 && (
        <nav aria-label="Editor sections" className="flex flex-wrap gap-1.5">
          {groups.map((group) => (
            <button
              key={group.title}
              type="button"
              onClick={() => {
                setActive(group.title);
                document
                  .getElementById(`group-${group.title.replace(/\W+/g, "-")}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "chamfer-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                active === group.title
                  ? "border-gold-500/60 text-gold-400"
                  : "border-steel-600/22 text-steel-400 hover:text-steel-200",
              )}
            >
              {group.title}
            </button>
          ))}
        </nav>
      )}

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
    </div>
  );
}
