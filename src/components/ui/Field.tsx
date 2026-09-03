"use client";

import { useId } from "react";
import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   FORM CONTROLS

   Every control is a real label bound to a real input, with errors wired
   through `aria-describedby` and `aria-invalid`. Nothing here relies on
   placeholder text to communicate what a field is for — placeholders vanish the
   moment someone starts typing, which is exactly when they are needed.
   ========================================================================= */

const base =
  "chamfer-sm w-full border bg-ink-900 px-4 text-[0.9375rem] text-paper-50 transition-colors " +
  "placeholder:text-steel-500 focus:outline-none focus:border-gold-500/70 disabled:opacity-50";

function Wrapper({
  label,
  hint,
  error,
  required,
  htmlFor,
  errorId,
  hintId,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor: string;
  errorId: string;
  hintId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-steel-200">
        {label}
        {required ? (
          <span className="text-gold-500" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-xs text-steel-500">optional</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-steel-500">
          {hint}
        </p>
      )}

      {children}

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs text-signal-red">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      htmlFor={id}
      errorId={errorId}
      hintId={hintId}
      className={className}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hint && hintId, error && errorId) || undefined}
        className={cn(base, "h-12", error ? "border-signal-red/60" : "border-steel-600/25")}
        {...props}
      />
    </Wrapper>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className,
  rows = 6,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      htmlFor={id}
      errorId={errorId}
      hintId={hintId}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hint && hintId, error && errorId) || undefined}
        className={cn(
          base,
          "resize-y py-3 leading-relaxed",
          error ? "border-signal-red/60" : "border-steel-600/25",
        )}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  placeholder?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const normalised = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      htmlFor={id}
      errorId={errorId}
      hintId={hintId}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className={cn(
            base,
            "h-12 appearance-none pr-10",
            error ? "border-signal-red/60" : "border-steel-600/25",
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalised.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-400"
        />
      </div>
    </Wrapper>
  );
}

/** Multi-select rendered as toggle plates — faster than a native multiple select. */
export function CheckGroup({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  columns = 2,
}: {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string; note?: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  columns?: 1 | 2 | 3;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <fieldset
      className="flex flex-col gap-3"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="flex items-baseline gap-2 text-sm font-medium text-steel-200">
        {label}
        <span className="text-gold-500" aria-hidden="true">
          *
        </span>
      </legend>

      {hint && <p className="text-xs leading-relaxed text-steel-500">{hint}</p>}

      <div
        className={cn(
          "grid gap-2",
          columns === 1 && "grid-cols-1",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const on = value.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "chamfer-sm flex cursor-pointer items-start gap-3 border p-4 transition-all duration-300",
                on
                  ? "border-gold-500/70 bg-gold-500/8"
                  : "border-steel-600/22 hover:border-steel-600/45",
              )}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
                  on ? "border-gold-500 bg-gold-500 text-ink-950" : "border-steel-600/50",
                )}
              >
                {on && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    on ? "text-paper-50" : "text-steel-200",
                  )}
                >
                  {option.label}
                </span>
                {option.note && (
                  <span className="text-xs leading-snug text-steel-500">{option.note}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs text-signal-red">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function RadioGroup({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  name,
}: {
  label: string;
  hint?: string;
  error?: string;
  options: readonly { value: string; label: string; note?: string }[];
  value: string;
  onChange: (next: string) => void;
  name: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <fieldset className="flex flex-col gap-3" aria-invalid={error ? true : undefined}>
      <legend className="flex items-baseline gap-2 text-sm font-medium text-steel-200">
        {label}
        <span className="text-gold-500" aria-hidden="true">
          *
        </span>
      </legend>

      {hint && <p className="text-xs leading-relaxed text-steel-500">{hint}</p>}

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const on = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "chamfer-sm flex cursor-pointer items-start gap-3 border p-4 transition-all duration-300",
                on
                  ? "border-gold-500/70 bg-gold-500/8"
                  : "border-steel-600/22 hover:border-steel-600/45",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={on}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  on ? "border-gold-500" : "border-steel-600/50",
                )}
              >
                {on && <span className="size-2.5 rounded-full bg-gold-500" />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={cn("text-sm font-medium", on ? "text-paper-50" : "text-steel-200")}>
                  {option.label}
                </span>
                {option.note && (
                  <span className="text-xs leading-snug text-steel-500">{option.note}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs text-signal-red">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function Consent({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
            checked ? "border-gold-500 bg-gold-500 text-ink-950" : "border-steel-600/50",
          )}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </span>
        <span className="text-xs leading-relaxed text-steel-400">{children}</span>
      </label>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-signal-red">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
