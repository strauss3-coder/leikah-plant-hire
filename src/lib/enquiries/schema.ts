import { z } from "zod";

/* ============================================================================
   ENQUIRY VALIDATION

   One schema, used by the client form for inline feedback and again on the
   server before anything is written. Client-side validation is a convenience;
   the server copy is the one that actually protects the database.
   ========================================================================= */

const saPhone = /^(\+?27|0)[\s-]?[1-8][\d\s-]{7,12}$/;

export const urgencyValues = ["emergency", "urgent", "scheduled", "planning"] as const;

export const URGENCY_OPTIONS = [
  {
    value: "emergency",
    label: "Emergency — machine is down now",
    note: "Routed straight to the 24-hour dispatch line",
  },
  {
    value: "urgent",
    label: "Urgent — within 48 hours",
    note: "Answered the same working day",
  },
  {
    value: "scheduled",
    label: "Scheduled — a known date",
    note: "Quoted against your programme",
  },
  {
    value: "planning",
    label: "Planning or budgeting",
    note: "Budget figures and indicative rates",
  },
] as const;

export const BUDGET_BANDS = [
  "Under R50 000",
  "R50 000 – R250 000",
  "R250 000 – R1 million",
  "R1 million – R5 million",
  "Over R5 million",
  "Prefer not to say",
] as const;

export const PROVINCES = [
  "Mpumalanga",
  "Gauteng",
  "Limpopo",
  "North West",
  "Free State",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Western Cape",
  "Northern Cape",
] as const;

export const attachmentSchema = z.object({
  name: z.string().min(1).max(255),
  path: z.string().min(1),
  size: z.number().int().nonnegative(),
  type: z.string().max(120),
});

export const quoteRequestSchema = z.object({
  // Step 1 — what
  serviceSlugs: z
    .array(z.string().min(1))
    .min(1, "Choose at least one service so we route this correctly"),
  industrySlug: z.string().min(1, "Select the sector you operate in"),
  urgency: z.enum(urgencyValues),

  // Step 2 — where and when
  siteLocation: z.string().min(2, "Tell us where the site is").max(160),
  province: z.string().min(2).max(60),
  preferredStart: z.string().optional().nullable(),
  duration: z.string().max(120).optional(),
  budgetBand: z.string().max(60).optional(),

  // Step 3 — detail
  description: z
    .string()
    .min(20, "A few more words will get you a closer first number")
    .max(4000),
  attachments: z.array(attachmentSchema).max(10).default([]),

  // Step 4 — who
  company: z.string().min(2, "Company name is required").max(160),
  contactName: z.string().min(2, "We need a name for the quotation").max(120),
  role: z.string().max(120).optional(),
  email: z.email("That email address does not look right"),
  phone: z
    .string()
    .min(9, "A contact number is required")
    .regex(saPhone, "Use a South African number, e.g. 060 976 3429"),
  consent: z
    .boolean()
    .refine((v) => v, "Please confirm we may contact you about this enquiry"),

  // Set by the form, not the user.
  source: z.string().max(120).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Please give us a name").max(120),
  email: z.email("That email address does not look right"),
  phone: z
    .string()
    .max(30)
    .optional()
    .refine((v) => !v || saPhone.test(v), "Use a South African number, e.g. 060 976 3429"),
  company: z.string().max(160).optional(),
  department: z.string().min(1, "Choose who this should reach"),
  subject: z.string().min(3, "A short subject helps us route this").max(180),
  message: z.string().min(10, "Tell us a little more").max(4000),
  consent: z
    .boolean()
    .refine((v) => v, "Please confirm we may reply to this enquiry"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const applicationSchema = z.object({
  name: z.string().min(2, "Please give us your name").max(120),
  email: z.email("That email address does not look right"),
  phone: z
    .string()
    .min(9, "A contact number is required")
    .regex(saPhone, "Use a South African number, e.g. 060 976 3429"),
  role: z.string().min(2, "Which role are you applying for?").max(160),
  experience: z.string().min(20, "Tell us about your experience").max(4000),
  competencies: z.string().max(1000).optional(),
  cv: attachmentSchema.optional().nullable(),
  consent: z
    .boolean()
    .refine((v) => v, "Please confirm we may keep your details on file"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Human-readable reference: LKH-QT-<yymmdd>-<4 chars>. */
export function makeReference(prefix: "QT" | "CT" | "CV") {
  const now = new Date();
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LKH-${prefix}-${stamp}-${rand}`;
}
