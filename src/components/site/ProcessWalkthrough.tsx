"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { EquipmentIcon, type EquipmentKey } from "@/components/graphics/EquipmentIcon";
import { cn } from "@/lib/utils";

/* ============================================================================
   PROCESS WALKTHROUGH

   The mining sequence, read left to right as a bench profile that steps down —
   the same terraced geometry as the logo, used at full width.

   The gold rail fills with scroll progress, so the reader can see how far
   through the sequence they are. Each stage sits one step lower than the last,
   which is what turns a row of cards into a cut face.
   ========================================================================= */

export interface WalkStage {
  id: string;
  label: string;
  title: string;
  body: string;
  icon: EquipmentKey;
}

export function ProcessWalkthrough({
  stages,
  className,
}: {
  stages: WalkStage[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  if (!stages.length) return null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Datum rail with the progress fill */}
      <div className="relative mb-px h-px w-full bg-steel-600/30" aria-hidden="true">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold-500"
          style={reduced ? { width: "100%" } : { width }}
        />
      </div>

      <ol className="grid gap-px bg-steel-600/25 md:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage, i) => (
          <motion.li
            key={stage.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col bg-ink-950/82 backdrop-blur-[2px] transition-colors duration-500 hover:bg-ink-900/90"
            /* Each stage sits one bench lower than the one before it. */
            style={{ paddingTop: `${1.75 + i * 0.9}rem` }}
          >
            {/* Step tick on the datum */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-2.5 w-px bg-gold-500/70"
            />

            <div className="flex flex-1 flex-col gap-4 px-6 pb-8">
              <div className="flex items-baseline justify-between gap-3">
                <span className="eyebrow text-gold-500 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="eyebrow text-[0.5625rem] text-steel-500">{stage.label}</span>
              </div>

              <EquipmentIcon
                name={stage.icon}
                className="size-12 text-steel-400 transition-colors duration-500 group-hover:text-gold-400"
              />

              <h3 className="text-base leading-snug font-bold text-paper-50">{stage.title}</h3>
              <p className="text-sm leading-relaxed text-steel-400">{stage.body}</p>
            </div>

            {/* Bench edge along the bottom of each stage */}
            <span
              aria-hidden="true"
              className="mt-auto block h-px w-full origin-left scale-x-0 bg-gold-500/50 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
