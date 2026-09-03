"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, GripVertical, Plus, Search, Trash2, X } from "lucide-react";
import { getMedia, allMedia } from "@/lib/cms/media";
import type { FieldDef } from "@/lib/portal/schema";
import { cn, slugify } from "@/lib/utils";

/* ============================================================================
   PORTAL FIELD CONTROLS

   One component per field type in the schema registry. `FieldRenderer` picks
   between them, which is what makes a new content field a one-line change.

   The media picker reads the generated manifest rather than an arbitrary URL
   box, so an editor cannot accidentally reference an image that does not exist.
   ========================================================================= */

export interface Option {
  value: string;
  label: string;
}

const inputBase =
  "chamfer-sm w-full border border-steel-600/25 bg-ink-950 px-3.5 text-sm text-paper-50 " +
  "transition-colors placeholder:text-steel-500 focus:border-gold-500/70 focus:outline-none";

function Label({
  htmlFor,
  field,
}: {
  htmlFor: string;
  field: FieldDef;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-steel-200">
      {field.label}
      {field.required && (
        <span className="text-gold-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function Help({ field }: { field: FieldDef }) {
  if (!field.help) return null;
  return <p className="text-xs leading-relaxed text-steel-500">{field.help}</p>;
}

/* --- Media picker ------------------------------------------------------------ */

function MediaPicker({
  value,
  onChange,
  allowClear = true,
}: {
  value: string | undefined;
  onChange: (next: string | undefined) => void;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const asset = value ? getMedia(value) : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allMedia;
    return allMedia.filter(
      (m) =>
        m.slug.includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {asset?.src ? (
          <span className="chamfer-sm relative size-16 shrink-0 overflow-hidden border border-steel-600/25">
            <Image src={asset.src} alt="" fill sizes="64px" className="object-cover" />
          </span>
        ) : (
          <span className="chamfer-sm flex size-16 shrink-0 items-center justify-center border border-dashed border-steel-600/30 text-[0.625rem] text-steel-500">
            none
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-steel-200">{asset?.title ?? "No image selected"}</p>
          {asset?.slug && <p className="truncate font-mono text-xs text-steel-500">{asset.slug}</p>}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="chamfer-sm shrink-0 border border-steel-600/25 px-3 py-2 text-xs font-medium text-steel-200 transition-colors hover:border-gold-500/50"
        >
          {asset ? "Change" : "Choose"}
        </button>

        {asset && allowClear && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="Clear image"
            className="shrink-0 text-steel-500 transition-colors hover:text-signal-red"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="chamfer-sm border border-steel-600/25 bg-ink-950 p-3">
          <label className="relative mb-3 block">
            <span className="sr-only">Search images</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-steel-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or tag"
              className={cn(inputBase, "h-9 pl-9 text-xs")}
            />
          </label>

          <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {results.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => {
                  onChange(m.slug);
                  setOpen(false);
                  setQuery("");
                }}
                title={m.title}
                className={cn(
                  "chamfer-sm relative aspect-4/3 overflow-hidden border transition-colors",
                  value === m.slug
                    ? "border-gold-500"
                    : "border-steel-600/20 hover:border-gold-500/50",
                )}
              >
                <Image src={m.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
            {!results.length && (
              <p className="col-span-full py-6 text-center text-xs text-steel-500">
                Nothing matches that. Upload new images from the media library.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaListPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((slug, i) => {
            const asset = getMedia(slug);
            return (
              <li
                key={`${slug}-${i}`}
                className="chamfer-sm flex items-center gap-3 border border-steel-600/20 bg-ink-950 p-2"
              >
                <span className="flex flex-col text-steel-500">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    aria-label="Move up"
                    disabled={i === 0}
                    className="transition-colors hover:text-gold-400 disabled:opacity-30"
                  >
                    <ChevronDown className="size-3 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    aria-label="Move down"
                    disabled={i === value.length - 1}
                    className="transition-colors hover:text-gold-400 disabled:opacity-30"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </span>

                {asset.src && (
                  <span className="chamfer-sm relative size-11 shrink-0 overflow-hidden">
                    <Image src={asset.src} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-steel-200">{asset.title}</span>
                  <span className="block truncate font-mono text-[0.625rem] text-steel-500">
                    {slug}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  aria-label="Remove image"
                  className="shrink-0 text-steel-500 transition-colors hover:text-signal-red"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <MediaPicker
          value={undefined}
          allowClear={false}
          onChange={(slug) => {
            if (slug) onChange([...value, slug]);
            setAdding(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="chamfer-sm inline-flex w-fit items-center gap-2 border border-steel-600/25 px-3 py-2 text-xs font-medium text-steel-200 transition-colors hover:border-gold-500/50"
        >
          <Plus className="size-3.5" />
          Add image
        </button>
      )}
    </div>
  );
}

/* --- Lists ------------------------------------------------------------------- */

function StringList({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, next: string) =>
    onChange(value.map((item, j) => (j === i ? next : item)));

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <GripVertical className="mt-3 size-3.5 shrink-0 text-steel-500/60" aria-hidden="true" />
          <textarea
            value={item}
            onChange={(e) => update(i, e.target.value)}
            rows={Math.max(1, Math.ceil(item.length / 90))}
            placeholder={placeholder}
            aria-label={`Item ${i + 1}`}
            className={cn(inputBase, "resize-y py-2.5 leading-relaxed")}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`Remove item ${i + 1}`}
            className="mt-2.5 shrink-0 text-steel-500 transition-colors hover:text-signal-red"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="chamfer-sm inline-flex w-fit items-center gap-2 border border-steel-600/25 px-3 py-2 text-xs font-medium text-steel-200 transition-colors hover:border-gold-500/50"
      >
        <Plus className="size-3.5" />
        Add item
      </button>
    </div>
  );
}

function ObjectList({
  value,
  onChange,
  fields,
  options,
}: {
  value: Record<string, unknown>[];
  onChange: (next: Record<string, unknown>[]) => void;
  fields: FieldDef[];
  options: Record<string, Option[]>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const update = (index: number, key: string, next: unknown) =>
    onChange(value.map((row, i) => (i === index ? { ...row, [key]: next } : row)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(target);
  };

  const summarise = (row: Record<string, unknown>) => {
    const first = fields.find((f) => f.type === "text" || f.type === "textarea");
    const raw = first ? row[first.key] : undefined;
    const text = typeof raw === "string" && raw.trim() ? raw : "Untitled entry";
    return text.length > 70 ? `${text.slice(0, 70)}…` : text;
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((row, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="chamfer-sm border border-steel-600/20 bg-ink-950">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="font-mono text-[0.625rem] text-steel-500 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-steel-500 transition-transform",
                    open && "rotate-180",
                  )}
                />
                <span className="truncate text-sm text-steel-200">{summarise(row)}</span>
              </button>

              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="text-steel-500 transition-colors hover:text-gold-400 disabled:opacity-30"
              >
                <ChevronDown className="size-3.5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                aria-label="Move down"
                className="text-steel-500 transition-colors hover:text-gold-400 disabled:opacity-30"
              >
                <ChevronDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label="Remove entry"
                className="text-steel-500 transition-colors hover:text-signal-red"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {open && (
              <div className="grid gap-4 border-t border-steel-600/15 p-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={row[field.key]}
                    onChange={(next) => update(i, field.key, next)}
                    options={options}
                    className={field.type === "textarea" || field.type === "stringlist" ? "sm:col-span-2" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onChange([...value, {}]);
          setOpenIndex(value.length);
        }}
        className="chamfer-sm inline-flex w-fit items-center gap-2 border border-steel-600/25 px-3 py-2 text-xs font-medium text-steel-200 transition-colors hover:border-gold-500/50"
      >
        <Plus className="size-3.5" />
        Add entry
      </button>
    </div>
  );
}

function MultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: Option[];
}) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const on = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            aria-pressed={on}
            className={cn(
              "chamfer-sm border px-3 py-1.5 text-xs font-medium transition-colors",
              on
                ? "border-gold-500 bg-gold-500/15 text-gold-400"
                : "border-steel-600/25 text-steel-400 hover:border-steel-600/50 hover:text-steel-200",
            )}
          >
            {option.label}
          </button>
        );
      })}
      {!options.length && (
        <p className="text-xs text-steel-500">Nothing to link to yet — create some first.</p>
      )}
    </div>
  );
}

/* --- Renderer ---------------------------------------------------------------- */

export function FieldRenderer({
  field,
  value,
  onChange,
  options,
  className,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
  options: Record<string, Option[]>;
  className?: string;
}) {
  const id = useId();

  const resolvedOptions: Option[] = Array.isArray(field.options)
    ? field.options
    : field.options && "from" in field.options
      ? (options[field.options.from] ?? [])
      : [];

  const wrapper = (children: React.ReactNode) => (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} field={field} />
      <Help field={field} />
      {children}
    </div>
  );

  switch (field.type) {
    case "boolean":
      return (
        <div className={cn("flex flex-col gap-2", className)}>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "chamfer-sm mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
                value ? "border-gold-500 bg-gold-500" : "border-steel-600/50",
              )}
            >
              {Boolean(value) && (
                <svg viewBox="0 0 12 12" className="size-3 text-ink-950" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 6.5 4.8 9 10 3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-steel-200">{field.label}</span>
              {field.help && <span className="text-xs text-steel-500">{field.help}</span>}
            </span>
          </label>
        </div>
      );

    case "textarea":
      return wrapper(
        <textarea
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.placeholder}
          className={cn(inputBase, "resize-y py-2.5 leading-relaxed")}
        />,
      );

    case "longtext":
      return wrapper(
        <textarea
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          placeholder={field.placeholder}
          className={cn(inputBase, "resize-y py-3 font-mono text-[0.8125rem] leading-relaxed")}
        />,
      );

    case "number":
      return wrapper(
        <input
          id={id}
          type="number"
          value={value === undefined || value === null ? "" : String(value)}
          min={field.min}
          max={field.max}
          step="any"
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={cn(inputBase, "h-11")}
        />,
      );

    case "date":
      return wrapper(
        <input
          id={id}
          type="date"
          value={typeof value === "string" ? value.slice(0, 10) : ""}
          onChange={(e) => onChange(e.target.value || null)}
          className={cn(inputBase, "h-11")}
        />,
      );

    case "select":
      return wrapper(
        <div className="relative">
          <select
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={cn(inputBase, "h-11 appearance-none pr-9")}
          >
            <option value="">— none —</option>
            {resolvedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-steel-400"
          />
        </div>,
      );

    case "multiselect":
      return wrapper(
        <MultiSelect
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          options={resolvedOptions}
        />,
      );

    case "media":
      return wrapper(
        <MediaPicker value={value as string | undefined} onChange={onChange} />,
      );

    case "medialist":
      return wrapper(
        <MediaListPicker
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />,
      );

    case "stringlist":
      return wrapper(
        <StringList
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          placeholder={field.placeholder}
        />,
      );

    case "objectlist":
      return wrapper(
        <ObjectList
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
          fields={field.fields ?? []}
          options={options}
        />,
      );

    case "slug":
      return wrapper(
        <div className="flex items-center gap-2">
          <input
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(slugify(e.target.value))}
            placeholder={field.placeholder}
            className={cn(inputBase, "h-11 font-mono")}
          />
        </div>,
      );

    default:
      return wrapper(
        <input
          id={id}
          type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "url" ? "url" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={cn(inputBase, "h-11")}
        />,
      );
  }
}
