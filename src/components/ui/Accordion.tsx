"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   ACCORDION

   Used for FAQs and for the safety procedure groups. Built on real buttons with
   `aria-expanded` and a controlled region, so it works from the keyboard and
   reads correctly to a screen reader — the panel is not just a hidden div.
   ========================================================================= */

export interface AccordionEntry {
  id: string;
  question: string;
  answer: string;
  meta?: string;
}

export function Accordion({
  items,
  tone = "dark",
  defaultOpen,
  className,
}: {
  items: AccordionEntry[];
  tone?: "dark" | "light";
  /** Index to open on first render. Leave undefined for all-closed. */
  defaultOpen?: number;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(
    defaultOpen !== undefined ? (items[defaultOpen]?.id ?? null) : null,
  );
  const baseId = useId();

  const dark = tone === "dark";

  if (!items.length) return null;

  return (
    <div
      className={cn(
        "divide-y border-y",
        dark ? "divide-steel-600/15 border-steel-600/15" : "divide-ink-900/10 border-ink-900/10",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(
                  "group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors",
                  dark ? "hover:text-gold-400" : "hover:text-gold-700",
                )}
              >
                <span className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "text-base font-semibold transition-colors sm:text-lg",
                      dark ? "text-paper-50" : "text-ink-950",
                      isOpen && (dark ? "text-gold-400" : "text-gold-700"),
                    )}
                  >
                    {item.question}
                  </span>
                  {item.meta && (
                    <span className={cn("eyebrow", dark ? "text-steel-500" : "text-ink-500")}>
                      {item.meta}
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center border transition-all duration-400 chamfer-sm",
                    dark
                      ? "border-steel-600/25 text-steel-300 group-hover:border-gold-500/50"
                      : "border-ink-900/12 text-ink-500 group-hover:border-gold-600/50",
                    isOpen && "rotate-45 border-gold-500/60 text-gold-500",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "max-w-3xl pb-6 pr-12 text-sm leading-relaxed sm:text-[0.9375rem]",
                      dark ? "text-steel-300" : "text-ink-500",
                    )}
                  >
                    {item.answer.split(/\n\s*\n/).map((para, i) => (
                      <p key={i} className={i > 0 ? "mt-3" : undefined}>
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
