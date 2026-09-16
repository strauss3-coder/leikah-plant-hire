"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LeikahMark, WORDMARK } from "@/components/brand/Logo";
import { MachineSilhouette } from "@/components/graphics/MachineSilhouette";
import { DustField } from "@/components/graphics/Atmosphere";
import type { LoaderContent } from "@/lib/cms/types";

/* ============================================================================
   WELCOME SEQUENCE

   Shown once per browser session, on arrival.

   No flash of the page underneath
   -------------------------------
   The cover is server-rendered, so it is in the first byte of HTML rather than
   dropped over the page after hydration. A one-line inline script in the layout
   stamps `data-intro` on <html> before the cover paints, and CSS hides the
   element outright for anyone who has already had the intro this session. That
   is why this component renders identical markup on the server and the client:
   the decision is made in CSS, not in the render, so hydration has nothing to
   disagree about.

   It ends when the page is ready, not when a timer says so
   --------------------------------------------------------
   `whenReady` races the things that actually matter (fonts decoded, the hero
   image decoded, window load) against a ceiling from the CMS. A fast visit
   lifts in a few hundred milliseconds; the ceiling exists only so a slow
   connection cannot hold someone behind an animation.

   The cost, stated plainly: nothing behind a full-screen cover counts as
   painted, so `introMaxMs` is the floor for Largest Contentful Paint on a cold
   visit. See src/content/seed/loader.ts before raising it.
   ========================================================================= */

const SESSION_KEY = "leikah:intro-shown";
/** Announced when the cover has gone, so the cookie banner can wait for it. */
export const INTRO_DONE_EVENT = "leikah:intro-done";
const EASE = [0.16, 1, 0.3, 1] as const;

function markSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* Private window. The intro simply runs again next session. */
  }
}

function alreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage blocked: skip rather than repeat the intro on every navigation.
    return true;
  }
}

/** Resolves when the things worth waiting for have finished, or at the cap. */
function whenReady(capMs: number): Promise<void> {
  const signals: Promise<unknown>[] = [];

  if (document.fonts?.ready) signals.push(document.fonts.ready);

  if (document.readyState !== "complete") {
    signals.push(new Promise((r) => window.addEventListener("load", r, { once: true })));
  }

  // The hero image is the largest thing behind the cover, so it is the one
  // asset worth holding for: decoding it here means the reveal lands on a
  // finished picture rather than on a blur-up still in flight.
  const hero = document.querySelector<HTMLImageElement>(
    'main img[fetchpriority="high"], main img',
  );
  if (hero && !hero.complete) {
    signals.push(
      hero.decode?.().catch(() => undefined) ??
        new Promise((r) => hero.addEventListener("load", r, { once: true })),
    );
  }

  const cap = new Promise<void>((r) => setTimeout(r, capMs));
  return signals.length
    ? Promise.race([Promise.all(signals).then(() => undefined), cap])
    : cap;
}

export function Preloader({ loader }: { loader: LoaderContent }) {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Return visit, reduced motion, or blocked storage: clear it immediately.
    // The attribute is what actually hides the cover, and it applies in the
    // same style recalculation, so unmounting can wait a frame. Deferring the
    // state write is what keeps this out of react-hooks/set-state-in-effect.
    if (reduced || alreadySeen()) {
      document.documentElement.setAttribute("data-intro", "seen");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }

    document.body.style.overflow = "hidden";
    let cancelled = false;

    // A readout that moves while real work happens. It approaches full on a
    // curve without reaching it, then snaps to 100 on completion, so it can
    // never claim to be finished before the page actually is.
    const started = Date.now();
    const tick = setInterval(() => {
      const t = (Date.now() - started) / loader.introMaxMs;
      setProgress(Math.min(94, Math.round((1 - Math.exp(-3.2 * t)) * 100)));
    }, 90);

    const release = () => {
      document.body.style.overflow = "";
      document.documentElement.setAttribute("data-intro", "seen");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };

    void whenReady(loader.introMaxMs).then(() => {
      if (cancelled) return;
      // Ready early is the common case on a warm connection. Hold to the floor
      // so the sequence plays rather than flickering, then complete.
      const remaining = Math.max(0, loader.introMinMs - (Date.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        clearInterval(tick);
        setProgress(100);
        markSeen();
        // One beat at 100 so the readout is seen to complete.
        setTimeout(() => {
          if (cancelled) return;
          setDone(true);
          release();
        }, 180);
      }, remaining);
    });

    return () => {
      cancelled = true;
      clearInterval(tick);
      release();
    };
  }, [reduced, loader.introMinMs, loader.introMaxMs]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="intro-sequence"
          key="intro"
          aria-hidden="true"
          className="fixed inset-0 z-[96] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          {/* --- Ground: survey grid, bloom, drifting dust ------------------- */}
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-steel-500) 1px, transparent 1px), linear-gradient(to bottom, var(--color-steel-500) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              WebkitMaskImage: "radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)",
              maskImage: "radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-gold-500) 12%, transparent), transparent 62%)",
            }}
          />
          <DustField density={26} />

          {/* --- Lockup ------------------------------------------------------ */}
          <motion.div
            className="relative flex flex-col items-center gap-5 px-6"
            exit={{ scale: 1.06, opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <LeikahMark className="h-14 w-14 sm:h-16 sm:w-16" />
            </motion.div>

            <motion.span
              className="font-mono text-[0.5625rem] tracking-[0.34em] text-steel-500 uppercase sm:text-[0.625rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.22 }}
            >
              {loader.welcome}
            </motion.span>

            {/* Letters rise individually. The static x offset sits on a wrapping
                <g> because Motion writes its own transform on the element it
                animates and would otherwise stack every glyph at x=0. */}
            <svg
              viewBox={`0 0 ${WORDMARK.width} 100`}
              className="h-7 w-auto max-w-[78vw] sm:h-9"
              aria-hidden="true"
            >
              <g fill="var(--color-paper-50)">
                {WORDMARK.glyphs.map((glyph, i) => (
                  <g key={i} transform={`translate(${glyph.x} 0)`}>
                    <motion.path
                      d={glyph.d}
                      fillRule={glyph.evenodd ? "evenodd" : "nonzero"}
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.62, delay: 0.3 + i * 0.055, ease: EASE }}
                    />
                  </g>
                ))}
              </g>
            </svg>

            {/* Descriptor completes the lockup. Without it the wordmark alone
                reads as an unfinished logo rather than the brand signature. */}
            <motion.span
              className="font-mono text-[0.5rem] tracking-[0.44em] text-gold-500 uppercase sm:text-[0.5625rem]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.72, ease: EASE }}
            >
              Plant Hire
            </motion.span>

            <motion.div
              className="flex flex-col items-center gap-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.86, ease: EASE }}
            >
              {loader.statement.map((line) => (
                <p key={line} className="text-xs text-steel-400 sm:text-sm">
                  {line}
                </p>
              ))}
            </motion.div>
          </motion.div>

          {/* --- Machine, driving across the ground datum -------------------- */}
          <motion.div
            className="pointer-events-none absolute bottom-[16vh] w-[min(46vw,26rem)]"
            style={{ willChange: "transform" }}
            initial={{ x: "-140%", opacity: 0 }}
            animate={{ x: "8vw", opacity: 1 }}
            exit={{
              x: "120%",
              opacity: 0,
              transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] },
            }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MachineSilhouette
              machine="excavator"
              cutColor="var(--color-ink-950)"
              className="w-full text-gold-500/85"
            />
            <div
              className="absolute bottom-0 right-full h-14 w-2/3 blur-xl"
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--color-steel-300) 34%, transparent), transparent 70%)",
              }}
            />
          </motion.div>

          {/* --- Equipment status readout ----------------------------------- */}
          <motion.div
            className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-6 pb-7 sm:px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="font-mono text-[0.5625rem] tracking-[0.28em] text-steel-500 uppercase">
              {loader.progressLabel}
            </span>
            {/* Segmented steel bar rather than a spinner. */}
            <div className="relative h-1.5 flex-1 overflow-hidden bg-ink-800">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--color-steel-600) 0 2px, transparent 2px 10px)",
                }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: "linear" }}
              />
            </div>
            <span className="font-mono text-[0.625rem] text-gold-500 tabular">
              {String(progress).padStart(3, "0")}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Runs before the cover is painted and stamps <html> for a visitor who has
 * already had the intro this session, which CSS then hides on. Inline and
 * synchronous by necessity: anything deferred paints the cover first.
 */
export const INTRO_GUARD = `try{document.documentElement.setAttribute('data-intro',sessionStorage.getItem('${SESSION_KEY}')==='1'?'seen':'run')}catch(e){document.documentElement.setAttribute('data-intro','seen')}`;
