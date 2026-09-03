"use server";

import { headers } from "next/headers";
import { getServiceSupabase } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/config";
import {
  applicationSchema,
  contactMessageSchema,
  makeReference,
  quoteRequestSchema,
} from "./schema";

/* ============================================================================
   ENQUIRY SERVER ACTIONS

   Every submission is validated server-side, rate-limited per IP, and written
   to Supabase. When Supabase is not configured the submission is still accepted
   and logged with its reference, so the forms are never dead during the window
   between launching the site and connecting the database — but the response
   says plainly that it was not stored rather than pretending otherwise.
   ========================================================================= */

export interface ActionResult {
  ok: boolean;
  reference?: string;
  message: string;
  /** Field-level errors, keyed by the form field name. */
  errors?: Record<string, string>;
  /** True when the enquiry was accepted but not persisted. */
  degraded?: boolean;
}

/* --- Rate limiting ---------------------------------------------------------
   In-memory and therefore per-instance. It stops casual form hammering; a
   serious abuse problem needs a shared store, which the README notes.
   -------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

async function rateLimit(): Promise<boolean> {
  const store = await headers();
  const ip =
    store.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    store.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length <= MAX_PER_WINDOW;
}

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

const RATE_LIMITED: ActionResult = {
  ok: false,
  message:
    "That is several submissions in a short space of time. Give it a few minutes, or call the number at the top of the page.",
};

/* --- Quote requests --------------------------------------------------------- */

export async function submitQuoteRequest(payload: unknown): Promise<ActionResult> {
  if (!(await rateLimit())) return RATE_LIMITED;

  const parsed = quoteRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "A few fields still need attention.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const reference = makeReference("QT");
  const supabase = getServiceSupabase();

  if (!supabase || !hasServiceRole) {
    console.warn(
      `[enquiry] Supabase not configured — quote ${reference} accepted but not stored.`,
      { company: data.company, email: data.email, urgency: data.urgency },
    );
    return {
      ok: true,
      reference,
      degraded: true,
      message:
        "Your request has been received. Our enquiry database is still being connected, so please also call or WhatsApp us so that nothing is missed.",
    };
  }

  const { error } = await supabase.from("quote_requests").insert({
    reference,
    company: data.company,
    contact_name: data.contactName,
    role: data.role ?? null,
    email: data.email,
    phone: data.phone,
    service_slugs: data.serviceSlugs,
    industry_slug: data.industrySlug,
    site_location: data.siteLocation,
    province: data.province,
    urgency: data.urgency,
    preferred_start: data.preferredStart || null,
    duration: data.duration ?? null,
    budget_band: data.budgetBand ?? null,
    description: data.description,
    attachments: data.attachments,
    consent: data.consent,
    source: data.source ?? "website",
    status: "new",
  });

  if (error) {
    console.error("[enquiry] quote insert failed", error);
    return {
      ok: false,
      message:
        "We could not record that request. Please call or WhatsApp us — the number is at the top of the page.",
    };
  }

  return {
    ok: true,
    reference,
    message:
      data.urgency === "emergency"
        ? "Received and flagged as an emergency. If the machine is down right now, call the 24-hour line — that is faster than any form."
        : "Received. You will get a response from a person, not an autoresponder.",
  };
}

/* --- Contact messages -------------------------------------------------------- */

export async function submitContactMessage(payload: unknown): Promise<ActionResult> {
  if (!(await rateLimit())) return RATE_LIMITED;

  const parsed = contactMessageSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "A few fields still need attention.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const reference = makeReference("CT");
  const supabase = getServiceSupabase();

  if (!supabase || !hasServiceRole) {
    console.warn(
      `[enquiry] Supabase not configured — message ${reference} accepted but not stored.`,
      { name: data.name, email: data.email, department: data.department },
    );
    return {
      ok: true,
      reference,
      degraded: true,
      message:
        "Your message has been received. Our enquiry database is still being connected, so please also call or WhatsApp us so that nothing is missed.",
    };
  }

  const { error } = await supabase.from("contact_messages").insert({
    reference,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    company: data.company ?? null,
    department: data.department,
    subject: data.subject,
    message: data.message,
    consent: data.consent,
    status: "new",
  });

  if (error) {
    console.error("[enquiry] contact insert failed", error);
    return {
      ok: false,
      message:
        "We could not send that message. Please call or WhatsApp us — the number is at the top of the page.",
    };
  }

  return { ok: true, reference, message: "Message received. We will come back to you." };
}

/* --- Job applications --------------------------------------------------------- */

export async function submitApplication(payload: unknown): Promise<ActionResult> {
  if (!(await rateLimit())) return RATE_LIMITED;

  const parsed = applicationSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "A few fields still need attention.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const reference = makeReference("CV");
  const supabase = getServiceSupabase();

  if (!supabase || !hasServiceRole) {
    console.warn(
      `[enquiry] Supabase not configured — application ${reference} accepted but not stored.`,
      { name: data.name, role: data.role },
    );
    return {
      ok: true,
      reference,
      degraded: true,
      message:
        "Your application has been received. Our database is still being connected, so please also email it to us directly.",
    };
  }

  const { error } = await supabase.from("job_applications").insert({
    reference,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    experience: data.experience,
    competencies: data.competencies ?? null,
    cv: data.cv ?? null,
    consent: data.consent,
    status: "new",
  });

  if (error) {
    console.error("[enquiry] application insert failed", error);
    return {
      ok: false,
      message: "We could not record that application. Please email it to us instead.",
    };
  }

  return {
    ok: true,
    reference,
    message:
      "Application received. We keep every application on file, not only the ones we reply to immediately.",
  };
}
