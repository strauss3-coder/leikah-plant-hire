"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import type { ProcessStep, ProjectMilestone } from "@/lib/cms/types";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================================
   TIMELINE

   A vertical rail whose gold fill tracks scroll progress through the list, so
   the reader can see how far into a method or a programme they are. The rail is
   decorative; the ordered list beneath it carries the actual semantics.
   ========================================================================= */

function Rail({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 65%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <div
      aria-hidden="true"
      className="absolute left-[1.4375rem] top-2 bottom-2 w-px bg-steel-600/20 sm:left-[1.6875rem]"
    >
      <motion.div
        className="h-full w-full origin-top bg-gold-500"
        style={reduced ? { scaleY: 1 } : { scaleY }}
      />
    </div>
  );
}

export function ProcessTimeline({
  steps,
  tone = "dark",
  className,
}: {
  steps: ProcessStep[];
  tone?: "dark" | "light";
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const dark = tone === "dark";
  if (!steps.length) return null;

  return (
    <div className={cn("relative", className)}>
      <Rail targetRef={ref} />
      <ol ref={ref} className="relative flex flex-col gap-8">
        {steps.map((step) => (
          <motion.li
            key={step.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-5 sm:gap-7"
          >
            <span
              className={cn(
                "chamfer-sm relative z-10 mt-0.5 flex size-12 shrink-0 items-center justify-center border font-mono text-sm font-semibold sm:size-14",
                dark
                  ? "border-steel-600/25 bg-ink-900 text-gold-400"
                  : "border-ink-900/12 bg-paper-50 text-gold-700",
              )}
            >
              {String(step.step).padStart(2, "0")}
            </span>

            <div className="flex flex-col gap-2 pt-1.5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3
                  className={cn(
                    "text-base font-bold sm:text-lg",
                    dark ? "text-paper-50" : "text-ink-950",
                  )}
                >
                  {step.title}
                </h3>
                {step.duration && (
                  <span className={cn("eyebrow", dark ? "text-steel-500" : "text-ink-500")}>
                    {step.duration}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "max-w-2xl text-sm leading-relaxed",
                  dark ? "text-steel-400" : "text-ink-500",
                )}
              >
                {step.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function MilestoneTimeline({
  milestones,
  className,
}: {
  milestones: ProjectMilestone[];
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  if (!milestones.length) return null;

  return (
    <div className={cn("relative", className)}>
      <Rail targetRef={ref} />
      <ol ref={ref} className="relative flex flex-col gap-8">
        {milestones.map((milestone) => (
          <motion.li
            key={milestone.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-5 sm:gap-7"
          >
            <span className="relative z-10 mt-1.5 flex size-12 shrink-0 items-center justify-center sm:size-14">
              <span className="chamfer-sm flex size-4 items-center justify-center bg-gold-500" />
            </span>

            <div className="flex flex-col gap-2">
              <time
                dateTime={milestone.date}
                className="eyebrow text-gold-400 tabular"
              >
                {formatDate(milestone.date)}
              </time>
              <h3 className="text-base font-bold text-paper-50 sm:text-lg">{milestone.title}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-steel-400">
                {milestone.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
