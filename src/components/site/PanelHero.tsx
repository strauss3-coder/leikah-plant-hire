"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { BrandReveal } from "@/components/brand/BrandReveal";
import { SurveyGrid, GoldBloom } from "@/components/graphics/Atmosphere";
import { assetPath } from "@/lib/cms/media";
import type { CSSProperties } from "react";
import type { HeroContent, HeroPanel } from "@/lib/cms/types";

/* ============================================================================
   PANEL HERO

   Three photographs from the pit, composed rather than rotated: the coal in
   the hand, the bench it came from, the machine that took it out. The brand
   keeps its own dark field on the left so the photography never has to be
   darkened to carry type.

   Desktop: lockup left, a full-height collage right, the lead panel twice
   the width of the two stacked beside it.
   Phone: the lead photograph behind the lockup, the other two as a pair of
   tiles under the tagline.
   ========================================================================= */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The photographs lead and the brand follows. The panels open from the first
 * frame; the lockup starts as the third shutter is still opening, so the
 * sequence reads as one movement rather than two.
 */
const PANEL_STAGGER = 0.18;
const TEXT_DELAY = 1.0;

/** The number and label pinned to the foot of a panel. */
function PanelLabel({ index, label }: { index: number; label: string }) {
  return (
    <span className="absolute bottom-3 left-3 flex items-center gap-2 font-mono sm:bottom-5 sm:left-5 sm:gap-3 text-[0.625rem] tracking-[0.24em] uppercase">
      <span className="text-gold-400">{String(index + 1).padStart(2, "0")}</span>
      <span className="hidden h-px w-5 bg-gold-500/60 sm:block" />
      <span className="text-steel-100">{label}</span>
    </span>
  );
}

/**
 * One collage panel. It opens like a shutter, bottom to top, and the
 * photograph inside settles from a slight push-in, so the three arrive in
 * sequence rather than as one block.
 */
function Panel({
  panel,
  index,
  className,
  sizes,
  reduced,
}: {
  panel: HeroPanel;
  index: number;
  className?: string;
  sizes: string;
  reduced: boolean | null;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-ink-900 ${className ?? ""}`}
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: reduced ? 0.3 : 1.25, delay: reduced ? 0 : index * PANEL_STAGGER, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduced ? 1 : 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7, delay: index * PANEL_STAGGER, ease: EASE }}
        style={{ "--focus": panel.focus ?? "50% 50%" } as CSSProperties}
      >
        <Media
          media={panel.media}
          alt=""
          priority={index === 0}
          sizes={sizes}
          className="size-full"
          imageClassName="object-cover object-[var(--focus)]"
          ratio="auto"
        />
      </motion.div>
      {/* Only enough at the foot to hold the label. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/80 to-transparent" />
      <PanelLabel index={index} label={panel.label} />
    </motion.div>
  );
}

export function PanelHero({ hero }: { hero: HeroContent }) {
  const reduced = useReducedMotion();
  const [lead, ...rest] = hero.panels ?? [];
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.3 : 1, delay: reduced ? 0 : TEXT_DELAY + delay, ease: EASE },
  });

  return (
    <section className="relative isolate flex min-h-svh overflow-hidden bg-ink-950">
      {/* --- Desktop: the collage -------------------------------------------- */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] grid-cols-[1.45fr_1fr] grid-rows-2 gap-1.5 lg:grid">
        <Panel panel={lead} index={0} className="row-span-2" sizes="34vw" reduced={reduced} />
        {rest.map((panel, i) => (
          <Panel key={panel.media} panel={panel} index={i + 1} sizes="24vw" reduced={reduced} />
        ))}
        {/* The seam between the dark field and the photography, softened so
            the collage reads as part of the section rather than pasted on. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-ink-950/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink-950/70 to-transparent" />
      </div>

      {/* --- Atmosphere, confined to the dark field --------------------------- */}
      <div className="absolute inset-y-0 left-0 -z-10 w-full lg:w-[42%]">
        <SurveyGrid opacity={0.22} size={96} />
        <GoldBloom className="-left-40 top-1/3" size="40rem" intensity={8} />
      </div>

      {/* --- The brand and the footing --------------------------------------- */}
      <div className="relative flex w-full flex-col lg:w-[42%]">
        <div className="flex flex-1 flex-col items-center px-6 pt-[calc(var(--header-h)+1rem)] pb-6 text-center lg:justify-center lg:pt-[calc(var(--header-h)+1.5rem)]">
          {/* BrandReveal sizes the name for a full-width hero. Here it shares
              the viewport with the collage, so it follows the column. */}
          <h1 className="lg:[&>div>svg]:w-[min(30rem,31vw)]">
            <span className="sr-only">{hero.brandName}</span>
            <BrandReveal descriptor={hero.descriptor} delay={TEXT_DELAY} />
          </h1>

          <motion.p
            {...fade(0.95)}
            className="mt-7 max-w-md text-balance text-base leading-relaxed text-steel-200 sm:mt-9 sm:text-lg"
          >
            {hero.tagline}
          </motion.p>

          {/* Phone: the same collage in miniature, under the lockup rather
              than beside it. As a full-bleed backdrop the lead photograph had
              to be cropped so hard that the coal read as a dark smear and the
              hand was lost behind the type. */}
          <div className="mt-8 grid h-[min(64vw,19rem)] w-full max-w-md grid-cols-[1.35fr_1fr] grid-rows-2 gap-1.5 lg:hidden">
            <Panel panel={lead} index={0} className="row-span-2" sizes="55vw" reduced={reduced} />
            {rest.map((panel, i) => (
              <Panel key={panel.media} panel={panel} index={i + 1} sizes="40vw" reduced={reduced} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 px-6 pb-8 sm:pb-10">
          <motion.ul
            {...fade(1.12)}
            className="flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5"
          >
            {hero.trustIndicators.map((item, i) => (
              <li key={item} className="flex items-center gap-4 sm:gap-5">
                {i > 0 && <span aria-hidden="true" className="size-1 rotate-45 bg-gold-500/70" />}
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
              transition={{ duration: reduced ? 0.3 : 1.2, delay: reduced ? 0 : TEXT_DELAY + 1.35 }}
              className="flex flex-col items-center gap-3 border-t border-steel-100/12 pt-5"
            >
              <span className="font-mono text-[0.5625rem] tracking-[0.28em] text-steel-500 uppercase">
                {hero.partner.label}
              </span>
              <Image
                src={assetPath(hero.partner.logo)}
                alt={hero.partner.name}
                width={220}
                height={110}
                className="h-auto w-[6.5rem] opacity-45 transition-opacity duration-500 hover:opacity-70 sm:w-[7rem]"
              />
            </motion.div>
          )}
        </div>

        <motion.a
          href="#introduction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: reduced ? 0 : TEXT_DELAY + 1.6 }}
          className="group absolute bottom-9 left-[var(--spacing-gutter)] hidden items-center gap-3 text-xs text-steel-400 transition-colors hover:text-gold-400 xl:flex"
        >
          <span className="inline-flex size-9 items-center justify-center border border-steel-600/40 transition-colors group-hover:border-gold-500/60 chamfer-sm">
            <ArrowDown className="size-4 motion-safe:animate-[leikah-drift_2.8s_ease-in-out_infinite]" />
          </span>
          <span className="font-mono text-[0.625rem] tracking-[0.22em] uppercase">Scroll</span>
        </motion.a>
      </div>
    </section>
  );
}
