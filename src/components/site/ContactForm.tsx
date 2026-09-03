"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Check, Loader2, Send } from "lucide-react";
import { TextField, TextArea, SelectField, Consent } from "@/components/ui/Field";
import { submitContactMessage, type ActionResult } from "@/lib/enquiries/actions";
import type { Department } from "@/lib/cms/types";

/* ============================================================================
   CONTACT FORM

   Short by design. Anything that needs a scope, a site and a date belongs on
   the quotation workflow, and the form says so rather than trying to be both.
   ========================================================================= */

export function ContactForm({ departments }: { departments: Department[] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    department: departments[0]?.name ?? "General enquiry",
    subject: "",
    message: "",
    consent: false,
  });
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
      const response = await submitContactMessage(form);
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
        <h2 className="text-display-4 text-paper-50">Message sent</h2>
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
          label="Company"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          error={errors.company}
          autoComplete="organization"
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
        />
      </div>

      <SelectField
        label="Who should this reach?"
        options={departments.map((d) => ({ value: d.name, label: `${d.name} — ${d.role}` }))}
        value={form.department}
        onChange={(e) => set("department", e.target.value)}
        error={errors.department}
        required
      />

      <TextField
        label="Subject"
        value={form.subject}
        onChange={(e) => set("subject", e.target.value)}
        error={errors.subject}
        required
      />

      <TextArea
        label="Message"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        error={errors.message}
        rows={7}
        required
      />

      <Consent checked={form.consent} onChange={(v) => set("consent", v)} error={errors.consent}>
        I confirm that Leikah Plant Hire may use these details to reply to this enquiry. We do not
        sell or share enquiry data, and you can ask us to delete it at any time.
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
            Send the message
          </>
        )}
      </button>
    </form>
  );
}
