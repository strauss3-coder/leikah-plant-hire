"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { EquipmentIcon, type EquipmentKey } from "@/components/graphics/EquipmentIcon";
import { SurveyGrid, DustField, CornerMarks } from "@/components/graphics/Atmosphere";
import type { FleetItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   FLEET SHOWCASE

   The signature section. A machine selector down the left, a full-bleed plate
   of the actual machine on the right, and a spec block underneath — the layout
   of an equipment data sheet rather than a card grid.

   Two things make it feel like the client's own fleet rather than stock:
   the photography is theirs, and the specifications are the figures a planner
   asks for on a first call.
   ========================================================================= */

export function FleetShowcase({ fleet }: { fleet: FleetItem[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = fleet[active];

  if (!fleet.length) return null;

  return (
    <div className="relative">
      <div className="grid gap-px bg-steel-600/25 lg:grid-cols-[19rem_1fr]">
        {/* --- Selector ------------------------------------------------------ */}
        <div
          className="flex gap-px overflow-x-auto bg-steel-600/25 lg:flex-col lg:overflow-visible"
          role="tablist"
          aria-label="Fleet"
        >
          {fleet.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex min-w-[15rem] flex-1 items-center gap-4 px-5 py-5 text-left transition-colors duration-400 lg:min-w-0 lg:flex-none",
                  on ? "bg-ink-850" : "bg-ink-950 hover:bg-ink-900",
                )}
              >
                {/* Active rail — reads as a selected channel on a control panel */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5 origin-top bg-gold-500 transition-transform duration-400",
                    on ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <EquipmentIcon
                  name={item.icon as EquipmentKey}
                  className={cn(
                    "size-10 shrink-0 transition-colors duration-400",
                    on ? "text-gold-400" : "text-steel-500 group-hover:text-steel-300",
                  )}
                />
                <span className="min-w-0">
                  <span className="eyebrow block text-[0.5625rem] text-steel-500">
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-sm leading-tight font-semibold transition-colors",
                      on ? "text-paper-50" : "text-steel-300",
                    )}
                  >
                    {item.name}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Closes the rail so the column does not end in a bare gap */}
          <div className="hidden flex-1 flex-col justify-end bg-ink-950 p-5 lg:flex">
            <span className="eyebrow text-[0.5625rem] text-steel-600">
              {fleet.length} classes on hire
            </span>
            <span className="mt-1.5 block h-px w-full bg-steel-600/40" aria-hidden="true" />
          </div>
        </div>

        {/* --- Plate --------------------------------------------------------- */}
        <div className="relative isolate min-h-[32rem] overflow-hidden bg-ink-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Media
                media={current.image}
                alt=""
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="size-full"
                imageClassName="object-cover"
                ratio="auto"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/72 to-ink-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 to-transparent" />
          <SurveyGrid opacity={0.5} size={64} />
          <DustField density={26} />

          {/* Machine designation, set as a plate stamp */}
          <div className="absolute right-5 top-5 z-10 hidden text-right sm:block">
            <span className="eyebrow block text-[0.5625rem] text-gold-500/80">
              Plate {String(active + 1).padStart(2, "0")} / {String(fleet.length).padStart(2, "0")}
            </span>
            <span className="mt-1 block font-mono text-[0.625rem] text-steel-500">
              {current.slug.toUpperCase()}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.id}-copy`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full flex-col justify-end p-7 sm:p-10"
            >
              <h3 className="text-display-3 text-paper-50">{current.name}</h3>
              <p className="mt-3 max-w-lg text-sm font-medium text-gold-400 sm:text-base">
                {current.strapline}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-steel-300">
                {current.description}
              </p>

              {/* Applications, as a compact tag row */}
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {current.applications.slice(0, 4).map((a) => (
                  <li key={a} className="flex items-center gap-2 text-xs text-steel-400">
                    <span aria-hidden="true" className="size-1 rotate-45 bg-gold-500" />
                    {a}
                  </li>
                ))}
              </ul>

              {current.serviceSlug && (
                <Link
                  href={`/services/${current.serviceSlug}`}
                  className="group/link mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-paper-50"
                >
                  <span className="relative">
                    See how we run it
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:w-full" />
                  </span>
                  <ArrowUpRight className="size-4 text-gold-400 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Specification strip ----------------------------------------------
          The registration marks sit outside the <dl>: a description list may
          only contain dt/dd groups and their wrappers, so decorative children
          have to live on the container instead. */}
      <div className="relative border-t border-steel-600/25">
        <CornerMarks />
        <dl className="grid gap-px bg-steel-600/25 sm:grid-cols-2 lg:grid-cols-4">
          {current.specs.map((spec, i) => (
            <motion.div
              key={`${current.id}-${spec.label}`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ink-900 px-6 py-5"
            >
              <dt className="eyebrow text-[0.5625rem] text-steel-500">{spec.label}</dt>
              <dd className="mt-2 font-display text-base font-bold text-paper-50 sm:text-lg">
                {spec.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </div>
  );
}
