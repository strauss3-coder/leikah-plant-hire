"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Phone } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { Counter } from "@/components/ui/Counter";
import { ButtonLink } from "@/components/ui/Button";
import { LeikahMark } from "@/components/brand/Logo";
import { DustField, SurveyGrid } from "@/components/graphics/Atmosphere";
import { EquipmentIcon, resolveIcon } from "@/components/graphics/EquipmentIcon";
import { assetPath } from "@/lib/cms/media";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";
import type { CinematicHeroContent, HeroCard, HeroContent, HeroFigure } from "@/lib/cms/types";

/* ============================================================================
   CINEMATIC HERO

   Act one fills the browser: the pit in motion, a headline set large enough
   to read as architecture, three actions and the breakdown line. Act two
   follows on scroll: three cards for the three halves of the business and a
   row of counted figures.

   Nothing appears at once. The loop fades up out of black while it settles
   from a slight push-in, the logo resolves out of a blur, each headline line
   rises out of its own mask, and the rest follows in order. Under reduced
   motion the loop is replaced by its poster and everything is simply there.

   Depth comes from layers that move at different rates: the footage, the
   light, the dust and the type each answer the pointer and the scroll by a
   different amount.
   ========================================================================= */

const EASE = [0.16, 1, 0.3, 1] as const;
const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** False on the server and the first client render, true once hydrated. */
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

/* --- Atmosphere --------------------------------------------------------- */

const RAYS = [
  { left: "52%", width: "18rem", rotate: 20, opacity: 0.5, duration: 12 },
  { left: "66%", width: "9rem", rotate: 24, opacity: 0.36, duration: 15 },
  { left: "40%", width: "6rem", rotate: 15, opacity: 0.26, duration: 10 },
];

/** Soft shafts of light falling across the frame, drifting very slowly. */
function LightRays({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: reduced ? 0 : 0.6, ease: "easeOut" }}
    >
      {RAYS.map((ray) => (
        <motion.span
          key={ray.left}
          className="absolute -top-1/4 h-[150%] origin-top [mask-image:linear-gradient(to_right,transparent,black_45%,black_55%,transparent)]"
          style={{
            left: ray.left,
            width: ray.width,
            rotate: ray.rotate,
            background:
              "linear-gradient(to bottom, rgba(255,215,114,0.24), rgba(237,169,27,0.07) 45%, transparent 78%)",
          }}
          animate={
            reduced
              ? { opacity: ray.opacity * 0.7 }
              : { opacity: [ray.opacity, ray.opacity * 0.45], x: [0, 28] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: ray.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        />
      ))}
    </motion.div>
  );
}

/**
 * Faint drawing lines: a datum with survey ticks, a vertical reference and a
 * reticle. They draw themselves in once, then hold.
 */
function Blueprint({ reduced }: { reduced: boolean | null }) {
  const draw = (delay: number) => ({
    initial: { pathLength: reduced ? 1 : 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: reduced ? 0.3 : 2.4, delay: reduced ? 0 : delay, ease: EASE },
  });
  const ticks = Array.from({ length: 31 }, (_, i) => {
    const x = i * 48;
    return `M${x} 740 V${i % 5 === 0 ? 752 : 746}`;
  }).join(" ");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full text-gold-400/25"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <motion.path d="M0 740 H1440" {...draw(0.5)} />
      <motion.path d={ticks} {...draw(0.8)} />
      <motion.path d="M1092 96 V860" strokeDasharray="2 7" {...draw(0.7)} />
      <motion.circle cx={1092} cy={380} r={58} {...draw(1)} />
      <motion.path d="M1092 300 V460 M1012 380 H1172" {...draw(1.2)} />
      <motion.path d="M0 168 H300 M1300 168 H1440" strokeDasharray="1 6" {...draw(0.9)} />
    </svg>
  );
}

/* --- Pieces ------------------------------------------------------------- */

/** An action with a soft gold glow that rises behind it on hover and focus. */
function GlowAction({
  action,
  delay,
  reduced,
}: {
  action: CinematicHeroContent["actions"][number];
  delay: number;
  reduced: boolean | null;
}) {
  const glow =
    action.variant === "primary"
      ? "group-hover/glow:bg-gold-500/45 group-focus-within/glow:bg-gold-500/45"
      : "group-hover/glow:bg-gold-500/18 group-focus-within/glow:bg-gold-500/18";

  return (
    <motion.div
      className="group/glow relative"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.3 : 1, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {/* The button is clipped to its chamfer, which would clip a shadow too,
          so the glow is a blurred plate behind it instead. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-2 bg-gold-500/0 blur-xl transition-colors duration-500",
          glow,
        )}
      />
      <ButtonLink
        href={action.href}
        variant={action.variant}
        size="lg"
        withArrow={action.variant === "primary"}
        className="relative h-14 px-7 text-[0.9375rem] sm:h-16 sm:px-9 sm:text-base"
      >
        {action.icon === "phone" && <Phone className="size-4" />}
        {action.label}
      </ButtonLink>
    </motion.div>
  );
}

function FigureValue({ figure }: { figure: HeroFigure }) {
  if (figure.value === undefined) return <>{figure.text}</>;
  return <Counter value={figure.value} suffix={figure.suffix} />;
}

function Card({ card, index }: { card: HeroCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, delay: index * 0.14, ease: EASE }}
      className={cn(index === 1 && "lg:mt-20", index === 2 && "lg:mt-10")}
    >
      <Link
        href={card.href}
        className="group relative block overflow-hidden border border-steel-600/25 bg-ink-900 transition-[translate,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-gold-500/45 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_60px_-24px_rgba(237,169,27,0.4)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Media
            media={card.media}
            alt=""
            sizes="(min-width: 1024px) 31vw, 92vw"
            className="size-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
            imageClassName="object-cover"
            ratio="auto"
          />
          <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink-950/60 to-transparent" />

          <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
            <span className="font-mono text-[0.625rem] tracking-[0.28em] text-steel-200">
              <span className="text-gold-400">{String(index + 1).padStart(2, "0")}</span> / 03
            </span>
            <span className="grid size-11 place-items-center border border-gold-500/35 bg-ink-950/45 text-gold-400 backdrop-blur-md transition-colors duration-500 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
              <EquipmentIcon name={resolveIcon(card.icon)} className="size-6" />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <h3 className="font-display text-[clamp(1.9rem,2.5vw,2.6rem)] leading-[0.92] font-black tracking-tight text-paper-50 uppercase">
              {card.title}
            </h3>
            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-steel-300">{card.body}</p>

            <div className="mt-6 flex items-end justify-between gap-4 border-t border-steel-100/12 pt-5">
              <div className="flex flex-col gap-1.5">
                <span className="font-display text-[2.6rem] leading-none font-black tracking-tight text-gold-gradient">
                  <FigureValue figure={card.figure} />
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.22em] text-steel-300 uppercase">
                  {card.figure.label}
                  {card.note && <span className="text-steel-500"> · {card.note}</span>}
                </span>
              </div>
              <span className="grid size-11 shrink-0 place-items-center border border-steel-100/15 text-steel-200 transition-[rotate,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-gold-500/60 group-hover:text-gold-400">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* --- The hero ----------------------------------------------------------- */

export function CinematicHero({ hero, content }: { hero: HeroContent; content: CinematicHeroContent }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const portrait = useMediaQuery(PORTRAIT_QUERY);
  const prefersReduced = useMediaQuery(REDUCED_QUERY);
  const [playing, setPlaying] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end start"] });

  /* Scroll parallax: the footage sinks and grows, the type lifts and fades. */
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "24%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  /* Pointer parallax, mouse only, sprung so it never jerks. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 40, damping: 18, mass: 0.8 });
  const footX = useTransform(sx, (v) => v * -22);
  const footY = useTransform(sy, (v) => v * -14);
  const dustX = useTransform(sx, (v) => v * 40);
  const dustY = useTransform(sy, (v) => v * 26);
  const lightX = useTransform(sx, (v) => v * -40);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const showVideo = hydrated && !prefersReduced;
  const video = content.video;
  const lastLine = content.headline.length - 1;

  return (
    <section className="relative isolate bg-ink-950">
      {/* ================================================================
          ACT ONE
          ================================================================ */}
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        className="relative isolate flex min-h-svh flex-col overflow-hidden"
      >
        {/* --- Footage ----------------------------------------------------- */}
        <motion.div className="absolute inset-0 -z-30" style={{ y: bgY, scale: bgScale }}>
          <motion.div className="absolute -inset-[3%]" style={{ x: footX, y: footY }}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduced ? 1 : 1.16 }}
              animate={{ opacity: 1, scale: 1.03 }}
              transition={{
                opacity: { duration: 2.6, ease: "easeOut" },
                scale: { duration: 4.2, ease: EASE },
              }}
            >
              {/* The poster is a <picture>, so the server already picks the
                  right cut by aspect and nothing waits on hydration. */}
              <picture>
                <source media={PORTRAIT_QUERY} srcSet={assetPath(video.posterNarrow)} />
                <img
                  src={assetPath(video.poster)}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="high"
                  className="absolute inset-0 size-full object-cover"
                />
              </picture>

              {/* The clip mounts only after hydration, so a phone never
                  starts fetching the landscape file before it knows it is a
                  phone. It fades over the poster once it is actually playing. */}
              {showVideo && (
                <video
                  key={portrait ? video.srcNarrow : video.src}
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-[1600ms]",
                    playing ? "opacity-100" : "opacity-0",
                  )}
                  src={assetPath(portrait ? video.srcNarrow : video.src)}
                  aria-hidden="true"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onPlaying={() => setPlaying(true)}
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- Grade: enough to carry type, never a flat wash ------------- */}
        <div aria-hidden="true" className="absolute inset-0 -z-20">
          <div className="absolute inset-0 bg-ink-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/50 via-35% to-transparent to-65%" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-950/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, color-mix(in oklab, var(--color-ink-950) 75%, transparent) 100%)",
            }}
          />
        </div>

        {/* --- Atmosphere ------------------------------------------------- */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <SurveyGrid
            opacity={0.16}
            size={120}
            className="[mask-image:linear-gradient(to_right,black,transparent_70%)]"
          />
          <Blueprint reduced={reduced} />
          <motion.div className="absolute inset-0" style={{ x: lightX }}>
            <LightRays reduced={reduced} />
          </motion.div>
          {/* A warm bloom that wanders behind the headline. */}
          <motion.div
            className="absolute -left-40 top-1/4 size-[44rem] rounded-full will-change-transform"
            style={{ background: "radial-gradient(circle, rgba(237,169,27,0.16), transparent 65%)" }}
            animate={reduced ? undefined : { x: [0, 90, 20], y: [0, -40, 30] }}
            transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          <motion.div className="absolute inset-0" style={{ x: dustX, y: dustY }}>
            <DustField density={58} />
            <DustField density={34} tone="steel" />
          </motion.div>
        </div>

        {/* --- Type and actions ------------------------------------------- */}
        <motion.div
          className="relative flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+2.5rem)] pb-36 sm:pb-40"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="shell-wide">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: reduced ? 0.3 : 1.6, delay: reduced ? 0 : 0.5, ease: "easeOut" }}
            >
              <LeikahMark className="size-10 sm:size-12" />
              <span className="flex flex-col gap-1">
                <span className="font-display text-sm font-bold tracking-[0.18em] text-paper-50 uppercase sm:text-base">
                  {hero.brandName}
                </span>
                <span className="font-mono text-[0.625rem] tracking-[0.3em] text-gold-400 uppercase">
                  Middelburg · Mpumalanga
                </span>
              </span>
            </motion.div>

            <h1 className="mt-9 font-display text-[clamp(3.1rem,9.4vw,10.5rem)] leading-[0.86] font-black tracking-[-0.035em] uppercase sm:mt-11">
              <span className="sr-only">{hero.brandName}: </span>
              {content.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.07em]">
                  <motion.span
                    className={cn("block", i === lastLine ? "text-gold-gradient" : "text-paper-50")}
                    initial={{ y: reduced ? 0 : "112%", opacity: reduced ? 0 : 1 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: reduced ? 0.3 : 1.35, delay: reduced ? 0 : 0.95 + i * 0.16, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-[34rem] text-pretty text-lg leading-relaxed text-steel-200 sm:mt-9 sm:text-xl"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduced ? 0.3 : 1.3, delay: reduced ? 0 : 1.55, ease: EASE }}
            >
              {content.subtitle}
            </motion.p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12 sm:gap-4">
              {content.actions.map((action, i) => (
                <GlowAction key={action.href} action={action} delay={1.8 + i * 0.12} reduced={reduced} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- Breakdown line --------------------------------------------- */}
        <motion.a
          href={content.hotline.href}
          className="group absolute right-[var(--spacing-gutter)] bottom-10 hidden items-center gap-4 border border-steel-100/10 bg-ink-950/40 px-5 py-4 backdrop-blur-md transition-colors duration-500 chamfer-sm hover:border-gold-500/40 lg:flex"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: reduced ? 0 : 2.3, ease: EASE }}
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 rounded-full bg-signal-green motion-safe:animate-[leikah-pulse-ring_2.2s_ease-out_infinite]" />
            <span className="relative size-2.5 rounded-full bg-signal-green" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[0.5625rem] tracking-[0.26em] text-steel-400 uppercase">
              {content.hotline.label}
            </span>
            <span className="font-mono text-base tracking-wider text-gold-400 transition-colors group-hover:text-gold-300">
              {content.hotline.display}
            </span>
          </span>
        </motion.a>

        {/* --- Scroll cue ------------------------------------------------- */}
        <motion.a
          href="#hero-explore"
          className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-3 text-steel-300 transition-colors hover:text-gold-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: reduced ? 0 : 2.5 }}
        >
          <span className="font-mono text-[0.625rem] tracking-[0.34em] uppercase">Scroll to explore</span>
          <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-steel-100/15">
            <motion.span
              className="absolute inset-x-0 h-1/2 bg-gold-400"
              animate={reduced ? undefined : { y: ["-100%", "220%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </div>

      {/* ================================================================
          ACT TWO
          ================================================================ */}
      <div id="hero-explore" className="relative isolate scroll-mt-[var(--header-h)] overflow-hidden pt-10 pb-24 lg:pb-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <SurveyGrid opacity={0.1} size={120} className="[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
          <div
            className="absolute -right-60 top-1/3 size-[50rem] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(237,169,27,0.07), transparent 65%)" }}
          />
        </div>

        <div className="shell-wide">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.span
                className="flex items-center gap-4 font-mono text-[0.6875rem] tracking-[0.3em] text-gold-400 uppercase"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <span className="h-px w-10 bg-gold-500/70" />
                {content.cardsEyebrow}
              </motion.span>
              {/* The trigger is the heading, not each line: a line parked below its
                  own mask is fully clipped, so it would never count as in view. */}
              <motion.h2
                className="mt-5 font-display text-[clamp(2.3rem,5vw,4.75rem)] leading-[0.92] font-black tracking-[-0.03em] uppercase"
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.4 }}
              >
                {content.cardsHeadline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.06em]">
                    <motion.span
                      className={cn("block", i === 0 ? "text-paper-50" : "text-steel-500")}
                      variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
                      transition={{ duration: 1.2, delay: i * 0.12, ease: EASE }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {content.cards.map((card, i) => (
              <Card key={card.title} card={card} index={i} />
            ))}
          </div>

          <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 lg:mt-28 lg:grid-cols-4">
            {content.figures.map((figure, i) => (
              <motion.div
                key={figure.label}
                className="relative pt-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-steel-600/35" />
                <motion.span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-16 origin-left bg-gold-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EASE }}
                />
                <span
                  className={cn(
                    "block font-display leading-[0.9] font-black tracking-tight text-gold-gradient",
                    figure.value === undefined
                      ? "text-[clamp(2rem,3.6vw,3.4rem)] lg:pt-[0.3em]"
                      : "text-[clamp(2.6rem,5.2vw,4.75rem)]",
                  )}
                >
                  <FigureValue figure={figure} />
                </span>
                <span className="mt-3 block font-mono text-[0.625rem] tracking-[0.24em] text-steel-300 uppercase sm:text-[0.6875rem]">
                  {figure.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
