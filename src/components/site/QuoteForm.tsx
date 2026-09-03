"use client";

import { useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Phone } from "lucide-react";
import { TextField, TextArea, SelectField, CheckGroup, RadioGroup, Consent } from "@/components/ui/Field";
import { FileDrop, type Attachment } from "./FileDrop";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import { submitQuoteRequest, type ActionResult } from "@/lib/enquiries/actions";
import {
  BUDGET_BANDS,
  PROVINCES,
  URGENCY_OPTIONS,
  quoteRequestSchema,
} from "@/lib/enquiries/schema";
import type { Industry, Service } from "@/lib/cms/types";
import { cn, telHref } from "@/lib/utils";

/* ============================================================================
   QUOTATION WORKFLOW

   Four steps rather than one long form, because the alternative is a wall of
   thirteen fields that people abandon. Each step validates only its own fields,
   so nobody is told about a problem three screens ahead of where they are.

   Choosing "emergency" surfaces the phone number immediately — a form is the
   wrong tool when a machine is already down, and saying so is more useful than
   capturing the lead.
   ========================================================================= */

const STEPS = [
  { key: "scope", title: "What you need", fields: ["serviceSlugs", "industrySlug", "urgency"] },
  { key: "site", title: "Site & timing", fields: ["siteLocation", "province", "preferredStart", "duration", "budgetBand"] },
  { key: "detail", title: "The detail", fields: ["description", "attachments"] },
  { key: "contact", title: "Your details", fields: ["company", "contactName", "role", "email", "phone", "consent"] },
] as const;

interface FormState {
  serviceSlugs: string[];
  industrySlug: string;
  urgency: string;
  siteLocation: string;
  province: string;
  preferredStart: string;
  duration: string;
  budgetBand: string;
  description: string;
  attachments: Attachment[];
  company: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  consent: boolean;
}

const EMPTY: FormState = {
  serviceSlugs: [],
  industrySlug: "",
  urgency: "scheduled",
  siteLocation: "",
  province: "Mpumalanga",
  preferredStart: "",
  duration: "",
  budgetBand: "",
  description: "",
  attachments: [],
  company: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  consent: false,
};

export function QuoteForm({
  services,
  industries,
  phone,
}: {
  services: Service[];
  industries: Industry[];
  phone: string;
}) {
  const reduced = useReducedMotion();
  // Read on the client so this route can prerender — see ServiceFilter.
  const params = useSearchParams();
  const preselectedService = params.get("service") ?? undefined;

  const [step, setStep] = useState(0);

  // Seeded on first render rather than synced by an effect, so the service the
  // visitor arrived from is already ticked when the form paints.
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY,
    serviceSlugs:
      preselectedService && services.some((s) => s.slug === preselectedService)
        ? [preselectedService]
        : [],
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const serviceOptions = useMemo(
    () => services.map((s) => ({ value: s.slug, label: s.title, note: s.summary })),
    [services],
  );

  const industryOptions = useMemo(
    () => industries.map((i) => ({ value: i.slug, label: i.name })),
    [industries],
  );

  /** Validates only the fields belonging to the current step. */
  const validateStep = (index: number) => {
    const payload = {
      ...form,
      preferredStart: form.preferredStart || null,
      source: preselectedService ? `service:${preselectedService}` : "quote-page",
    };
    const parsed = quoteRequestSchema.safeParse(payload);
    if (parsed.success) return true;

    const stepFields = STEPS[index].fields as readonly string[];
    const found: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (stepFields.includes(key)) found[key] ??= issue.message;
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    if (!validateStep(STEPS.length - 1)) return;

    startTransition(async () => {
      const response = await submitQuoteRequest({
        ...form,
        preferredStart: form.preferredStart || null,
        source: preselectedService ? `service:${preselectedService}` : "quote-page",
      });
      setResult(response);
      if (!response.ok && response.errors) {
        setErrors(response.errors);
        // Send the reader to the earliest step that has a problem.
        const firstBad = STEPS.findIndex((s) =>
          (s.fields as readonly string[]).some((f) => response.errors?.[f]),
        );
        if (firstBad >= 0) setStep(firstBad);
      }
    });
  };

  if (result?.ok) {
    return <Success result={result} phone={phone} />;
  }

  return (
    <div className="chamfer relative border border-steel-600/18 bg-ink-900">
      <CornerMarks />

      {/* --- Progress --------------------------------------------------------- */}
      <ol className="grid gap-px border-b border-steel-600/15 bg-steel-600/12 sm:grid-cols-4">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.key} className="bg-ink-900">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors",
                  i < step && "hover:bg-ink-850",
                  i > step && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "chamfer-sm flex size-8 shrink-0 items-center justify-center border font-mono text-xs font-semibold transition-colors",
                    current && "border-gold-500 bg-gold-500 text-ink-950",
                    done && "border-gold-500/50 text-gold-400",
                    !current && !done && "border-steel-600/25 text-steel-500",
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : String(i + 1)}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    current ? "text-paper-50" : done ? "text-steel-300" : "text-steel-500",
                  )}
                >
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* --- Steps -------------------------------------------------------------- */}
      <div className="p-6 sm:p-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step].key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-7"
          >
            {step === 0 && (
              <>
                <CheckGroup
                  label="Which services do you need?"
                  hint="Choose everything that applies — it routes the enquiry to the right desk."
                  error={errors.serviceSlugs}
                  options={serviceOptions}
                  value={form.serviceSlugs}
                  onChange={(v) => set("serviceSlugs", v)}
                  columns={2}
                />

                <SelectField
                  label="What sector do you operate in?"
                  options={industryOptions}
                  placeholder="Select a sector"
                  value={form.industrySlug}
                  onChange={(e) => set("industrySlug", e.target.value)}
                  error={errors.industrySlug}
                  required
                />

                <RadioGroup
                  name="urgency"
                  label="How urgent is it?"
                  options={URGENCY_OPTIONS}
                  value={form.urgency}
                  onChange={(v) => set("urgency", v)}
                  error={errors.urgency}
                />

                {form.urgency === "emergency" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="chamfer-sm flex flex-col gap-4 border border-gold-500/45 bg-gold-500/8 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold-400" />
                      <p className="text-sm leading-relaxed text-steel-200">
                        If a machine is down right now, call. The line is answered around the clock
                        and it will always be faster than a form.
                      </p>
                    </div>
                    <a
                      href={telHref(phone)}
                      className="chamfer-sm inline-flex h-12 shrink-0 items-center gap-2.5 bg-gold-500 px-5 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
                    >
                      <Phone className="size-4" />
                      <span className="tabular">{phone}</span>
                    </a>
                  </motion.div>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Site or town"
                    hint="Where the work will happen — a mine, plant or town name is enough."
                    placeholder="e.g. Coal operation, Hendrina"
                    value={form.siteLocation}
                    onChange={(e) => set("siteLocation", e.target.value)}
                    error={errors.siteLocation}
                    required
                  />
                  <SelectField
                    label="Province"
                    options={PROVINCES}
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                    error={errors.province}
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Preferred start date"
                    type="date"
                    value={form.preferredStart}
                    onChange={(e) => set("preferredStart", e.target.value)}
                    error={errors.preferredStart}
                  />
                  <TextField
                    label="Expected duration"
                    placeholder="e.g. 3 months, or one-off"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    error={errors.duration}
                  />
                </div>

                <SelectField
                  label="Budget band"
                  hint="Only if you have one. It helps us propose something realistic rather than something you have to reject."
                  options={BUDGET_BANDS}
                  placeholder="Select a band"
                  value={form.budgetBand}
                  onChange={(e) => set("budgetBand", e.target.value)}
                  error={errors.budgetBand}
                />
              </>
            )}

            {step === 2 && (
              <>
                <TextArea
                  label="Describe the work"
                  hint="Machine make and model, fault symptoms, volumes, access constraints, deadlines — whatever you have. The more specific this is, the closer the first number will be to the final one."
                  placeholder="e.g. Bell B40D, fleet no. A20. Loses drive under load in 3rd and 4th. Oil sample last month showed rising iron. Machine is on a live bench with lowbed access."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  error={errors.description}
                  rows={8}
                  required
                />

                <FileDrop
                  value={form.attachments}
                  onChange={(v) => set("attachments", v)}
                />
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Company"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    error={errors.company}
                    autoComplete="organization"
                    required
                  />
                  <TextField
                    label="Your name"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    error={errors.contactName}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Your role"
                    placeholder="e.g. Maintenance planner"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    error={errors.role}
                    autoComplete="organization-title"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                </div>

                <TextField
                  label="Contact number"
                  type="tel"
                  placeholder="060 976 3429"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  error={errors.phone}
                  autoComplete="tel"
                  required
                  className="sm:max-w-sm"
                />

                <Consent checked={form.consent} onChange={(v) => set("consent", v)} error={errors.consent}>
                  I confirm that Leikah Plant Hire may contact me about this enquiry and store these
                  details for that purpose. We do not sell or share enquiry data, and you can ask us
                  to delete it at any time.
                </Consent>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {result && !result.ok && !result.errors && (
          <p className="chamfer-sm mt-7 flex items-start gap-2.5 border border-signal-red/40 bg-signal-red/8 p-4 text-sm text-steel-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal-red" />
            {result.message}
          </p>
        )}

        {/* --- Navigation ------------------------------------------------------ */}
        <div className="mt-9 flex items-center justify-between gap-4 border-t border-steel-600/15 pt-7">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="chamfer-sm inline-flex h-12 items-center gap-2 border border-steel-600/25 px-5 text-sm font-medium text-steel-300 transition-colors hover:border-gold-500/50 hover:text-paper-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <span className="hidden text-xs text-steel-500 tabular sm:block">
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="chamfer-sm inline-flex h-12 items-center gap-2 bg-gold-500 px-6 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400"
            >
              Continue
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="chamfer-sm inline-flex h-12 items-center gap-2.5 bg-gold-500 px-6 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  Send the request
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Success({ result, phone }: { result: ActionResult; phone: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="chamfer relative border border-gold-500/35 bg-ink-900 p-8 text-center sm:p-14"
    >
      <CornerMarks />

      <span className="chamfer-sm mx-auto inline-flex size-16 items-center justify-center border border-gold-500/45 text-gold-400">
        <Check className="size-8" strokeWidth={2.5} />
      </span>

      <h2 className="mt-7 text-display-4 text-paper-50">Request received</h2>

      {result.reference && (
        <p className="mt-4 font-mono text-sm text-gold-400">
          Reference {result.reference}
        </p>
      )}

      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-steel-300">
        {result.message}
      </p>

      {result.degraded && (
        <p className="chamfer-sm mx-auto mt-6 flex max-w-xl items-start gap-2.5 border border-gold-500/35 bg-gold-500/8 p-4 text-left text-xs leading-relaxed text-steel-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold-400" />
          Please call or WhatsApp as well so that this enquiry is definitely picked up.
        </p>
      )}

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={telHref(phone)}
          className="chamfer-sm inline-flex h-12 items-center gap-2.5 bg-gold-500 px-6 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
        >
          <Phone className="size-4" />
          <span className="tabular">{phone}</span>
        </a>
        <Link
          href="/"
          className="chamfer-sm inline-flex h-12 items-center border border-steel-600/25 px-6 text-sm font-medium text-steel-200 transition-colors hover:border-gold-500/50"
        >
          Back to the site
        </Link>
      </div>
    </motion.div>
  );
}
