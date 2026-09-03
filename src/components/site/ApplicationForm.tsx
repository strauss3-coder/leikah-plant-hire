"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Check, Loader2, Send } from "lucide-react";
import { TextField, TextArea, Consent } from "@/components/ui/Field";
import { FileDrop, type Attachment } from "./FileDrop";
import { submitApplication, type ActionResult } from "@/lib/enquiries/actions";

/* ============================================================================
   APPLICATION FORM

   Doubles as the speculative-application route when no vacancies are posted,
   which is the honest position for a business that hires when work comes in
   rather than to a published headcount plan.
   ========================================================================= */

export function ApplicationForm({ defaultRole = "" }: { defaultRole?: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: defaultRole,
    experience: "",
    competencies: "",
    consent: false,
  });
  const [cv, setCv] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await submitApplication({ ...form, cv: cv[0] ?? null });
      setResult(response);
      setErrors(response.errors ?? {});
    });
  };

  if (result?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="chamfer flex flex-col items-center gap-5 border border-gold-500/35 bg-ink-900 p-10 text-center"
      >
        <span className="chamfer-sm inline-flex size-14 items-center justify-center border border-gold-500/45 text-gold-400">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <h2 className="text-display-4 text-paper-50">Application received</h2>
        {result.reference && (
          <p className="font-mono text-sm text-gold-400">Reference {result.reference}</p>
        )}
        <p className="max-w-md text-sm leading-relaxed text-steel-300">{result.message}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Your name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
          required
        />
        <TextField
          label="Role you are applying for"
          placeholder="e.g. Diesel mechanic, dozer operator"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          error={errors.role}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
        />
        <TextField
          label="Contact number"
          type="tel"
          placeholder="060 976 3429"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          required
        />
      </div>

      <TextArea
        label="Your experience"
        hint="Where you have worked, on what machines, and for how long. Mine or quarry experience is worth mentioning specifically."
        value={form.experience}
        onChange={(e) => set("experience", e.target.value)}
        error={errors.experience}
        rows={7}
        required
      />

      <TextArea
        label="Competencies and licences"
        hint="Machine competencies, trade qualifications, medicals, driver's licence codes."
        value={form.competencies}
        onChange={(e) => set("competencies", e.target.value)}
        error={errors.competencies}
        rows={4}
      />

      <FileDrop
        value={cv}
        onChange={(files) => setCv(files.slice(0, 1))}
        max={1}
        label="Your CV"
        hint="PDF or Word document, up to 20 MB. One file."
      />

      <Consent checked={form.consent} onChange={(v) => set("consent", v)} error={errors.consent}>
        I confirm that Leikah Plant Hire may keep these details on file to consider me for current
        and future roles. You can ask us to delete them at any time.
      </Consent>

      {result && !result.ok && !result.errors && (
        <p className="chamfer-sm flex items-start gap-2.5 border border-signal-red/40 bg-signal-red/8 p-4 text-sm text-steel-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal-red" />
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="chamfer-sm inline-flex h-13 items-center justify-center gap-2.5 bg-gold-500 px-7 font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-60 sm:self-start"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send the application
          </>
        )}
      </button>
    </form>
  );
}
