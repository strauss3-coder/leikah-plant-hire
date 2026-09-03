"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LeikahWordmark } from "@/components/brand/Logo";
import { SteelSheen } from "@/components/graphics/Atmosphere";
import { cn } from "@/lib/utils";

/* ============================================================================
   BRAND BAND

   The name, enormous, edge to edge, once per page. This is the section that
   answers "whose website is this" — and the reason it works is that the
   wordmark is the content here, not decoration behind something else.

   The letters rise on a short stagger as the band enters view, which reads as
   a nameplate being set rather than a headline animating.
   ========================================================================= */

export function BrandBand({
  statement,
  footnote,
  className,
}: {
  /** The positioning line that sits under the name. */
  statement: string;
  footnote?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // A slow drift across the band, so the name feels wider than the viewport.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section
      ref={ref}
      className={cn("relative isolate overflow-hidden border-y border-steel-600/25 bg-ink-900", className)}
      aria-label="Leikah Plant Hire"
    >
      <SteelSheen />

      <div className="relative py-14 lg:py-20">
        {/* The name, cropped hard at both edges */}
        <motion.div style={reduced ? undefined : { x }} className="flex justify-center px-2">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <LeikahWordmark tone="steel" className="h-auto w-full" />
          </motion.div>
        </motion.div>

        {/* Statement, hung off a rule directly under the name */}
        <div className="shell-wide mt-8 flex flex-col gap-4 border-t border-steel-600/30 pt-6 lg:mt-10 lg:flex-row lg:items-baseline lg:justify-between">
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-display text-lg leading-snug font-semibold text-paper-50 sm:text-xl lg:text-2xl"
          >
            {statement}
          </motion.p>

          {footnote && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="eyebrow shrink-0 text-gold-500"
            >
              {footnote}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
