"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/* ============================================================================
   PAGE TRANSITION

   A short lift-and-fade keyed on the pathname. Deliberately restrained: exit
   animations on a router transition delay the next page's paint, so this only
   animates in.

   The wrapper element is rendered unconditionally. `useReducedMotion` resolves
   to null on the server and to the real preference after hydration, so
   returning a different tree shape for reduced motion would swap a <div> for a
   fragment between the two passes — a guaranteed hydration mismatch. Instead
   the element stays put and the animation values go flat.
   ========================================================================= */

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
