"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cookie, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CookieCategory } from "@/lib/cms/types";
import {
  CONSENT_OPEN_EVENT,
  getServerConsent,
  readConsent,
  saveConsent,
  subscribeToConsent,
  type OptionalCategory,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/* ============================================================================
   COOKIE CONSENT

   Shown once, on a first visit, and never again once a choice is recorded.
   Three routes out, as the law expects: accept everything, reject everything
   optional, or open preferences and decide category by category.

   It is a banner rather than a blocking modal. Nothing optional runs before a
   choice is made, so there is no reason to hold the page hostage; the
   preferences panel, which *is* a decision surface, is a proper modal dialog
   with a focus trap and an Escape key.

   Hydration: the decision is read through `useSyncExternalStore` whose server
   snapshot reads as "decided", so the banner is never in the server HTML and
   can never mismatch. See lib/consent.ts.
   ========================================================================= */

const OPTIONAL: OptionalCategory[] = ["analytics", "functional"];

export function CookieConsent({
  categories,
  policyHref = "/cookies",
  privacyHref = "/privacy",
}: {
  categories: CookieCategory[];
  policyHref?: string;
  privacyHref?: string;
}) {
  const reduced = useReducedMotion();
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, getServerConsent);

  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<Record<OptionalCategory, boolean>>({
    analytics: false,
    functional: false,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const undecided = consent === null;
  const bannerOpen = undecided && !panelOpen;

  /**
   * The banner is fixed to the bottom of the viewport, so without this it sits
   * on top of whatever is at the foot of the page. On the contact and careers
   * forms that is the consent checkbox and the submit button, which made them
   * unclickable for a first-time visitor. Reserving the banner's real height as
   * body padding lets the page scroll clear of it instead.
   */
  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!bannerOpen) {
      document.body.style.removeProperty("padding-bottom");
      return;
    }
    const node = bannerRef.current;
    if (!node) return;

    const apply = () => {
      document.body.style.paddingBottom = `${node.offsetHeight}px`;
    };
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      document.body.style.removeProperty("padding-bottom");
    };
  }, [bannerOpen]);

  /* The footer link opens preferences at any time, including after a choice. */
  useEffect(() => {
    const open = () => {
      const current = readConsent();
      setDraft({
        analytics: current?.analytics ?? false,
        functional: current?.functional ?? false,
      });
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      setPanelOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    restoreFocusTo.current?.focus?.();
    restoreFocusTo.current = null;
  }, []);

  /* Escape to close, and a focus trap while the dialog is open. */
  useEffect(() => {
    if (!panelOpen) return;

    const node = panelRef.current;
    node?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }
      if (event.key !== "Tab" || !node) return;

      const focusable = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [panelOpen, closePanel]);

  const decide = useCallback(
    (choice: Record<OptionalCategory, boolean>) => {
      saveConsent(choice);
      setPanelOpen(false);
      restoreFocusTo.current?.focus?.();
      restoreFocusTo.current = null;
    },
    [],
  );

  const acceptAll = () => decide({ analytics: true, functional: true });
  const rejectOptional = () => decide({ analytics: false, functional: false });

  const openPanel = () => {
    setDraft({
      analytics: consent?.analytics ?? false,
      functional: consent?.functional ?? false,
    });
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setPanelOpen(true);
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      {/* --- Banner -------------------------------------------------------- */}
      <AnimatePresence>
        {bannerOpen && (
          <motion.div
            key="cookie-banner"
            ref={bannerRef}
            role="region"
            aria-label="Cookie consent"
            className="fixed inset-x-0 bottom-0 z-[70] border-t border-gold-500/25 bg-ink-950/97 backdrop-blur-md"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease }}
          >
            <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:gap-8 lg:py-6">
              <Cookie
                className="hidden size-6 shrink-0 text-gold-500 lg:block"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-bold text-paper-50">
                  We keep cookies to a minimum
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-steel-400">
                  This site sets no advertising or tracking cookies. We need a few essential ones to
                  keep enquiry forms working, and we will only store anything optional if you allow
                  it. Read our{" "}
                  <Link
                    href={policyHref}
                    className="text-gold-400 underline underline-offset-4 hover:text-gold-300"
                  >
                    Cookie Policy
                  </Link>{" "}
                  or{" "}
                  <Link
                    href={privacyHref}
                    className="text-gold-400 underline underline-offset-4 hover:text-gold-300"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Button type="button" size="sm" variant="primary" onClick={acceptAll}>
                  Accept all cookies
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={rejectOptional}>
                  Reject optional cookies
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={openPanel}>
                  Manage preferences
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Preferences dialog -------------------------------------------- */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="cookie-panel"
            className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.3 }}
          >
            <button
              type="button"
              aria-label="Close cookie preferences"
              tabIndex={-1}
              className="absolute inset-0 cursor-default bg-ink-950/80 backdrop-blur-sm"
              onClick={closePanel}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-panel-title"
              aria-describedby="cookie-panel-desc"
              className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden border border-steel-600/25 bg-ink-900 sm:chamfer"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
              transition={{ duration: reduced ? 0.15 : 0.42, ease }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-steel-600/20 p-6">
                <div>
                  <h2
                    id="cookie-panel-title"
                    className="font-display text-xl font-bold text-paper-50"
                  >
                    Cookie preferences
                  </h2>
                  <p id="cookie-panel-desc" className="mt-2 max-w-md text-sm text-steel-400">
                    Choose what this site may store on your device. You can change this at any time
                    from the link in the footer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close cookie preferences"
                  className="chamfer-sm shrink-0 border border-steel-600/30 p-2 text-steel-300 transition-colors hover:border-gold-500/50 hover:text-paper-50"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col">
                  {categories.map((category) => {
                    const optional = !category.required;
                    const checked = optional
                      ? draft[category.id as OptionalCategory]
                      : true;
                    const inputId = `cookie-cat-${category.id}`;

                    return (
                      <li
                        key={category.id}
                        className="border-b border-steel-600/15 p-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            disabled={!optional}
                            data-autofocus={category.id === "analytics" ? "" : undefined}
                            onChange={(event) => {
                              if (!optional) return;
                              const next = event.target.checked;
                              setDraft((prev) => ({
                                ...prev,
                                [category.id as OptionalCategory]: next,
                              }));
                            }}
                            className={cn(
                              "mt-1 size-5 shrink-0 cursor-pointer appearance-none border border-steel-600/50 bg-ink-800",
                              "checked:border-gold-500 checked:bg-gold-500",
                              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
                              "disabled:cursor-not-allowed disabled:opacity-70",
                              "bg-[length:11px_11px] bg-center bg-no-repeat",
                              "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M2 8.5l4 4 8-9%22 fill=%22none%22 stroke=%22%2307090c%22 stroke-width=%223%22 stroke-linecap=%22square%22/></svg>')]",
                            )}
                          />
                          <div className="min-w-0">
                            <label
                              htmlFor={inputId}
                              className="flex flex-wrap items-center gap-2.5 font-semibold text-paper-50"
                            >
                              {category.name}
                              {category.required && (
                                <span className="inline-flex items-center gap-1.5 border border-steel-600/35 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-steel-400 uppercase">
                                  <Lock className="size-2.5" aria-hidden="true" />
                                  Always on
                                </span>
                              )}
                            </label>
                            <p className="mt-2 text-sm leading-relaxed text-steel-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-steel-600/20 bg-ink-950/60 p-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDraft({ analytics: false, functional: false })
                  }
                >
                  Turn all optional off
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setDraft({ analytics: true, functional: true })}
                >
                  Turn all optional on
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={() => decide(draft)}>
                  Save my preferences
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Footer control that reopens the preferences dialog. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={cn("transition-colors hover:text-gold-400", className)}
    >
      Cookie preferences
    </button>
  );
}

/** Kept in sync with the optional categories the panel offers. */
export const OPTIONAL_CATEGORIES = OPTIONAL;
