"use client";

import { motion, useReducedMotion } from "motion/react";
import { LeikahMark, WORDMARK } from "./Logo";
import { cn } from "@/lib/utils";

/* ============================================================================
   BRAND REVEAL

   The hero's focal point: the mark, then the name, then the descriptor —
   arriving in that order, slowly.

   The letters are drawn from the same glyph data as the static wordmark and
   staggered individually, so the name assembles rather than fading in as a
   block. That is the difference between a logo animation and a div with an
   opacity transition.

   Under reduced motion everything is simply present.
   ========================================================================= */

const EASE = [0.16, 1, 0.3, 1] as const;

export function BrandReveal({
  descriptor = "PLANT HIRE",
  className,
}: {
  descriptor?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("flex flex-col items-center", className)} aria-hidden="true">
      {/* The mark, set on its own with room around it */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0.3 : 1.1, ease: EASE }}
      >
        <LeikahMark className="h-16 w-16 sm:h-20 sm:w-20 lg:h-[5.5rem] lg:w-[5.5rem]" />
      </motion.div>

      {/* The name, letter by letter */}
      {/* Sized by width so the name reads as the headline it is. Each glyph is
          offset by a wrapping <g> and animated on the <path> inside it —
          Motion writes the element's own `transform`, so putting the static
          offset on the same node would leave every letter stacked at x=0. */}
      <svg
        viewBox={`0 0 ${WORDMARK.width} 100`}
        className="mt-8 h-auto w-[min(76vw,20rem)] sm:mt-10 sm:w-[min(72vw,29rem)] lg:w-[34rem]"
        fill="none"
      >
        {WORDMARK.glyphs.map((glyph, i) => (
          <g key={i} transform={`translate(${glyph.x} 0)`}>
            <motion.path
              d={glyph.d}
              fill="#ffffff"
              fillRule={glyph.evenodd ? "evenodd" : "nonzero"}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.3 : 0.9,
                delay: reduced ? 0 : 0.34 + i * 0.055,
                ease: EASE,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Descriptor, tracked out under a hairline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.3 : 0.9, delay: reduced ? 0 : 0.78 }}
        className="mt-5 flex items-center gap-4 sm:mt-6 sm:gap-5"
      >
        <span className="h-px w-8 bg-gold-500/60 sm:w-12" />
        <span className="font-mono text-[0.6875rem] font-medium tracking-[0.42em] text-gold-400 sm:text-xs">
          {descriptor}
        </span>
        <span className="h-px w-8 bg-gold-500/60 sm:w-12" />
      </motion.div>
    </div>
  );
}
