"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================================
   BLUEPRINT MACHINES

   Full technical line drawings — not icons. These are the signature graphic of
   the site: a machine drawing itself in behind the content, the way a general
   arrangement drawing is built up on a drawing board.

   Each machine is a list of paths with a `len` hint used to stagger the draw,
   so the undercarriage lands before the boom and the bucket arrives last. That
   ordering is what makes it read as a drawing being made rather than a graphic
   fading in.

   Drawn on a 420 × 260 field with the ground datum at y = 240, so any two
   machines placed side by side sit on the same line.
   ========================================================================= */

export type BlueprintMachine = "excavator" | "dozer" | "hauler" | "engine";

interface Stroke {
  d: string;
  /** Draw order. Lower numbers are laid down first. */
  step: number;
  /** Emphasis: the primary outline is brighter than construction lines. */
  weight?: "primary" | "detail" | "construction";
}

const MACHINES: Record<BlueprintMachine, Stroke[]> = {
  excavator: [
    /* Undercarriage */
    { d: "M34 240h176", step: 0, weight: "construction" },
    { d: "M52 196h140a26 26 0 0 1 0 44H52a26 26 0 0 1 0-44Z", step: 0 },
    { d: "M52 218h140", step: 1, weight: "detail" },
    { d: "M74 218m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0", step: 1, weight: "detail" },
    { d: "M170 218m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0", step: 1, weight: "detail" },
    { d: "M104 232v-9M122 232v-9M140 232v-9", step: 2, weight: "detail" },

    /* Slew ring and house */
    { d: "M74 196h96v-8H74z", step: 2 },
    { d: "M62 188h132a8 8 0 0 0 8-8v-46a8 8 0 0 0-8-8H96l-10 14H62a6 6 0 0 0-6 6v46a6 6 0 0 0 6 6Z", step: 3 },

    /* Counterweight */
    { d: "M56 178h-14a10 10 0 0 1 0-20h14", step: 4, weight: "detail" },

    /* Cab and glazing */
    { d: "M96 126h44v62H96z", step: 4 },
    { d: "M103 133h30v34h-30z", step: 5, weight: "detail" },
    { d: "M103 173h30v9h-30z", step: 5, weight: "detail" },

    /* Engine hood and exhaust */
    { d: "M146 140h48v34h-48z", step: 5, weight: "detail" },
    { d: "M158 140v-12h8v12", step: 6, weight: "detail" },

    /* Boom */
    { d: "M196 168 274 78l22 18-64 92z", step: 6, weight: "primary" },
    { d: "M196 168m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", step: 7, weight: "detail" },

    /* Boom cylinder */
    { d: "M152 176 214 132", step: 7, weight: "construction" },
    { d: "M150 182l10-12 62 44-10 12z", step: 7, weight: "detail" },

    /* Stick */
    { d: "M284 88l64 76-20 16-62-74z", step: 8, weight: "primary" },
    { d: "M284 88m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", step: 8, weight: "detail" },

    /* Stick cylinder */
    { d: "M238 108l72 42", step: 9, weight: "construction" },

    /* Bucket with teeth */
    { d: "M348 164c14 6 22 20 20 34l-44 10-16-28z", step: 10, weight: "primary" },
    { d: "M368 198l10 6M356 201l8 8M344 204l6 9M332 206l4 10", step: 11, weight: "detail" },

    /* Datum annotations */
    { d: "M34 250h176M34 246v8M210 246v8", step: 12, weight: "construction" },
  ],

  dozer: [
    { d: "M40 240h300", step: 0, weight: "construction" },

    /* Track frame */
    { d: "M96 190h150a25 25 0 0 1 0 50H96a25 25 0 0 1 0-50Z", step: 0 },
    { d: "M96 215h150", step: 1, weight: "detail" },
    { d: "M118 215m-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0", step: 1, weight: "detail" },
    { d: "M226 215m-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0", step: 1, weight: "detail" },
    { d: "M148 232v-10M172 232v-10M196 232v-10", step: 2, weight: "detail" },

    /* Body and cab */
    { d: "M108 190v-52h64l16 22h58v30z", step: 3 },
    { d: "M120 150h40v30h-40z", step: 4, weight: "detail" },
    { d: "M120 136h44v14h-44z", step: 4, weight: "detail" },
    { d: "M196 168h44v22h-44z", step: 4, weight: "detail" },
    { d: "M212 160v-14h10v14", step: 5, weight: "detail" },

    /* Blade with push arms */
    { d: "M78 240 62 142l14-4 22 98z", step: 6, weight: "primary" },
    { d: "M76 176l32 8M80 200l28 6", step: 7, weight: "construction" },
    { d: "M62 142h-12v18h12", step: 7, weight: "detail" },

    /* Ripper */
    { d: "M246 200h30l6 40h-14l-4-28h-18z", step: 8, weight: "primary" },
    { d: "M262 214l24 6", step: 9, weight: "construction" },

    { d: "M40 250h300M40 246v8M340 246v8", step: 10, weight: "construction" },
  ],

  hauler: [
    { d: "M20 240h380", step: 0, weight: "construction" },

    /* Bin */
    { d: "M170 190 190 96h190l-22 94z", step: 1, weight: "primary" },
    { d: "M190 118h182M186 142h178M180 166h174", step: 2, weight: "detail" },

    /* Cab and chassis */
    { d: "M46 190v-58a10 10 0 0 1 10-10h58l14 26v42z", step: 3 },
    { d: "M62 134h44v30H62z", step: 4, weight: "detail" },
    { d: "M40 190h340v18H40z", step: 4 },

    /* Articulation joint */
    { d: "M128 199m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0", step: 5, weight: "detail" },

    /* Axles */
    { d: "M84 208m-30 0a30 30 0 1 0 60 0a30 30 0 1 0-60 0", step: 6, weight: "primary" },
    { d: "M232 208m-30 0a30 30 0 1 0 60 0a30 30 0 1 0-60 0", step: 7, weight: "primary" },
    { d: "M316 208m-30 0a30 30 0 1 0 60 0a30 30 0 1 0-60 0", step: 8, weight: "primary" },
    { d: "M84 208m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0", step: 9, weight: "detail" },
    { d: "M232 208m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0", step: 9, weight: "detail" },
    { d: "M316 208m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0", step: 9, weight: "detail" },

    { d: "M20 250h380M20 246v8M400 246v8", step: 10, weight: "construction" },
  ],

  engine: [
    /* Sump */
    { d: "M112 208h176v32H112z", step: 0 },
    /* Block */
    { d: "M92 104h216v104H92z", step: 1, weight: "primary" },
    /* Head and rocker cover */
    { d: "M104 68h192v36H104z", step: 2 },
    { d: "M124 44h152v24H124z", step: 3, weight: "detail" },
    /* Injector stubs */
    { d: "M146 44V28M182 44V28M218 44V28M254 44V28", step: 4, weight: "detail" },
    /* Cylinder centre lines */
    { d: "M146 104v104M182 104v104M218 104v104M254 104v104", step: 5, weight: "construction" },
    /* Crank centre line and pulley */
    { d: "M92 176h216", step: 6, weight: "construction" },
    { d: "M330 156m-34 0a34 34 0 1 0 68 0a34 34 0 1 0-68 0", step: 7, weight: "primary" },
    { d: "M330 156m-12 0a12 12 0 1 0 24 0a12 12 0 1 0-24 0", step: 8, weight: "detail" },
    { d: "M308 156h-12", step: 8, weight: "construction" },
    /* Bell housing */
    { d: "M92 118H60a12 12 0 0 0-12 12v56a12 12 0 0 0 12 12h32", step: 9, weight: "detail" },
    /* Mounting feet */
    { d: "M112 240h34v10h-34zM254 240h34v10h-34z", step: 10, weight: "detail" },
  ],
};

const WEIGHT = {
  primary: { width: 1.6, opacity: 1 },
  detail: { width: 1.1, opacity: 0.72 },
  construction: { width: 0.8, opacity: 0.42 },
} as const;

export function Blueprint({
  machine = "excavator",
  className,
  stroke = "currentColor",
  /** Overall opacity of the whole drawing. */
  intensity = 0.5,
  /** Draw on scroll-into-view rather than immediately. */
  animate = true,
}: {
  machine?: BlueprintMachine;
  className?: string;
  stroke?: string;
  intensity?: number;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const strokes = MACHINES[machine];
  const shouldDraw = animate && !reduced;

  return (
    <svg
      viewBox="0 0 420 260"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{ opacity: intensity, color: stroke }}
    >
      {strokes.map((s, i) => {
        const w = WEIGHT[s.weight ?? "primary"];
        return (
          <motion.path
            key={i}
            d={s.d}
            stroke="currentColor"
            strokeWidth={w.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={w.opacity}
            initial={shouldDraw ? { pathLength: 0, opacity: 0 } : false}
            whileInView={shouldDraw ? { pathLength: 1, opacity: w.opacity } : undefined}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              pathLength: { duration: 1.1, delay: s.step * 0.09, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3, delay: s.step * 0.09 },
            }}
          />
        );
      })}
    </svg>
  );
}
