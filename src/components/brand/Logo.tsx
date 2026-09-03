import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   LEIKAH — BRAND MARKS

   The mark is a chamfered steel plate with a terraced "L" cut out of it. The
   steps read as the benches of an open-cast cut, which is what the earthmoving
   division actually builds; the chamfer is the same corner treatment used by
   the `chamfer` utility throughout the interface, so the identity and the UI
   share one silhouette.

   Letterforms are drawn as paths, not set in a webfont, so the wordmark is
   identical everywhere it appears — browser, favicon, print, vehicle vinyl.
   Every glyph in LEIKAH is straight-sided, which is why the name takes an
   angular treatment so naturally.
   ========================================================================= */

/** Plate outline. Chamfered on the top-left / bottom-right diagonal. */
const PLATE = "M20 2 H98 V78 L78 98 H2 V22 Z";

/**
 * Terraced L, cut out of the plate. Four benches descend left-to-right, which
 * is the profile of a cut face and also the only shape in the mark — an earlier
 * decorative blade-slice was dropped because at small sizes it read as a tick.
 */
const TERRACE_L = "M26 20 H41 V44 H55 V58 H69 V72 H83 V80 H26 Z";

const GLYPHS: Record<string, { d: string; w: number; evenodd?: boolean }> = {
  L: { d: "M0 0 H24 V76 H72 V100 H0 Z", w: 72 },
  E: { d: "M0 0 H72 V23 H24 V38 H62 V60 H24 V77 H72 V100 H0 Z", w: 72 },
  I: { d: "M0 0 H24 V100 H0 Z", w: 24 },
  K: { d: "M0 0 H24 V40 L55 0 H85 L46 50 L87 100 H57 L24 58 V100 H0 Z", w: 87 },
  A: {
    d: "M31 0 H57 L88 100 H62 L56 79 H32 L26 100 H0 Z M44 22 L37 60 H51 Z",
    w: 88,
    evenodd: true,
  },
  H: { d: "M0 0 H24 V38 H52 V0 H76 V100 H52 V61 H24 V100 H0 Z", w: 76 },
};

const TRACKING = 16;

/** Lays "LEIKAH" out on a 100-unit cap height and returns positioned glyphs. */
function layout(word: string) {
  let x = 0;
  const glyphs = word.split("").map((ch) => {
    const g = GLYPHS[ch];
    const node = { ...g, x };
    x += g.w + TRACKING;
    return node;
  });
  return { glyphs, width: x - TRACKING };
}

const WORD = layout("LEIKAH");

type Tone = "gold" | "light" | "dark" | "mono" | "steel";

const TONES: Record<Tone, { plate: string; cut: string; word: string; sub: string }> = {
  gold: { plate: "url(#leikah-gold)", cut: "var(--color-ink-950)", word: "currentColor", sub: "var(--color-gold-500)" },
  light: { plate: "#ffffff", cut: "#07090c", word: "#ffffff", sub: "#9aa3b0" },
  dark: { plate: "#0b0e13", cut: "#ffffff", word: "#0b0e13", sub: "#5f6875" },
  mono: { plate: "currentColor", cut: "transparent", word: "currentColor", sub: "currentColor" },
  steel: { plate: "url(#leikah-steel)", cut: "#07090c", word: "url(#leikah-steel)", sub: "#9aa3b0" },
};

/* --------------------------------------------------------------------------
   The mark on its own — favicon, app icon, social avatar, compact header.
   -------------------------------------------------------------------------- */

export function LeikahMark({
  tone = "gold",
  gradientId = "leikah-gold",
  className,
  ...props
}: SVGProps<SVGSVGElement> & { tone?: Tone; gradientId?: string }) {
  const t = TONES[tone];
  const plate = tone === "gold" ? `url(#${gradientId})` : t.plate;

  return (
    <svg viewBox="0 0 100 100" className={cn("block", className)} aria-hidden="true" {...props}>
      {tone === "gold" && (
        <defs>
          <linearGradient id={gradientId} x1="8" y1="0" x2="92" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-gold-300)" />
            <stop offset="46%" stopColor="var(--color-gold-500)" />
            <stop offset="100%" stopColor="var(--color-gold-600)" />
          </linearGradient>
        </defs>
      )}
      {/* One path: the plate with the L cut straight out of it. */}
      <path d={`${PLATE} ${TERRACE_L}`} fill={plate} fillRule="evenodd" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Wordmark on its own.
   -------------------------------------------------------------------------- */

export function LeikahWordmark({
  tone = "light",
  className,
  ...props
}: SVGProps<SVGSVGElement> & { tone?: Tone }) {
  const t = TONES[tone];
  return (
    <svg
      viewBox={`0 0 ${WORD.width} 100`}
      className={cn("block", className)}
      aria-hidden="true"
      {...props}
    >
      {tone === "steel" && (
        <defs>
          {/* Rolled-steel plate: bright at the top edge, shadowed through the
              middle, catching light again at the base. */}
          <linearGradient id="leikah-steel" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="38%" stopColor="#e2e5e9" />
            <stop offset="62%" stopColor="#9aa3b0" />
            <stop offset="100%" stopColor="#e8ebee" />
          </linearGradient>
        </defs>
      )}
      <g fill={t.word}>
        {WORD.glyphs.map((g, i) => (
          <path
            key={i}
            d={g.d}
            transform={`translate(${g.x} 0)`}
            fillRule={g.evenodd ? "evenodd" : "nonzero"}
          />
        ))}
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Horizontal lockup — the primary signature. Mark, rule, wordmark, descriptor.
   -------------------------------------------------------------------------- */

export function LeikahLogo({
  tone = "gold",
  descriptor = "PLANT HIRE",
  showDescriptor = true,
  className,
  title = "Leikah Plant Hire",
}: {
  tone?: Tone;
  descriptor?: string;
  showDescriptor?: boolean;
  className?: string;
  title?: string;
}) {
  const t = TONES[tone];
  const wordScale = 0.5; // cap height 100 → 50 units
  const wordW = WORD.width * wordScale;

  // Descriptor is drawn as tracked-out text; it is small enough that a system
  // stack renders it consistently, and keeping it as text keeps the file light.
  const totalW = 100 + 34 + wordW;

  return (
    <svg
      viewBox={`0 0 ${totalW} 100`}
      className={cn("block", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="leikah-lockup-gold" x1="8" y1="0" x2="92" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-gold-300)" />
          <stop offset="46%" stopColor="var(--color-gold-500)" />
          <stop offset="100%" stopColor="var(--color-gold-600)" />
        </linearGradient>
      </defs>

      <path
        d={`${PLATE} ${TERRACE_L}`}
        fill={tone === "gold" ? "url(#leikah-lockup-gold)" : t.plate}
        fillRule="evenodd"
      />

      <g transform={`translate(134 ${showDescriptor ? 18 : 25})`}>
        <g transform={`scale(${wordScale})`} fill={t.word}>
          {WORD.glyphs.map((g, i) => (
            <path
              key={i}
              d={g.d}
              transform={`translate(${g.x} 0)`}
              fillRule={g.evenodd ? "evenodd" : "nonzero"}
            />
          ))}
        </g>
        {showDescriptor && (
          <text
            x="1"
            y="76"
            fill={t.sub}
            fontSize="17"
            fontWeight="600"
            letterSpacing="5.4"
            fontFamily="var(--font-mono), ui-monospace, monospace"
          >
            {descriptor}
          </text>
        )}
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Stacked lockup — square placements, documents, signage.
   -------------------------------------------------------------------------- */

export function LeikahLogoStacked({
  tone = "gold",
  descriptor = "PLANT HIRE",
  className,
}: {
  tone?: Tone;
  descriptor?: string;
  className?: string;
}) {
  const t = TONES[tone];
  const wordScale = 0.42;
  const wordW = WORD.width * wordScale;
  const w = Math.max(wordW, 100);

  return (
    <svg viewBox={`0 0 ${w} 190`} className={cn("block", className)} role="img" aria-label="Leikah Plant Hire">
      <title>Leikah Plant Hire</title>
      <defs>
        <linearGradient id="leikah-stack-gold" x1="8" y1="0" x2="92" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-gold-300)" />
          <stop offset="46%" stopColor="var(--color-gold-500)" />
          <stop offset="100%" stopColor="var(--color-gold-600)" />
        </linearGradient>
      </defs>

      <g transform={`translate(${(w - 100) / 2} 0)`}>
        <path
          d={`${PLATE} ${TERRACE_L}`}
          fill={tone === "gold" ? "url(#leikah-stack-gold)" : t.plate}
          fillRule="evenodd"
        />
      </g>

      <g transform={`translate(${(w - wordW) / 2} 122)`}>
        <g transform={`scale(${wordScale})`} fill={t.word}>
          {WORD.glyphs.map((g, i) => (
            <path
              key={i}
              d={g.d}
              transform={`translate(${g.x} 0)`}
              fillRule={g.evenodd ? "evenodd" : "nonzero"}
            />
          ))}
        </g>
      </g>

      <text
        x={w / 2}
        y="182"
        textAnchor="middle"
        fill={t.sub}
        fontSize="13"
        fontWeight="600"
        letterSpacing="4.6"
        fontFamily="var(--font-mono), ui-monospace, monospace"
      >
        {descriptor}
      </text>
    </svg>
  );
}
