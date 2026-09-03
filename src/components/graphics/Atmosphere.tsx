"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LeikahMark, LeikahWordmark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/* ============================================================================
   ATMOSPHERE

   The layered background system. The previous version had a survey grid and
   contour lines set so faint they were invisible — scenery that claimed to be
   there and wasn't. Everything here is turned up until it is actually doing
   work, and everything stops under `prefers-reduced-motion`.
   ========================================================================= */

/* --------------------------------------------------------------------------
   SURVEY GRID
   An engineering field grid with tick marks on the majors. The ticks are what
   separate it from a generic dot grid.
   -------------------------------------------------------------------------- */

export function SurveyGrid({
  className,
  opacity = 1,
  size = 88,
}: {
  className?: string;
  opacity?: number;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(to right, color-mix(in oklab, var(--color-steel-500) 20%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in oklab, var(--color-steel-500) 20%, transparent) 1px, transparent 1px),
          linear-gradient(to right, color-mix(in oklab, var(--color-steel-500) 9%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in oklab, var(--color-steel-500) 9%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: `${size * 4}px ${size * 4}px, ${size * 4}px ${size * 4}px, ${size}px ${size}px, ${size}px ${size}px`,
        maskImage: "radial-gradient(ellipse 100% 80% at 50% 40%, black 15%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% 40%, black 15%, transparent 80%)",
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   TERRAIN CONTOURS
   Topographic section lines. Deliberately irregular — evenly spaced curves
   read as decoration, uneven ones read as ground.
   -------------------------------------------------------------------------- */

const CONTOURS = [
  "M0 150C160 132 250 96 420 104s230 46 400 30 250-56 420-44 200 52 360 40",
  "M0 196C140 180 260 140 430 148s220 44 390 28 260-52 430-40 190 50 350 38",
  "M0 242C120 228 270 186 440 194s210 42 380 26 270-48 440-36 180 48 340 36",
  "M0 288C180 276 240 232 410 240s240 40 410 24 250-44 420-32 200 46 360 34",
  "M0 334C150 324 280 280 450 288s200 38 370 22 280-40 450-28 170 44 330 32",
  "M0 380C130 372 290 326 460 334s190 36 360 20 290-36 460-24 160 42 320 30",
];

export function TerrainContours({
  className,
  intensity = 1,
  animate = true,
}: {
  className?: string;
  intensity?: number;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const draw = animate && !reduced;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 420"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full", className)}
      style={{ opacity: intensity }}
    >
      {CONTOURS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="var(--color-gold-500)"
          strokeWidth={i === 2 ? 1.4 : 1}
          opacity={i === 2 ? 0.34 : 0.13 + i * 0.02}
          initial={draw ? { pathLength: 0 } : false}
          whileInView={draw ? { pathLength: 1 } : undefined}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 2.2 + i * 0.28, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
        />
      ))}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   DUST FIELD
   Canvas particles. Cheap: a few dozen points, no physics, drawn once per
   frame at a low alpha. Pauses when scrolled out of view so it costs nothing
   on the rest of the page.
   -------------------------------------------------------------------------- */

export function DustField({
  className,
  density = 46,
  tone = "gold",
}: {
  className?: string;
  density?: number;
  tone?: "gold" | "steel";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colour = tone === "gold" ? "237,169,27" : "154,163,176";
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let motes: Mote[] = [];

    const seed = () => {
      motes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.4,
        // Drifting up and to the right, like dust off a working bench.
        vx: Math.random() * 0.16 + 0.03,
        vy: -(Math.random() * 0.12 + 0.02),
        a: Math.random() * 0.4 + 0.12,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;

      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x > width + 4) m.x = -4;
        if (m.y < -4) m.y = height + 4;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colour},${m.a})`;
        ctx.fill();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(wrap);

    const onResize = () => resize();
    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [density, reduced, tone]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}

/* --------------------------------------------------------------------------
   BRAND WATERMARK
   The mark, enormous, embossed into the ground rather than drawn on it —
   a light top edge and a dark bottom edge, the way a plate is stamped.
   -------------------------------------------------------------------------- */

export function BrandWatermark({
  className,
  size = "44rem",
  opacity = 0.05,
  parallax = true,
}: {
  className?: string;
  size?: string;
  opacity?: number;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={{ width: size, height: size }}
    >
      <motion.div style={parallax && !reduced ? { y } : undefined} className="size-full">
        <LeikahMark
          tone="mono"
          className="size-full text-paper-50"
          style={{
            opacity,
            filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.5)) drop-shadow(0 -1px 0 rgba(255,255,255,0.04))",
          }}
        />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   OVERSIZED WORDMARK
   LEIKAH set enormous and cropped, used as a section anchor. The point is that
   the name is unmissable, not decorative.
   -------------------------------------------------------------------------- */

export function BigWordmark({
  className,
  opacity = 0.07,
  align = "left",
}: {
  className?: string;
  opacity?: number;
  align?: "left" | "center" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Drifts against the scroll so the name feels set into the page, not on it.
  const x = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 overflow-hidden", className)}
    >
      <motion.div
        style={reduced ? undefined : { x }}
        className={cn(
          "flex",
          align === "center" && "justify-center",
          align === "right" && "justify-end",
        )}
      >
        <LeikahWordmark
          tone="light"
          className="h-auto w-[130%] max-w-none shrink-0 text-paper-50 sm:w-[112%] lg:w-full"
          style={{ opacity }}
        />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   STRATA DIVIDER
   The section break. Built from the bench motif with survey annotations, so
   moving between sections reads as moving down through a cut face.
   -------------------------------------------------------------------------- */

export function StrataDivider({
  className,
  label,
  flip = false,
  tone = "dark",
}: {
  className?: string;
  /** Survey-style annotation, e.g. "RL 1420" or the section name. */
  label?: string;
  flip?: boolean;
  tone?: "dark" | "light";
}) {
  const line = tone === "dark" ? "var(--color-steel-600)" : "var(--color-ink-900)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative h-16 w-full overflow-hidden", className)}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg viewBox="0 0 1600 64" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {/* Stepped bench profile */}
        <path
          d="M0 64V44h280V30h340V16h360v14h340v14h280v20z"
          fill="none"
          stroke={line}
          strokeWidth="1"
          opacity="0.5"
        />
        <path d="M0 64h1600" stroke={line} strokeWidth="1" opacity="0.32" />
        {/* Level ticks along the datum */}
        {Array.from({ length: 40 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 40 + 20} 64v-${i % 4 === 0 ? 10 : 5}`}
            stroke={line}
            strokeWidth="1"
            opacity={i % 4 === 0 ? 0.4 : 0.2}
          />
        ))}
      </svg>

      {label && (
        <span
          className={cn(
            "eyebrow absolute left-[var(--spacing-gutter)] top-1/2 -translate-y-1/2 bg-transparent text-[0.625rem]",
            tone === "dark" ? "text-steel-500" : "text-ink-500",
          )}
          style={{ transform: flip ? "scaleY(-1) translateY(50%)" : undefined }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   STEEL SHEEN
   A slow specular band that crosses a panel once when it enters view. Used
   sparingly — on the stat band and the closing CTA — to suggest brushed metal
   catching the light.
   -------------------------------------------------------------------------- */

export function SteelSheen({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  // The element always renders. Returning null under reduced motion would swap
  // a <span> for nothing between the server pass and hydration, which is a
  // structural mismatch — the reduced case is expressed as a zero-length
  // animation on a fully transparent element instead.
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-paper-50/6 to-transparent",
        className,
      )}
      initial={{ x: "-140%", opacity: reduced ? 0 : 1 }}
      whileInView={{ x: reduced ? "-140%" : "440%" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduced ? 0 : 2.4, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
    />
  );
}

/* --------------------------------------------------------------------------
   GOLD BLOOM
   Slow ambient light. Kept from the previous build because it works.
   -------------------------------------------------------------------------- */

export function GoldBloom({
  className,
  size = "60rem",
  intensity = 20,
}: {
  className?: string;
  size?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-[130px] motion-safe:animate-[leikah-drift_20s_ease-in-out_infinite]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, color-mix(in oklab, var(--color-gold-500) ${intensity}%, transparent) 0%, transparent 68%)`,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   CORNER MARKS
   Registration crosses, as used on a drawing sheet.
   -------------------------------------------------------------------------- */

export function CornerMarks({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {[
        "left-0 top-0 border-l border-t",
        "right-0 top-0 border-r border-t",
        "left-0 bottom-0 border-l border-b",
        "right-0 bottom-0 border-r border-b",
      ].map((pos) => (
        <span key={pos} className={cn("absolute size-3 border-gold-500/45", pos)} />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   PARALLAX
   -------------------------------------------------------------------------- */

export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   SURVEY READOUT
   A live-looking annotation strip — coordinates, datum, sheet reference. Pure
   typographic furniture, but it is the detail that makes a panel read as an
   engineering document rather than a web card.
   -------------------------------------------------------------------------- */

export function SurveyReadout({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const [tick, setTick] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 3600);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  return (
    <div
      className={cn(
        "eyebrow flex items-center gap-3 text-[0.625rem] text-steel-500",
        className,
      )}
    >
      <span className="size-1 shrink-0 rotate-45 bg-gold-500" aria-hidden="true" />
      <span className="tabular">{items[tick % items.length]}</span>
    </div>
  );
}
