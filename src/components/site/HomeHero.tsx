"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { BrandReveal } from "@/components/brand/BrandReveal";
import { SurveyGrid, DustField, GoldBloom } from "@/components/graphics/Atmosphere";
import { assetPath } from "@/lib/cms/media";
import type { HeroContent, HeroFrame } from "@/lib/cms/types";
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

/** A stable key per frame, since two frames could point at the same asset. */
const frameKey = (frame: HeroFrame, i: number) =>
  `${i}-${frame.kind === "image" ? frame.media : frame.src}`;

/**
 * True where the viewport is taller than it is wide, which is every phone held
 * upright. Read through `useSyncExternalStore` rather than an effect so the
 * first render already has the answer and the wrong cut is never mounted.
 * Server and first client render agree on `false`, the landscape cut.
 */
const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * A media query read that survives hydration.
 *
 * `useSyncExternalStore` uses the server snapshot for the first client render
 * as well as for the server one, so the two always agree and React re-renders
 * with the real value immediately afterwards. Reading the query in an effect,
 * or through a hook that returns the live value on the first client render,
 * makes the markup disagree with the server and throws a hydration error the
 * moment the query decides which element to render at all.
 */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Resolves the frames to play.
 *
 * Reduced motion drops the footage rather than freezing it on a poster: a
 * paused video is a worse still than a photograph chosen to be one. If that
 * leaves nothing at all, which it does whenever the hero is a single clip, the
 * photography in `media` stands in.
 */
function resolveFrames(hero: HeroContent, reduced: boolean): HeroFrame[] {
  const stills: HeroFrame[] = hero.media
    .filter((media) => getMedia(media).src)
    .map((media) => ({ kind: "image", media }) as const);

  if (!hero.frames?.length) return stills;

  const playable = hero.frames.filter((frame) =>
    frame.kind === "image" ? Boolean(getMedia(frame.media).src) : !reduced,
  );

  return playable.length ? playable : stills;
}

export function HomeHero({ hero }: { hero: HeroContent }) {
  const reduced = useReducedMotion();
  const portrait = useMediaQuery(PORTRAIT_QUERY);
  /* Separate from `reduced` above: that one only tunes animation values, which
     can differ between server and client harmlessly. This one decides whether
     a <video> or an <img> is rendered at all, so it has to hydrate cleanly. */
  const prefersReduced = useMediaQuery(REDUCED_QUERY);
  const frames = resolveFrames(hero, prefersReduced);
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
            key={frameKey(frames[index], index)}
            className="absolute inset-0"
            /* The slow push-in is what gives a still frame life. Footage has
               its own movement, and the extra scale only crops it further, so
               a clip is held at its true size. */
            initial={{ opacity: 0, scale: frames[index].kind === "video" ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2.2, ease: "easeInOut" },
              scale: { duration: FRAME_MS / 1000 + 3, ease: "linear" },
            }}
          >
            {frames[index].kind === "image" ? (
              <Media
                media={frames[index].media}
                alt=""
                priority={index === 0}
                sizes="100vw"
                quality={82}
                className="size-full"
                imageClassName="object-cover"
                ratio="auto"
              />
            ) : (
              /* Only the active frame is mounted, so in a rotation a clip is
                 not fetched until its turn. A portrait viewport gets the
                 portrait cut: covering a phone screen with the landscape one
                 would show a narrow strip through the middle and lose the
                 crew standing at the face.

                 Nothing is preloaded: `autoPlay` already makes the browser
                 fetch the clip, and an eager hint measured no faster to the
                 first playing frame, about 1.1s either way on 4G with the CPU
                 at a quarter speed.

                 The poster is the largest contentful paint, not the clip. A
                 hero built on footage therefore lands a little later than one
                 built on a photograph, because the poster is a plain file
                 rather than something next/image can preload. Still well
                 inside the threshold, and the cost of the client asking for
                 the pit in motion. */
              <video
                key={portrait ? frames[index].srcNarrow : frames[index].src}
                className="size-full object-cover"
                src={assetPath(
                  (portrait && frames[index].srcNarrow) || frames[index].src,
                )}
                poster={assetPath(
                  (portrait && frames[index].posterNarrow) || frames[index].poster,
                )}
                aria-hidden="true"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
              />
            )}
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
            {frames.map((frame, i) => (
              <button
                key={frameKey(frame, i)}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${frame.kind === "video" ? "clip" : "image"} ${i + 1} of ${frames.length}`}
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
