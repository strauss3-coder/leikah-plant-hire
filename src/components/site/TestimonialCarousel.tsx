"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote, Star, PlayCircle } from "lucide-react";
import { Media } from "@/components/ui/Media";
import type { Testimonial } from "@/lib/cms/types";
import { hasMedia } from "@/lib/cms/media";
import { cn } from "@/lib/utils";

/* ============================================================================
   TESTIMONIALS

   Renders nothing at all when there are none. A carousel showing a single
   invented quote does more damage to a tender bid than an absent section, so
   the empty state is deliberate and the module waits for real feedback.
   ========================================================================= */

const ROTATE_MS = 8000;

export function TestimonialCarousel({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced, paused, count, go]);

  if (!count) return null;
  const active = testimonials[index];

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="chamfer relative overflow-hidden border border-steel-600/18 bg-ink-850 brushed">
        <Quote
          aria-hidden="true"
          className="absolute -right-4 -top-4 size-40 text-gold-500/6"
          strokeWidth={1}
        />

        <div className="relative min-h-[22rem] p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-7"
            >
              <div className="flex items-center gap-1" aria-label={`${active.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < active.rating ? "fill-gold-400 text-gold-400" : "text-steel-500/40",
                    )}
                  />
                ))}
              </div>

              <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug font-semibold text-paper-50">
                “{active.quote}”
              </p>

              <footer className="mt-auto flex flex-wrap items-center gap-4">
                {hasMedia(active.image) && (
                  <Media
                    media={active.image!}
                    alt=""
                    ratio="1 / 1"
                    sizes="56px"
                    className="size-14 shrink-0 rounded-full"
                    imageClassName="object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <cite className="text-sm font-semibold not-italic text-paper-50">
                    {active.author}
                  </cite>
                  <span className="text-xs text-steel-400">
                    {active.position}
                    {active.company && ` · ${active.company}`}
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {active.videoUrl && (
                    <a
                      href={active.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      <PlayCircle className="size-4" />
                      Watch
                    </a>
                  )}
                  {active.projectSlug && (
                    <Link
                      href={`/projects/${active.projectSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
                    >
                      View the project
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-steel-600/15 px-8 py-4 sm:px-12">
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      "block h-0.5 transition-all duration-500",
                      i === index ? "w-8 bg-gold-500" : "w-4 bg-steel-600/40 group-hover:bg-steel-400",
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <CarouselButton label="Previous testimonial" onClick={() => go(-1)}>
                <ArrowLeft className="size-4" />
              </CarouselButton>
              <CarouselButton label="Next testimonial" onClick={() => go(1)}>
                <ArrowRight className="size-4" />
              </CarouselButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="chamfer-sm inline-flex size-10 items-center justify-center border border-steel-600/25 text-steel-300 transition-colors hover:border-gold-500/50 hover:text-gold-400"
    >
      {children}
    </button>
  );
}
