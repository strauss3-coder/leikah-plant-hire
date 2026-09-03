import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* ============================================================================
   CLASS MERGING

   `text-display-1` through `text-display-4` come from the `--text-*` theme
   namespace in globals.css. tailwind-merge has no way to know that, so it
   classifies them alongside `text-{colour}` and silently drops the size
   whenever a colour is applied to the same element — which is most headings.

   Registering them as font sizes is what keeps `cn("text-display-2",
   "text-paper-50")` producing both classes rather than only the colour.
   ========================================================================= */

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-1", "display-2", "display-3", "display-4"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "+27 60 976 3429" -> "+27609763429", for tel: and wa.me links. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string, message?: string) {
  const number = phone.replace(/[^\d]/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${q}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    // Strip the combining marks that NFKD just split off.
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DATE_FMT = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});

export function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return DATE_FMT.format(d);
}

const MONTH_FMT = new Intl.DateTimeFormat("en-ZA", {
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});

export function formatMonth(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return MONTH_FMT.format(d);
}

/**
 * Africa/Johannesburg is UTC+2 with no DST, so the local weekday and minute can
 * be derived arithmetically without pulling in a timezone library.
 */
export function johannesburgNow(now = new Date()) {
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const sast = new Date(utc + 2 * 60 * 60_000);
  return {
    day: sast.getDay(), // 0 = Sunday
    minutes: sast.getHours() * 60 + sast.getMinutes(),
    date: sast,
  };
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
