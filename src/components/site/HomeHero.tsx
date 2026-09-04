"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { BrandReveal } from "@/components/brand/BrandReveal";
import { SurveyGrid, DustField, GoldBloom } from "@/components/graphics/Atmosphere";
import { assetPath } from "@/lib/cms/media";
import type { HeroContent } from "@/lib/cms/types";
import { getMedia } from "@/lib/cms/media";

/* ============================================================================
   HOME HERO

   One job: make the first five seconds feel calm, confident and unmistakably
   Leikah. Everything that explains the business has moved further down the page.

   What is deliberately NOT here:

   • No long headline. The name is the headline.
   • No call to action. An aggressive button in the first viewport competes with
     the brand; quotation prompts appear naturally further down.
   • No descriptive paragraph. It opens the section below instead.
   • No technical drawing overlay. It was fighting the photograph.

   The overlay is much lighter than a text-heavy hero can afford — a base
   darken, a bottom ramp for the footer row, and a soft radial behind the
   lockup purely so white type stays legible over a bright sky. The machinery
   is the visual hero.
   ========================================================================= */

const FRAME_MS = 8500;
const EASE = [0.16, 1, 0.3, 1] as const;

export function HomeHero({ hero }: { hero: HeroContent }) {
  const reduced = useReducedMotion();
  const frames = hero.media.filter((slug) => getMedia(slug).src);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || frames.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), FRAME_MS);
    return () => clearInterval(id);
  }, [reduced, frames.length]);

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink-950">
      {/* --- Photography ---------------------------------------------------- */}
      <div className="absolute inset-0 -z-20">
        <AnimatePresence initial={false}>
          <motion.div
            key={frames[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2.2, ease: "easeInOut" },
              scale: { duration: FRAME_MS / 1000 + 3, ease: "linear" },
            }}
          >
            <Media
              media={frames[index]}
              alt=""
              priority={index === 0}
              sizes="100vw"
              quality={82}
              className="size-full"
              imageClassName="object-cover"
              ratio="auto"
            />
          </motion.div>
        </AnimatePresence>

        {/* Light touch: enough to hold type, not enough to hide the machine. */}
        <div className="absolute inset-0 bg-ink-950/38" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 48% at 50% 44%, color-mix(in oklab, var(--color-ink-950) 55%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink-950 via-ink-950/62 to-transparent" />
      </div>

      {/* --- Atmosphere, dialled back --------------------------------------- */}
      <div className="absolute inset-0 -z-10">
        <SurveyGrid opacity={0.28} size={104} />
        <GoldBloom className="-right-64 top-1/4" size="52rem" intensity={10} />
        <DustField density={26} />
      </div>

      {/* --- The brand ------------------------------------------------------- */}
      <div className="relative flex flex-1 items-center justify-center px-6 pt-[calc(var(--header-h)+2rem)] pb-8">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <h1>
            <span className="sr-only">{hero.brandName}</span>
            <BrandReveal descriptor={hero.descriptor} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.3 : 1, delay: reduced ? 0 : 0.95, ease: EASE }}
            className="mt-8 max-w-xl text-balance text-base leading-relaxed text-steel-200 sm:mt-10 sm:text-lg"
          >
            {hero.tagline}
          </motion.p>
        </div>
      </div>

      {/* --- Footing: credentials, partner, scroll ---------------------------- */}
      <div className="relative pb-8 sm:pb-10">
        <div className="shell-wide flex flex-col items-center gap-7">
          {/* One row. Wraps to two on a phone rather than shrinking to nothing. */}
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.3 : 1, delay: reduced ? 0 : 1.12, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6"
          >
            {hero.trustIndicators.map((item, i) => (
              <li key={item} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && (
                  <span aria-hidden="true" className="size-1 rotate-45 bg-gold-500/70" />
                )}
                <span className="font-mono text-[0.625rem] font-medium tracking-[0.2em] text-steel-200 uppercase sm:text-[0.6875rem]">
                  {item}
                </span>
              </li>
            ))}
          </motion.ul>

          {hero.partner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0.3 : 1.2, delay: reduced ? 0 : 1.35 }}
              className="flex flex-col items-center gap-3 border-t border-steel-100/12 pt-6"
            >
              <span className="font-mono text-[0.5625rem] tracking-[0.28em] text-steel-500 uppercase">
                {hero.partner.label}
              </span>
              <Image
                src={assetPath(hero.partner.logo)}
                alt={hero.partner.name}
                width={220}
                height={110}
                className="h-auto w-[6.5rem] opacity-45 transition-opacity duration-500 hover:opacity-70 sm:w-[7.5rem]"
              />
            </motion.div>
          )}
        </div>

        <motion.a
          href="#introduction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: reduced ? 0 : 1.6 }}
          className="group absolute bottom-9 left-[var(--spacing-gutter)] hidden items-center gap-3 text-xs text-steel-400 transition-colors hover:text-gold-400 lg:flex"
        >
          <span className="inline-flex size-9 items-center justify-center border border-steel-600/40 transition-colors group-hover:border-gold-500/60 chamfer-sm">
            <ArrowDown className="size-4 motion-safe:animate-[leikah-drift_2.8s_ease-in-out_infinite]" />
          </span>
          <span className="font-mono text-[0.625rem] tracking-[0.22em] uppercase">Scroll</span>
        </motion.a>

        {frames.length > 1 && (
          <div
            className="absolute bottom-11 right-[var(--spacing-gutter)] hidden items-center gap-2 lg:flex"
            role="tablist"
            aria-label="Hero image"
          >
            {frames.map((slug, i) => (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show image ${i + 1} of ${frames.length}`}
                onClick={() => setIndex(i)}
                className="group py-2"
              >
                <span
                  className={`block h-0.5 transition-all duration-500 ${
                    i === index
                      ? "w-9 bg-gold-500"
                      : "w-4 bg-steel-100/30 group-hover:bg-steel-100/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
