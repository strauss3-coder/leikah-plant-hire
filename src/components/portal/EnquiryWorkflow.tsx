"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, Save } from "lucide-react";
import { Panel, PortalButton } from "./Primitives";
import { updateEnquiry } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

/* ============================================================================
   ENQUIRY WORKFLOW

   Status plus an internal note. Deliberately not a full CRM — an enquiry is a
   thing you act on and close, and every field beyond that is one more thing
   that goes stale.
   ========================================================================= */

const STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" },
];

export function EnquiryWorkflow({
  table,
  id,
  status: initialStatus,
  notes: initialNotes,
}: {
  table: "quote_requests" | "contact_messages" | "job_applications";
  id: string;
  status: string;
  notes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (nextStatus?: string) => {
    const target = nextStatus ?? status;
    startTransition(async () => {
      const result = await updateEnquiry({ table, id, status: target, notes });
      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok) {
        setStatus(target);
        setDirty(false);
        router.refresh();
      }
    });
  };

  return (
    <Panel title="Workflow" description="Where this enquiry stands, and anything the team should know.">
      <div className="flex flex-col gap-6">
        <div>
          <span className="mb-3 block text-sm font-medium text-steel-200">Status</span>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => save(option.value)}
                disabled={pending}
                aria-pressed={status === option.value}
                className={cn(
                  "chamfer-sm border px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-60",
                  status === option.value
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-steel-600/25 text-steel-300 hover:border-gold-500/50 hover:text-paper-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-steel-200">Internal notes</span>
          <span className="text-xs text-steel-500">
            Only visible in the portal. Never shown to the customer.
          </span>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setDirty(true);
              setFeedback(null);
            }}
            rows={5}
            placeholder="Site visit booked for Thursday. Waiting on the mine's induction slot."
            className="chamfer-sm w-full resize-y border border-steel-600/25 bg-ink-950 px-3.5 py-3 text-sm leading-relaxed text-paper-50 placeholder:text-steel-500 focus:border-gold-500/70 focus:outline-none"
          />
        </label>

        {feedback && (
          <p
            className={cn(
              "chamfer-sm flex items-start gap-2.5 border p-3 text-xs",
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

        <PortalButton className="self-start" onClick={() => save()} disabled={pending || !dirty}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save notes
        </PortalButton>
      </div>
    </Panel>
  );
}
