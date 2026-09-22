/**
 * STATIC BUILD: HAND THE ENQUIRY TO THE VISITOR'S EMAIL APP
 *
 * GitHub Pages serves files, not a server, so Server Actions cannot run there.
 * When `STATIC_EXPORT=1` the Turbopack alias in `next.config.ts` swaps
 * `@/lib/enquiries/actions` for this module.
 *
 * This used to return "this is a static preview, so the form cannot send",
 * which was honest but turned every enquiry away. Each function now composes
 * the completed form into a `mailto:` link and opens it, the same handoff the
 * quote page already used for WhatsApp. The visitor's own mail app opens
 * addressed to the right mailbox, with a real subject and everything they
 * typed laid out in the body. They press send and it arrives in Microsoft 365.
 *
 * What this buys
 * --------------
 * No server, no third-party form service, and no copy of the enquiry on
 * anyone else's infrastructure: it goes from the visitor's browser to the
 * visitor's own mail app and nowhere else. The mail also arrives *from* the
 * customer, so replying works without a Reply-To header.
 *
 * What it costs, and how each cost is handled
 * -------------------------------------------
 * • The visitor needs a mail app. Near universal on a phone; a desktop user on
 *   webmail with no registered handler may see nothing happen. The message
 *   returned below therefore always names the address and says what to do, so
 *   a failure to open degrades into "here is where to write" rather than
 *   silence.
 * • They press send themselves. One extra step, and some will drop out. Still
 *   better than a form that refuses outright.
 * • `mailto:` URLs have practical length limits, around 2000 characters in the
 *   worst clients. A long body is trimmed with a visible marker rather than
 *   cut off mid-sentence.
 * • A `mailto:` cannot carry an attachment. The quote and application paths
 *   say so in the body instead of losing the file quietly.
 *
 * The server build is untouched and never loads this file.
 */

import { business, departments } from "@/content/seed/business";
import { services } from "@/content/seed/services";
import { industries } from "@/content/seed/industries";

export interface ActionResult {
  ok: boolean;
  reference?: string;
  message: string;
  errors?: Record<string, string>;
  degraded?: boolean;
  /** Overrides the panel heading. The server build sends nothing and keeps
   *  the default; the static build says the mail app has opened, because
   *  nothing has been sent or received at that point. */
  heading?: string;
}

/** Conservative ceiling for the body, in characters, before the URL encoding. */
const MAX_BODY = 1500;

type Row = [label: string, value: unknown];

/** "Label: value" lines, dropping anything the visitor left empty. */
function block(rows: Row[]): string {
  return rows
    .filter(
      ([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0),
    )
    .map(([label, v]) => `${label}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
    .join("\n");
}

function openMail(to: string, subject: string, body: string) {
  const trimmed =
    body.length > MAX_BODY
      ? `${body.slice(0, MAX_BODY)}\n\n[shortened — please add anything missing below]`
      : body;

  // This module is imported by client components, but the export still
  // prerenders them once on the server, where there is no window.
  if (typeof window === "undefined") return;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(trimmed)}`;
}

/** Slugs are how the form tracks a selection; a name is what the person
 *  reading the quotation request needs to see. */
function serviceNames(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return [];
  return slugs.map((slug) => services.find((s) => s.slug === slug)?.title ?? String(slug));
}

function industryName(slug: unknown): string {
  if (!slug) return "";
  return industries.find((i) => i.slug === slug)?.name ?? String(slug);
}

/** The visitor's own details, as a signature block. */
function contactRows(p: Record<string, unknown>): Row[] {
  return [
    ["Name", p.contactName ?? p.name],
    ["Company", p.company],
    ["Role", p.role],
    ["Email", p.email],
    ["Phone", p.phone],
  ];
}

const HEADING = "Your email is ready to send";

const handoff = (to: string) =>
  `Your email app should have opened with the message ready to go — press send and it reaches us. If nothing opened, write to ${to} instead and it lands in the same place.`;

/* --- Quote ---------------------------------------------------------------- */

export async function submitQuoteRequest(payload: unknown): Promise<ActionResult> {
  const p = (payload ?? {}) as Record<string, unknown>;
  const to = business.quotesEmail || business.email;

  const body = [
    block([
      ["Services", serviceNames(p.serviceSlugs)],
      ["Industry", industryName(p.industrySlug)],
      ["Urgency", p.urgency],
      ["Site location", p.siteLocation],
      ["Province", p.province],
      ["Preferred start", p.preferredStart],
      ["Duration", p.duration],
      ["Budget band", p.budgetBand],
    ]),
    "",
    "WHAT IS NEEDED",
    String(p.description ?? ""),
    "",
    "CONTACT",
    block(contactRows(p)),
    ...(Array.isArray(p.attachments) && p.attachments.length
      ? ["", "Please attach the files you selected on the website to this email."]
      : []),
  ].join("\n");

  openMail(to, "Quotation request", body);
  return { ok: true, heading: HEADING, message: handoff(to) };
}

/* --- Contact -------------------------------------------------------------- */

export async function submitContactMessage(payload: unknown): Promise<ActionResult> {
  const p = (payload ?? {}) as Record<string, unknown>;

  // The visitor picked a desk. Route to that desk's mailbox rather than a
  // single catch-all, which is the reason the question is asked at all.
  const desk = departments.find((d) => d.name === p.department);
  const to = desk?.email || business.email;

  const body = [
    String(p.message ?? ""),
    "",
    "—",
    block([["Department", p.department], ...contactRows(p)]),
  ].join("\n");

  openMail(to, String(p.subject || "Website enquiry"), body);
  return { ok: true, heading: HEADING, message: handoff(to) };
}

/* --- Job application ------------------------------------------------------ */

export async function submitApplication(payload: unknown): Promise<ActionResult> {
  const p = (payload ?? {}) as Record<string, unknown>;
  const to = business.email;

  const body = [
    "EXPERIENCE",
    String(p.experience ?? ""),
    "",
    "COMPETENCIES AND TICKETS",
    String(p.competencies ?? ""),
    "",
    "CONTACT",
    block(contactRows(p)),
    "",
    "Please attach your CV to this email before sending.",
  ].join("\n");

  openMail(to, `Job application — ${String(p.role || "Leikah Plant Hire")}`, body);
  return { ok: true, heading: HEADING, message: handoff(to) };
}
