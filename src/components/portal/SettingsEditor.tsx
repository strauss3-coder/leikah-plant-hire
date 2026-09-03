"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Panel, PortalButton } from "./Primitives";
import { saveSetting } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

/* ============================================================================
   SETTINGS EDITOR

   A small, deliberately limited editor for the site_settings rows. Settings are
   switches and lists, not free-form content — anything richer belongs in a
   proper content type where it can be validated.
   ========================================================================= */

export interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "boolean" | "list";
  help?: string;
}

const inputClass =
  "chamfer-sm w-full border border-steel-600/25 bg-ink-950 px-3.5 text-sm text-paper-50 " +
  "placeholder:text-steel-500 focus:border-gold-500/70 focus:outline-none";

export function SettingsEditor({
  settingKey,
  title,
  description,
  fields,
  value: initial,
  readOnly,
}: {
  settingKey: string;
  title: string;
  description?: string;
  fields: SettingField[];
  value: Record<string, unknown>;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (key: string, next: unknown) => {
    setValue((prev) => ({ ...prev, [key]: next }));
    setDirty(true);
    setFeedback(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await saveSetting({ key: settingKey, value });
      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok) {
        setDirty(false);
        router.refresh();
      }
    });
  };

  return (
    <Panel
      title={title}
      description={description}
      actions={
        <PortalButton size="sm" onClick={save} disabled={pending || !dirty || readOnly}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save
        </PortalButton>
      }
    >
      <div className="flex flex-col gap-6">
        {fields.map((field) => {
          const current = value[field.key];

          if (field.type === "boolean") {
            return (
              <label key={field.key} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(current)}
                  disabled={readOnly}
                  onChange={(e) => update(field.key, e.target.checked)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "chamfer-sm mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
                    current ? "border-gold-500 bg-gold-500 text-ink-950" : "border-steel-600/50",
                  )}
                >
                  {Boolean(current) && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span>
                  <span className="block text-sm font-medium text-steel-200">{field.label}</span>
                  {field.help && (
                    <span className="mt-0.5 block text-xs text-steel-500">{field.help}</span>
                  )}
                </span>
              </label>
            );
          }

          if (field.type === "list") {
            const list = Array.isArray(current) ? (current as string[]) : [];
            return (
              <div key={field.key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-steel-200">{field.label}</span>
                {list.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={item}
                      disabled={readOnly}
                      onChange={(e) =>
                        update(
                          field.key,
                          list.map((v, j) => (j === i ? e.target.value : v)),
                        )
                      }
                      className={cn(inputClass, "h-11")}
                      aria-label={`${field.label} ${i + 1}`}
                    />
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => update(field.key, list.filter((_, j) => j !== i))}
                      aria-label="Remove"
                      className="text-steel-500 transition-colors hover:text-signal-red"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => update(field.key, [...list, ""])}
                  className="chamfer-sm inline-flex w-fit items-center gap-2 border border-steel-600/25 px-3 py-2 text-xs font-medium text-steel-200 transition-colors hover:border-gold-500/50"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
            );
          }

          return (
            <label key={field.key} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-steel-200">{field.label}</span>
              {field.help && <span className="text-xs text-steel-500">{field.help}</span>}
              {field.type === "textarea" ? (
                <textarea
                  value={(current as string) ?? ""}
                  disabled={readOnly}
                  rows={3}
                  onChange={(e) => update(field.key, e.target.value)}
                  className={cn(inputClass, "resize-y py-2.5 leading-relaxed")}
                />
              ) : (
                <input
                  value={(current as string) ?? ""}
                  disabled={readOnly}
                  onChange={(e) => update(field.key, e.target.value)}
                  className={cn(inputClass, "h-11")}
                />
              )}
            </label>
          );
        })}

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
      </div>
    </Panel>
  );
}
