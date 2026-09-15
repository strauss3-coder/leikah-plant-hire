import type { SVGProps } from "react";

/* ============================================================================
   MACHINE SILHOUETTES

   Filled machine art for the loading and transition sequences. Distinct from
   Blueprint.tsx, which draws the same plant as technical line work: these are
   solid shapes meant to read instantly at speed and at small size.

   Every machine is drawn on one 260 x 130 grid with the ground datum at
   y = 116 and the travel direction to the right, so any of them can be swept
   across the screen by the same transform without re-tuning the geometry.

   Built from rects, circles and short polygons rather than one long path
   string. Each part is then independently addressable, which is what lets the
   boom articulate and the wheels turn without a second drawing.
   ========================================================================= */

export type MachineName = "excavator" | "dozer" | "hauler" | "loader" | "crane";

export const MACHINE_NAMES: MachineName[] = [
  "excavator",
  "dozer",
  "hauler",
  "loader",
  "crane",
];

/** Ground datum shared by every machine, so they can share one baseline. */
export const GROUND_Y = 116;
export const MACHINE_VIEWBOX = "0 0 260 130";

/* --- Shared parts ---------------------------------------------------------- */

/** Crawler track: hull, plus roller detail that reads at small sizes. */
function Track({ x, w, h = 22 }: { x: number; w: number; h?: number }) {
  const y = GROUND_Y - h;
  const r = h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} />
      <circle cx={x + r + 2} cy={y + r} r={r - 5} className="cut" />
      <circle cx={x + w - r - 2} cy={y + r} r={r - 5} className="cut" />
      {[0.34, 0.5, 0.66].map((t) => (
        <circle key={t} cx={x + w * t} cy={y + r + 3} r={2.6} className="cut" />
      ))}
    </g>
  );
}

/** Pneumatic wheel with a hub cut out of it. */
function Wheel({ cx, r }: { cx: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={GROUND_Y - r} r={r} />
      <circle cx={cx} cy={GROUND_Y - r} r={r * 0.42} className="cut" />
    </g>
  );
}

/* --- Machines -------------------------------------------------------------- */

function Excavator() {
  return (
    <>
      <Track x={38} w={122} />
      {/* Slew ring */}
      <rect x={62} y={86} width={78} height={9} rx={3} />
      {/* House, counterweight and engine hood */}
      <path d="M52 86V58a7 7 0 0 1 7-7h28l9-13h34a8 8 0 0 1 8 8v40Z" />
      <path d="M52 62H40a9 9 0 0 0 0 18h12Z" />
      {/* Cab glazing, cut through the house */}
      <path d="M66 58h20v20H66Z" className="cut" />
      {/* Exhaust */}
      <rect x={118} y={36} width={6} height={12} rx={2} />
      {/* Boom, arm and bucket. Grouped so the whole front can articulate. */}
      <g className="boom">
        <path d="M134 74 196 22l14 16-52 52Z" />
        <path d="M204 30 236 62l-13 13-32-32Z" />
        <path d="M228 66h22l-4 20a10 10 0 0 1-10 8h-16l-4-12Z" />
      </g>
    </>
  );
}

function Dozer() {
  return (
    <>
      <Track x={44} w={110} />
      {/* Engine hood, then the cab stepped up behind it */}
      <path d="M62 94V72a6 6 0 0 1 6-6h26v28Z" />
      <path d="M94 94V56a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v38Z" />
      <path d="M104 58h22v18h-22Z" className="cut" />
      <rect x={82} y={50} width={7} height={18} rx={2} />
      {/* Push arm, carrying the blade off the track frame */}
      <path d="M148 90h44v14h-44Z" />
      {/* Blade: one bold plate, curved face, cutting edge on the ground datum */}
      <path d="M188 42h18c-8 24-8 50 1 74h-19Z" />
    </>
  );
}

function Hauler() {
  return (
    <>
      {/* One chassis beam the full length, so it reads as a single articulated
          vehicle rather than two detached halves. */}
      <rect x={46} y={88} width={176} height={12} rx={4} />
      {/* Tractor unit: bonnet, then cab stepped up behind it */}
      <path d="M46 88V70a6 6 0 0 1 6-6h20v24Z" />
      <path d="M72 88V52a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v36Z" />
      <path d="M80 54h20v18H80Z" className="cut" />
      {/* Articulation hitch */}
      <path d="M110 76h16v12h-16Z" />
      {/* Tipper body, raised at the front as if discharging */}
      <path d="M124 88 132 40h92l-8 48Z" />
      <path d="M140 50h72l-5 28h-72Z" className="cut" />
      <Wheel cx={62} r={18} />
      <Wheel cx={162} r={18} />
      <Wheel cx={206} r={18} />
    </>
  );
}

function WheelLoader() {
  return (
    <>
      {/* Rear counterweight and engine block */}
      <path d="M34 96V72a8 8 0 0 1 8-8h34v32Z" />
      {/* Cab */}
      <path d="M76 96V54a6 6 0 0 1 6-6h30a6 6 0 0 1 6 6v42Z" />
      <path d="M86 56h22v20H86Z" className="cut" />
      {/* Articulated front frame */}
      <rect x={116} y={76} width={34} height={20} />
      {/* Lift arm, dropping forward from the cab shoulder to the bucket heel */}
      <path d="M114 60 180 82v13l-66-22Z" />
      {/* Bucket in profile: heel plate and floor, throat opening upward. One
          L-shaped path, so there is no separate piece that can read as loose. */}
      <path d="M176 74h15v18h49l-7 15h-57Z" />
      <Wheel cx={62} r={22} />
      <Wheel cx={148} r={22} />
    </>
  );
}

function Crane() {
  return (
    <>
      {/* Carrier deck and wheels */}
      <rect x={38} y={84} width={150} height={20} rx={4} />
      <Wheel cx={70} r={13} />
      <Wheel cx={102} r={13} />
      <Wheel cx={158} r={13} />
      {/* Superstructure and operator cab */}
      <path d="M72 84V54a6 6 0 0 1 6-6h36v36Z" />
      <path d="M84 56h22v18H84Z" className="cut" />
      {/* Boom in two tapering sections, pinned at the slew ring */}
      <path d="M110 76 192 26l12 18-84 52Z" />
      <path d="M192 30 236 6l10 16-44 24Z" />
      {/* Hook block hung straight off the boom head. A thin rope with a gap in
          it reads as a detached shape once the drawing is scaled down, so the
          block overlaps the boom instead of hanging below it on a hairline. */}
      <path d="M232 14h16v26l-8 10-8-10Z" />
    </>
  );
}

const MACHINES: Record<MachineName, () => React.JSX.Element> = {
  excavator: Excavator,
  dozer: Dozer,
  hauler: Hauler,
  loader: WheelLoader,
  crane: Crane,
};

/**
 * One machine, filled in `currentColor`.
 *
 * Parts marked `.cut` are holes: glazing, hubs, roller detail. They are painted
 * in the background colour rather than punched with a mask, because a mask on a
 * moving element forces an offscreen compositing pass on every frame and that is
 * exactly what drops frames on a mid-range phone.
 */
export function MachineSilhouette({
  machine,
  cutColor = "var(--color-ink-950)",
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  machine: MachineName;
  /** Colour painted into glazing and hub cut-outs. Match the ground behind. */
  cutColor?: string;
}) {
  const Machine = MACHINES[machine];
  return (
    <svg
      viewBox={MACHINE_VIEWBOX}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ ["--cut" as string]: cutColor }}
      {...props}
    >
      <style>{`.cut{fill:var(--cut)}`}</style>
      <Machine />
    </svg>
  );
}
