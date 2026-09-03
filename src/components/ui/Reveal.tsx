"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/* ============================================================================
   SECTION REVEAL

   One reveal primitive for the whole site, so the entrance easing and distance
   are consistent everywhere instead of being re-invented per section. Motion is
   suppressed under `prefers-reduced-motion` — content still renders, it simply
   arrives without travel.

   Two things here are load-bearing:

   • Every variant renders a plain `motion.div`. An earlier version took an `as`
     prop and built the motion component with `motion.create()` during render,
     which produces a new component identity on every render and remounts the
     whole subtree. Nothing on the site ever passed `as`, so the indirection was
     pure cost.

   • Nothing branches on `useReducedMotion()` structurally. It resolves to null
     on the server and to the real preference after hydration, so returning a
     different tree shape would guarantee a hydration mismatch. The animation
     values go flat instead.
   ========================================================================= */

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * All travel is vertical, including the directions named "left" and "right".
 *
 * A horizontal offset on an element that has not entered the viewport yet sits
 * outside the layout until it animates, which widens
 * `documentElement.scrollWidth` and gives narrow screens a horizontal
 * scrollbar. `overflow-x: clip` hides the symptom in modern browsers but not in
 * older Safari, and a page that drags sideways on a phone is the kind of defect
 * a client notices immediately.
 *
 * The named directions are kept because they read well at the call site and
 * give paired columns a different travel distance, so a two-column section
 * still arrives in two beats rather than one.
 */
const OFFSET: Record<Direction, number> = {
  up: 28,
  down: -28,
  left: 40,
  right: 40,
  none: 0,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  once = true,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const y = reduced ? 0 : OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------------------
   Staggered group — children animate in sequence rather than as a block.
   -------------------------------------------------------------------------- */

export function RevealGroup({
  children,
  className,
  amount = 0.15,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 24 },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.65, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
