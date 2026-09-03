"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import type { Division } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   DIVISION SHOWCASE

   An accordion of the four operating divisions. On desktop the panels expand
   horizontally on hover or focus; below `lg` they stack into full cards, because
   a horizontal accordion on a phone is a hostile pattern.
   ========================================================================= */

export function DivisionShowcase({ divisions }: { divisions: Division[] }) {
  const [active, setActive] = useState(0);
  if (!divisions.length) return null;

  return (
    <>
      {/* --- Desktop: horizontal accordion --------------------------------- */}
      <div className="hidden gap-px bg-steel-600/12 lg:flex lg:h-[34rem]">
        {divisions.map((division, i) => {
          const open = i === active;
          return (
            <Link
              key={division.key}
              href={division.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group relative isolate overflow-hidden bg-ink-950 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                open ? "grow-[3.4]" : "grow-[1]",
              )}
              style={{ flexBasis: 0 }}
            >
              <Media
                media={division.image}
                alt=""
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 size-full"
                imageClassName={cn(
                  "object-cover transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  open ? "scale-100 grayscale-0" : "scale-110 grayscale",
                )}
                ratio="auto"
              />
              <div
                className={cn(
                  "absolute inset-0 transition-colors duration-700",
                  open
                    ? "bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/10"
                    : "bg-ink-950/78",
                )}
              />

              {/* Index rail, always visible. */}
              <span className="absolute left-6 top-6 z-10 eyebrow text-gold-500 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                <h3
                  className={cn(
                    "origin-bottom-left text-[1.6rem] leading-tight text-paper-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    !open && "translate-y-1",
                  )}
                >
                  {division.name}
                </h3>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="mt-2 text-sm font-medium text-gold-400">{division.strapline}</p>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-steel-300">
                        {division.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-paper-50">
                        Explore the division
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left bg-gold-500 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  open ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* --- Mobile & tablet: stacked cards --------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {divisions.map((division, i) => (
          <Link
            key={division.key}
            href={division.href}
            className="group chamfer relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden border border-steel-600/18"
          >
            <Media
              media={division.image}
              alt=""
              sizes="(min-width: 640px) 50vw, 100vw"
              className="absolute inset-0 size-full"
              imageClassName="object-cover"
              ratio="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/72 to-ink-950/20" />
            <span className="absolute left-5 top-5 eyebrow text-gold-500 tabular">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative p-6">
              <h3 className="text-xl text-paper-50">{division.name}</h3>
              <p className="mt-1.5 text-sm font-medium text-gold-400">{division.strapline}</p>
              <p className="mt-3 text-sm leading-relaxed text-steel-300">{division.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
