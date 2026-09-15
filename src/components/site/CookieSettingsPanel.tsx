"use client";

import { useSyncExternalStore } from "react";
import { ShieldCheck, Lock, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import type { CookieCategory } from "@/lib/cms/types";
import {
  clearConsent,
  getServerConsent,
  openConsentPreferences,
  readConsent,
  saveConsent,
  type OptionalCategory,
} from "@/lib/consent";
import { formatDate } from "@/lib/utils";

/* ============================================================================
   COOKIE SETTINGS, ON THE POLICY PAGE

   A policy that explains a choice but does not let you make it is a dead end.
   This shows the current decision, when it was made, and gives three ways to
   change it without leaving the page.

   The record is read through the same external store as the banner, so this
   panel and the banner can never disagree, and the server snapshot keeps it
   out of the hydration pass.
   ========================================================================= */

export function CookieSettingsPanel({ categories }: { categories: CookieCategory[] }) {
  const consent = useSyncExternalStore(
    (onChange) => {
      const handler = () => onChange();
      window.addEventListener("leikah:consent-change", handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("leikah:consent-change", handler);
        window.removeEventListener("storage", handler);
      };
    },
    readConsent,
    getServerConsent,
  );

  // `decidedAt` is empty only in the server snapshot, so this reads as
  // "not decided yet" during hydration and corrects itself immediately.
  const decided = Boolean(consent?.decidedAt);

  const state = (id: CookieCategory["id"]): "on" | "off" | "always" => {
    if (id === "essential") return "always";
    if (!decided) return "off";
    return consent?.[id as OptionalCategory] ? "on" : "off";
  };

  return (
    <section id="your-choice" className="scroll-mt-28">
      <div className="mb-4 flex items-baseline gap-3">
        <Settings2 className="size-4 shrink-0 text-gold-500" aria-hidden="true" />
        <h2 className="text-display-4 text-paper-50">Your current choice</h2>
      </div>

      <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed">
        <CornerMarks />

        <p className="text-sm leading-relaxed text-steel-400">
          {decided ? (
            <>
              You made a choice on{" "}
              <time dateTime={consent?.decidedAt} className="text-steel-200">
                {formatDate(consent!.decidedAt)}
              </time>
              . It is stored on this device only. You can change it below at any time.
            </>
          ) : (
            <>
              You have not made a choice on this device yet, so nothing optional is being stored.
              Essential items remain active because the site cannot work without them.
            </>
          )}
        </p>

        <ul className="mt-6 flex flex-col divide-y divide-steel-600/15 border-y border-steel-600/15">
          {categories.map((category) => {
            const value = state(category.id);
            return (
              <li key={category.id} className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-sm font-medium text-paper-50">{category.name}</span>
                {value === "always" ? (
                  <span className="inline-flex items-center gap-1.5 border border-steel-600/35 px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.14em] text-steel-400 uppercase">
                    <Lock className="size-2.5" aria-hidden="true" />
                    Always on
                  </span>
                ) : value === "on" ? (
                  <span className="inline-flex items-center gap-1.5 border border-signal-green/40 bg-signal-green/10 px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.14em] text-signal-green uppercase">
                    <ShieldCheck className="size-2.5" aria-hidden="true" />
                    Allowed
                  </span>
                ) : (
                  <span className="border border-steel-600/35 px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.14em] text-steel-500 uppercase">
                    Not allowed
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={() => openConsentPreferences()}
          >
            Change my cookie preferences
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => saveConsent({ analytics: false, functional: false })}
          >
            Reject optional cookies
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => clearConsent()}>
            Clear my saved choice
          </Button>
        </div>
      </div>
    </section>
  );
}
