"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, Phone } from "lucide-react";
import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { LeikahMark } from "@/components/brand/Logo";
import { Blueprint } from "@/components/graphics/Blueprint";
import { SurveyGrid, DustField, GoldBloom, SurveyReadout } from "@/components/graphics/Atmosphere";
import { Highlighted } from "@/components/ui/Section";
import type { HeroContent, BusinessInfo } from "@/lib/cms/types";
import { getMedia } from "@/lib/cms/media";
import { telHref } from "@/lib/utils";

/* ============================================================================
   HOME HERO

   Rebuilt to answer one question in the first three seconds: whose site is
   this. The previous version was a photograph with a headline on it, which is
   every contractor site ever made.

   Four things carry the brand now:

   • The mark, set large beside the eyebrow rather than only in the header.
   • A blueprint excavator drawing itself across the right of the frame, so the
     first motion on the page is an engineering drawing being made.
   • Dust drifting up off the bench.
   • A survey readout on the frame — coordinates, datum, sheet reference — which
     is the detail that says "this company works to drawings".
   ========================================================================= */

const FRAME_MS = 7000;

export function HomeHero({
  hero,
  business,
}: {
  hero: HeroContent;
  business: BusinessInfo;
}) {
  const reduced = useReducedMotion();
  const frames = hero.media.filter((slug) => getMedia(slug).src);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || frames.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), FRAME_MS);
    return () => clearInterval(id);
  }, [reduced, frames.length]);

  const { address } = business;

  return (
    <section className="relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-ink-950 pb-12 pt-[calc(var(--header-h)+2.5rem)] lg:min-h-svh lg:pb-16">
      {/* --- Photography ---------------------------------------------------- */}
      <div className="absolute inset-0 -z-20">
        <AnimatePresence initial={false}>
          <motion.div
            key={frames[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: FRAME_MS / 1000 + 2.5, ease: "linear" },
            }}
          >
            <Media
              media={frames[index]}
              alt=""
              priority={index === 0}
              sizes="100vw"
              quality={78}
              className="size-full"
              imageClassName="object-cover"
              ratio="auto"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-ink-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent" />
      </div>

      {/* --- Brand atmosphere ------------------------------------------------ */}
      <div className="absolute inset-0 -z-10">
        <SurveyGrid opacity={0.7} />
        <GoldBloom className="-right-52 top-1/3" size="56rem" intensity={16} />
        <DustField density={54} />

        {/* The signature move: a general arrangement drawing across the frame */}
        <Blueprint
          machine="excavator"
          intensity={0.3}
          stroke="var(--color-gold-400)"
          className="absolute -right-16 bottom-[14%] hidden h-auto w-[46rem] lg:block xl:w-[54rem]"
        />
      </div>

      {/* --- Copy ------------------------------------------------------------ */}
      <div className="shell-wide relative">
        <div className="max-w-4xl">
          {/* Mark set beside the eyebrow — the brand is present before the text */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
          >
            <LeikahMark className="h-11 w-11 shrink-0 lg:h-14 lg:w-14" />
            <span className="flex flex-col gap-1">
              <span className="eyebrow text-gold-400">{hero.eyebrow}</span>
              <span className="h-px w-16 bg-gold-500/70" aria-hidden="true" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-display-1 text-paper-50"
          >
            <Highlighted text={hero.headline} highlight={hero.highlight} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-2xl text-base leading-relaxed text-steel-200 sm:text-lg"
          >
            {hero.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href={hero.primaryCta.href}
              className="chamfer-sm group/btn relative inline-flex h-14 items-center justify-center overflow-hidden bg-gold-500 px-8 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/35 opacity-0 blur-md group-hover/btn:animate-[leikah-sweep_0.9s_ease-out] group-hover/btn:opacity-100"
              />
              <span className="relative">{hero.primaryCta.label}</span>
            </Link>

            <a
              href={telHref(business.emergencyPhone)}
              className="chamfer-sm inline-flex h-14 items-center justify-center gap-3 border border-steel-100/25 bg-ink-900/50 px-7 font-medium text-paper-50 backdrop-blur-md transition-colors hover:border-gold-500/60"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full rounded-full bg-signal-green opacity-70 motion-safe:animate-[leikah-pulse-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex size-2.5 rounded-full bg-signal-green" />
              </span>
              <Phone className="size-4 text-gold-400" />
              <span className="tabular">{business.emergencyPhone}</span>
            </a>
          </motion.div>
        </div>

        {/* --- Assurances ---------------------------------------------------- */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid gap-px overflow-hidden border-y border-steel-100/14 bg-steel-100/14 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {hero.assurances.map((item, i) => (
            <li
              key={item}
              className="group flex items-center gap-3 bg-ink-950/60 px-5 py-4 backdrop-blur-md transition-colors hover:bg-ink-900/70"
            >
              <span className="eyebrow text-gold-500/80 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-steel-100">{item}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      {/* --- Frame furniture -------------------------------------------------- */}
      <div className="shell-wide relative mt-7 flex items-end justify-between gap-6">
        <a
          href="#introduction"
          className="group inline-flex items-center gap-3 text-xs text-steel-400 transition-colors hover:text-gold-400"
        >
          <span className="chamfer-sm inline-flex size-9 items-center justify-center border border-steel-600/40 transition-colors group-hover:border-gold-500/60">
            <ArrowDown className="size-4 motion-safe:animate-[leikah-drift_2.6s_ease-in-out_infinite]" />
          </span>
          <span className="eyebrow">Scroll</span>
        </a>

        <div className="flex items-center gap-6">
          {/* Survey readout — the site's technical voice, stated once up front */}
          <SurveyReadout
            className="hidden lg:flex"
            items={[
              `${Math.abs(address.lat).toFixed(4)}° S  ${address.lng.toFixed(4)}° E`,
              `${address.street.toUpperCase()}, ${address.city.toUpperCase()}`,
              `DATUM · ${address.province.toUpperCase()}`,
            ]}
          />

          {frames.length > 1 && (
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero image">
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
                        ? "w-10 bg-gold-500"
                        : "w-5 bg-steel-100/30 group-hover:bg-steel-100/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
