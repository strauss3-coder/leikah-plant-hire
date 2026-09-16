"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  MachineSilhouette,
  type MachineName,
} from "@/components/graphics/MachineSilhouette";
import type { LoaderContent } from "@/lib/cms/types";

/* ============================================================================
   ROUTE TRANSITION

   A branded wipe between pages, driven by the navigation rather than a timer.

   How it knows when to lift
   -------------------------
   App Router gives no "route change started" event: `usePathname` only moves
   once the navigation has already happened, which is too late to cover the
   screen. So internal link clicks are intercepted here and pushed through
   `startTransition`, whose `isPending` is exactly "React is still preparing the
   next route". The cover lifts the moment that clears, subject to a floor so an
   instant navigation does not flash, and a ceiling so a slow one cannot trap
   anyone behind an animation.

   Interception rules
   ------------------
   The listener runs on the capture phase and bails out to normal browser
   behaviour on anything it does not fully understand: modified clicks, new-tab
   clicks, downloads, other origins, hash changes and same-page links. A
   transition is decoration; navigation is not, and it must never be the thing
   that breaks.

   Reduced motion skips the overlay entirely rather than shortening it. Someone
   who has asked for less movement does not want a faster wipe, they want none.
   ========================================================================= */

interface Variant {
  machine: MachineName;
  /** Travel direction of the wipe. */
  from: "left" | "right";
  /** Slight vertical bias, so repeats do not feel mechanical. */
  tilt: number;
}

/* Five variants, rotated rather than randomised so a visitor moving through
   the site sees the whole fleet instead of the same machine twice running. */
const VARIANTS: Variant[] = [
  { machine: "excavator", from: "left", tilt: 0 },
  { machine: "dozer", from: "left", tilt: -1.5 },
  { machine: "hauler", from: "right", tilt: 0 },
  { machine: "loader", from: "left", tilt: 1.5 },
  { machine: "crane", from: "right", tilt: -1 },
];

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Anchor hrefs carry the deployment's basePath; `router.push` must not. On the
 * static preview, which is served from /leikah-plant-hire, passing the prefixed
 * path through made Next resolve it twice and fall back to a full page load,
 * which is both slower and skips the transition entirely.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function toRoutePath(url: URL) {
  const path = url.pathname + url.search;
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    return path.slice(BASE_PATH.length) || "/";
  }
  return path;
}

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.defaultPrevented
  );
}

export function RouteTransition({ loader }: { loader: LoaderContent }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  const [active, setActive] = useState(false);
  const [variant, setVariant] = useState(0);
  /**
   * "push" is a link click: the plate sweeps in, holds, sweeps out.
   * "pop" is browser back or forward. The router has already swapped the
   * content by the time we hear about it, so the plate starts fully covering
   * instead of sliding in; sliding it in would show a frame of the new page
   * first. Both run to the same floor, so the two feel the same length.
   */
  const [mode, setMode] = useState<"push" | "pop">("push");
  const startedAt = useRef(0);
  const nextVariant = useRef(0);

  const advance = useCallback(() => {
    nextVariant.current = (nextVariant.current + 1) % VARIANTS.length;
    setVariant(nextVariant.current);
    startedAt.current = Date.now();
  }, []);

  const begin = useCallback(
    (href: string) => {
      advance();
      setMode("push");
      setActive(true);
      startTransition(() => router.push(href));
    },
    [router, advance],
  );

  /* --- Link interception -------------------------------------------------- */
  useEffect(() => {
    if (reduced) return;

    const onClick = (event: MouseEvent) => {
      if (!isPlainLeftClick(event)) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      // Anything the browser should own outright.
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.dataset.noTransition !== undefined) return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^[a-z]+:/i.test(raw.replace(/^\/\//, "http://"))) {
        // Covers mailto:, tel:, whatsapp links and in-page anchors.
        if (!raw || !raw.startsWith("/")) return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      // Same page, or only the hash moved: let the browser scroll.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      event.preventDefault();
      begin(toRoutePath(url));
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [begin, reduced]);

  /* --- Back and forward ---------------------------------------------------
     These are the navigations that had no transition at all: the browser
     drives them, so there is no click to intercept. `popstate` fires before
     the router has repainted, which is early enough to cover the screen.
     ---------------------------------------------------------------------- */
  /* Where the router last settled. Tracked from the rendered pathname rather
     than updated inside the popstate handler: a handler-local copy goes stale
     the moment a link click pushes a route, after which back looks like a
     hash change and is skipped. `popstate` fires before React re-renders, so
     at that point this still holds the page being left. */
  const lastLoc = useRef("");
  useEffect(() => {
    lastLoc.current = window.location.pathname + window.location.search;
  }, [pathname]);

  useEffect(() => {
    if (reduced) return;

    const onPop = () => {
      const now = window.location.pathname + window.location.search;
      // A hash-only change is not a page change; let it scroll.
      if (now === lastLoc.current) return;
      advance();
      setMode("pop");
      setActive(true);
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [reduced, advance]);

  /* --- Lift when the route is ready, subject to floor and ceiling --------- */
  useEffect(() => {
    if (!active || isPending) return;
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, loader.transitionMinMs - elapsed);
    const timer = setTimeout(() => setActive(false), wait);
    return () => clearTimeout(timer);
  }, [active, isPending, loader.transitionMinMs]);

  useEffect(() => {
    if (!active) return;
    const ceiling = setTimeout(() => setActive(false), loader.transitionMaxMs);
    return () => clearTimeout(ceiling);
  }, [active, loader.transitionMaxMs]);

  if (reduced) return null;

  const v = VARIANTS[variant];
  const enterFrom = v.from === "left" ? "-101%" : "101%";
  const exitTo = v.from === "left" ? "101%" : "-101%";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-transition"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Steel plate. Transform only, so the whole wipe stays on the
              compositor and never triggers layout. */}
          <motion.div
            className="absolute inset-0 bg-ink-950"
            style={{ willChange: "transform" }}
            initial={mode === "pop" ? { x: "0%", skewX: 0 } : { x: enterFrom, skewX: v.tilt }}
            animate={{ x: "0%", skewX: 0 }}
            exit={{ x: exitTo, skewX: v.tilt }}
            transition={{ duration: 0.52, ease: EASE }}
          >
            {/* Caution stripe on the leading edge */}
            <div
              className={`absolute inset-y-0 w-3 ${v.from === "left" ? "right-0" : "left-0"}`}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--color-gold-500) 0 10px, var(--color-ink-950) 10px 20px)",
                opacity: 0.85,
              }}
            />
            {/* Survey grid, so the plate reads as brand rather than as a blank */}
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-steel-500) 1px, transparent 1px), linear-gradient(to bottom, var(--color-steel-500) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
          </motion.div>

          {/* The machine, travelling a little faster than the plate so it
              leads the wipe rather than sitting on it. */}
          <motion.div
            className="absolute bottom-[14vh] w-[min(38vw,22rem)]"
            style={{ willChange: "transform" }}
            initial={{ x: v.from === "left" ? "-130%" : "130%", opacity: 0 }}
            animate={{
              x: v.from === "left" ? "38vw" : "-38vw",
              opacity: 1,
              transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              x: v.from === "left" ? "150%" : "-150%",
              opacity: 0,
              transition: { duration: 0.5, ease: [0.55, 0, 1, 0.45] },
            }}
          >
            <MachineSilhouette
              machine={v.machine}
              cutColor="var(--color-ink-950)"
              className={`w-full text-gold-500 ${v.from === "right" ? "-scale-x-100" : ""}`}
            />
            {/* Dust kicked up behind the travel direction. A blurred gradient
                rather than particles: one element, no per-frame work. */}
            <div
              className={`absolute bottom-0 h-16 w-2/3 blur-xl ${
                v.from === "left" ? "right-full" : "left-full"
              }`}
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--color-steel-300) 38%, transparent), transparent 70%)",
              }}
            />
          </motion.div>

          {/* Progress readout, so the cover explains itself if it is held */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-6 pb-6 sm:px-10">
            <span className="font-mono text-[0.5625rem] tracking-[0.28em] text-steel-500 uppercase">
              {loader.progressLabel}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-steel-600/40">
              <motion.div
                className="h-full bg-gold-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: loader.transitionMaxMs / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
