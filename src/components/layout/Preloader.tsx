"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LeikahMark, LeikahWordmark } from "@/components/brand/Logo";
import { Blueprint } from "@/components/graphics/Blueprint";
import { DustField, SurveyGrid } from "@/components/graphics/Atmosphere";

/* ============================================================================
   BRANDED LOADING SCREEN

   Shown once per browser session on first paint, then never again — a loader
   that reappears on every navigation is an obstacle, not a brand moment. It
   dismisses on window load or after a hard ceiling, whichever comes first, so a
   slow asset can never trap the visitor behind it.

   Whether the intro has already run is read through `useSyncExternalStore`
   rather than set from an effect. sessionStorage is an external browser store,
   and this is the API for reading one: the server snapshot says "already seen",
   so nothing renders during hydration, and React re-renders with the real value
   immediately afterwards. Setting state from the effect instead would paint the
   page first and drop the loader over it a frame later.
   ========================================================================= */

const SESSION_KEY = "leikah:intro-shown";
const CEILING_MS = 2200;

/** sessionStorage never changes underneath us within a session. */
const subscribe = () => () => {};

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Private browsing or blocked storage — skip the intro rather than repeat it.
    return true;
  }
}

export function Preloader() {
  const reduced = useReducedMotion();
  const seen = useSyncExternalStore(subscribe, hasSeenIntro, () => true);
  const [dismissed, setDismissed] = useState(false);

  const visible = !seen && !reduced && !dismissed;

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    const dismiss = () => {
      setDismissed(true);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Nothing to do — the intro simply shows again next session.
      }
    };

    const ceiling = setTimeout(dismiss, CEILING_MS);
    let settle: ReturnType<typeof setTimeout>;
    const onLoad = () => {
      settle = setTimeout(dismiss, 620);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      clearTimeout(ceiling);
      clearTimeout(settle);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <SurveyGrid opacity={0.5} />
          <DustField density={34} />

          {/* An excavator drawing itself in behind the mark — the same
              signature move as the hero, so the intro previews the site. */}
          <Blueprint
            machine="excavator"
            animate={false}
            intensity={0.14}
            stroke="var(--color-gold-400)"
            className="absolute left-1/2 top-1/2 h-auto w-[46rem] -translate-x-1/2 -translate-y-1/2 max-w-[92vw]"
          />

          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <LeikahMark className="h-16 w-16" />
            <LeikahWordmark className="h-6 w-auto text-paper-50" />
          </motion.div>

          {/* Load rule — a mechanical wipe rather than a spinner. */}
          <div className="relative mt-10 h-px w-40 overflow-hidden bg-steel-600/40">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gold-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: CEILING_MS / 1000, ease: [0.33, 1, 0.68, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
