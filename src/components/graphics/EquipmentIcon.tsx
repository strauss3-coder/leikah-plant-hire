import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   EQUIPMENT ICON FAMILY

   Drawn as machines, not as abstract glyphs. The previous set was a collection
   of schematic marks that read as generic interface furniture and — because
   they were abstract — two different services ended up sharing one icon without
   anybody noticing.

   Rules for the family:

   • 48-unit grid. The old 32 grid was too coarse to carry a recognisable
     silhouette, which is why everything collapsed into a squiggle at card size.
   • Ground line at y=42 on every machine, so a row of them sits on one datum.
   • 1.7 stroke, round joins. Heavier than a UI icon set because these are
     rendered at 40–72px on dark grounds, where hairlines disappear.
   • Silhouette first: each mark has to be identifiable at 24px with the detail
     removed. Detail is added only where it survives.
   ========================================================================= */

export type EquipmentKey =
  | "excavator"
  | "dozer"
  | "hauler"
  | "grader"
  | "loader"
  | "lowbed"
  | "bowser"
  | "engine"
  | "transmission"
  | "hydraulic"
  | "hose"
  | "pump"
  | "hardhat"
  | "weld"
  | "pallet"
  | "bench"
  | "haulroad"
  | "stockpile"
  | "clock"
  | "shield"
  | "gauge"
  | "clipboard"
  | "leaf"
  | "book";

/** Track base shared by the crawler machines, so they sit on the same datum. */
const TRACKS = (x1: number, x2: number) =>
  `M${x1 + 4} 42 H${x2 - 4} a4 4 0 0 0 0-8 H${x1 + 4} a4 4 0 0 0 0 8 Z`;

const PATHS: Record<EquipmentKey, React.ReactNode> = {
  /* --- Earthmoving plant ------------------------------------------------- */

  excavator: (
    <>
      <path d={TRACKS(2, 30)} />
      <path d="M8 38h16" />
      {/* House and cab */}
      <path d="M10 34V24a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10" />
      <path d="M13 25h6v6h-6z" />
      {/* Boom, stick, bucket */}
      <path d="M28 26 38 13" />
      <path d="M38 13 44 22" />
      <path d="M44 22 41 30l6-2z" />
    </>
  ),

  dozer: (
    <>
      <path d={TRACKS(6, 36)} />
      <path d="M13 38h16" />
      {/* Cab and body */}
      <path d="M14 34V25h9l3 4v5" />
      <path d="M16 27h5v4h-5z" />
      {/* Blade, angled forward */}
      <path d="M6 42 4 26h4l2 16" />
      <path d="M10 33 6 32" />
      {/* Ripper shank */}
      <path d="M36 32h4v10" />
    </>
  ),

  hauler: (
    <>
      {/* Tipping bin */}
      <path d="M20 30 24 17h20l-3 13z" />
      {/* Cab and chassis */}
      <path d="M6 30V22a2 2 0 0 1 2-2h8v10" />
      <path d="M9 23h5v4H9z" />
      <path d="M4 30h40v4H4z" />
      {/* Three axles — what makes an articulated hauler read as one */}
      <circle cx="11" cy="38" r="4" />
      <circle cx="27" cy="38" r="4" />
      <circle cx="38" cy="38" r="4" />
    </>
  ),

  grader: (
    <>
      {/* The long wheelbase is the whole silhouette — front axle far ahead of
          the cab, tandems at the back, mouldboard slung underneath between. */}
      <path d="M8 30h34" />
      <path d="M28 30V17a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13" />
      <path d="M32 19h6v6h-6z" />
      {/* Blade hangers and mouldboard, set at a working angle */}
      <path d="M17 30v4M25 30v3" />
      <path d="m13 39 17-5" />
      <path d="m13 39-1-3 17-5 1 3z" />
      <circle cx="8" cy="38" r="4" />
      <circle cx="34" cy="38" r="4" />
      <circle cx="43" cy="38" r="4" />
    </>
  ),

  loader: (
    <>
      {/* Bucket in profile: back plate up, floor running forward to a cutting
          edge. That shape is what separates a loader from an excavator. */}
      <path d="M6 22v14l11 2V24z" />
      <path d="M6 36h11" />
      {/* Lift arm into a short, heavy body */}
      <path d="m17 30 7-4" />
      <path d="M24 34V22a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" />
      <path d="M28 23h6v6h-6z" />
      <path d="M22 34h20" />
      <circle cx="28" cy="38" r="5" />
      <circle cx="40" cy="38" r="5" />
    </>
  ),

  lowbed: (
    <>
      {/* Tractor unit */}
      <path d="M4 34V24a2 2 0 0 1 2-2h7l3 5v7" />
      <path d="M7 25h5v4H7z" />
      {/* Gooseneck and drop deck — the profile that says "lowbed" */}
      <path d="M16 30h6l3-5h19v9" />
      <path d="M16 34h28" />
      <circle cx="9" cy="38" r="3.5" />
      <circle cx="30" cy="38" r="3.5" />
      <circle cx="40" cy="38" r="3.5" />
    </>
  ),

  bowser: (
    <>
      {/* Cylindrical tank */}
      <path d="M16 20h22a5 5 0 0 1 0 14H16a5 5 0 0 1 0-14Z" />
      <path d="M33 20v14" />
      <path d="M24 20v-3h4v3" />
      {/* Cab and running gear */}
      <path d="M4 34V24a2 2 0 0 1 2-2h8v12" />
      <path d="M7 25h4v4H7z" />
      <circle cx="10" cy="38" r="3.5" />
      <circle cx="26" cy="38" r="3.5" />
      <circle cx="36" cy="38" r="3.5" />
    </>
  ),

  /* --- Workshop ------------------------------------------------------------ */

  engine: (
    <>
      {/* Rocker cover, block, sump — the three-part profile of an in-line diesel */}
      <path d="M13 14h20v6H13z" />
      <path d="M9 20h28v14H9z" />
      <path d="M14 34h18v6H14z" />
      {/* Injector stubs */}
      <path d="M17 14v-3M23 14v-3M29 14v-3" />
      {/* Crank pulley */}
      <circle cx="41" cy="27" r="5" />
      <path d="M37 27h-4" />
    </>
  ),

  transmission: (
    <>
      {/* Torque converter housing, stepped case, output flange, sump. The round
          housing at one end is the feature that reads as a powertrain unit. */}
      <circle cx="14" cy="23" r="9" />
      <circle cx="14" cy="23" r="3.5" />
      <path d="M14 14h13a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14" />
      <path d="M30 19h8v8h-8" />
      <path d="M38 23h6" />
      <path d="M17 32v6h11v-6" />
      <path d="M20 14v-3M26 14v-3" />
    </>
  ),

  hydraulic: (
    <>
      {/* Barrel */}
      <path d="M6 18h22v14H6z" />
      <path d="M6 25h22" />
      {/* Rod and clevis */}
      <path d="M28 25h9" />
      <path d="M37 21h6v8h-6z" />
      <circle cx="40" cy="25" r="2" />
      {/* Mounting eye and ports */}
      <circle cx="4" cy="25" r="3" />
      <path d="M11 18v-4M22 18v-4" />
    </>
  ),

  hose: (
    <>
      {/* A made-up assembly: hex nut and crimped ferrule at each end, hose
          swept between them. The ferrules are what say "hydraulic hose"
          rather than "cable". */}
      <path d="M4 15h9v10H4z" />
      <path d="M13 14h5v12h-5z" />
      <path d="M6 18v4M9 18v4" />
      <path d="M18 20c9 0 6 14 13 14" />
      <path d="M31 29h5v12h-5z" />
      <path d="M36 30h8v10h-8z" />
      <path d="M39 33v4M42 33v4" />
    </>
  ),

  pump: (
    <>
      {/* Volute casing */}
      <circle cx="17" cy="26" r="11" />
      <circle cx="17" cy="26" r="4" />
      {/* Discharge and suction */}
      <path d="M17 15V9h7" />
      <path d="M28 26h6" />
      {/* Motor and skid */}
      <path d="M34 20h10v12H34z" />
      <path d="M6 40h38" />
      <path d="M14 37v3M36 32v8" />
    </>
  ),

  /* --- Safety and workshop process ------------------------------------------ */

  hardhat: (
    <>
      <path d="M8 32a16 16 0 0 1 32 0" />
      <path d="M4 32h40" />
      {/* Crown ribs */}
      <path d="M18 17.5V32M30 17.5V32" />
      <path d="M24 16v16" />
      <path d="M8 32v3h32v-3" />
    </>
  ),

  weld: (
    <>
      {/* Two plates meeting */}
      <path d="M4 30h16M28 30h16" />
      <path d="M4 30v6h16v-6M28 30v6h16v-6" />
      {/* Bead and arc */}
      <path d="M20 27c1.5-2 3 2 4 0s2.5 2 4 0" />
      <path d="M24 22V14" />
      <path d="M19 18l-3-4M29 18l3-4" />
    </>
  ),

  pallet: (
    <>
      {/* Shrink-wrapped load */}
      <path d="M12 12h24v20H12z" />
      <path d="M12 22h24" />
      <path d="M24 12v20" />
      {/* Pallet and fork tines */}
      <path d="M8 32h32v4H8z" />
      <path d="M12 36v4M36 36v4" />
      <path d="M4 42h40" />
    </>
  ),

  /* --- Site and terrain ------------------------------------------------------ */

  bench: (
    <>
      {/* The cut face: descending benches with the excavation arrow */}
      <path d="M4 42h40" />
      <path d="M6 42V32h9V22h9V12h11" />
      <path d="M24 20v10m0 0-3-3m3 3 3-3" />
      <path d="M35 12h9v6" />
    </>
  ),

  haulroad: (
    <>
      {/* Road in perspective with berms and a maintained centre line */}
      <path d="M14 42 22 10h8l6 32" />
      <path d="M25.5 36v-4M26.2 27v-4M27 18v-4" />
      <path d="M10 34H4M12 26H7" />
      <path d="M40 34h4M38 26h5" />
    </>
  ),

  stockpile: (
    <>
      <path d="M4 42h40" />
      {/* Cone with lift lines and a reclaim face */}
      <path d="M24 12 6 42h36z" />
      <path d="M14 34h20M18.5 26h11" />
      <path d="M30 42V34" />
    </>
  ),

  /* --- Abstract marks retained for non-equipment uses ------------------------ */

  clock: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 13v12l8 5" />
    </>
  ),

  shield: (
    <>
      <path d="M24 4 7 11v12c0 9.4 6.7 16.3 17 18.4C34.3 39.3 41 32.4 41 23V11z" />
      <path d="m17 23 5 5 10-10" />
    </>
  ),

  gauge: (
    <>
      <path d="M6 34a18 18 0 1 1 36 0" />
      <path d="M24 34 35 18" />
      <circle cx="24" cy="34" r="2.5" />
      <path d="M9 25l3 1M39 25l-3 1M15 15l2 2M33 15l-2 2M24 11v3" />
    </>
  ),

  clipboard: (
    <>
      <path d="M14 8h20a2 2 0 0 1 2 2v30a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
      <path d="M19 8V5h10v3" />
      <path d="M18 20h12M18 27h12M18 34h7" />
    </>
  ),

  leaf: (
    <>
      <path d="M38 8C20 8 10 16 10 28a12 12 0 0 0 20 9c6-5 8-15 8-29Z" />
      <path d="M30 16C22 22 18 30 16 42" />
    </>
  ),

  book: (
    <>
      <path d="M8 8h13a5 5 0 0 1 5 5v27a4 4 0 0 0-4-4H8z" />
      <path d="M40 8H27a5 5 0 0 0-5 5v27a4 4 0 0 1 4-4h14z" />
    </>
  ),
};

export function EquipmentIcon({
  name,
  className,
  strokeWidth = 1.7,
  ...props
}: SVGProps<SVGSVGElement> & { name: EquipmentKey; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-12", className)}
      aria-hidden="true"
      {...props}
    >
      {PATHS[name] ?? PATHS.bench}
    </svg>
  );
}

/**
 * Service slug -> icon. Kept here rather than in content so a new service
 * cannot ship pointing at an icon that does not exist, and so the duplicate
 * that slipped through last time (engine used for both engine and transmission
 * work) is visible as a mapping rather than buried in a data file.
 */
export const SERVICE_ICONS: Record<string, EquipmentKey> = {
  "bulk-earthworks": "bench",
  "haul-road-construction": "haulroad",
  "plant-hire": "dozer",
  "materials-handling": "stockpile",
  "site-establishment": "loader",
  "engine-overhauls": "engine",
  "powertrain-rebuilds": "transmission",
  "hydraulic-services": "hydraulic",
  "preventive-maintenance": "gauge",
  "fabrication-repair": "weld",
  "parts-supply": "pallet",
  "breakdown-response": "hose",
  "site-services": "pump",
};

/** Legacy icon keys from the CMS map onto the new family. */
export const LEGACY_ICON_MAP: Record<string, EquipmentKey> = {
  excavation: "bench",
  "haul-road": "haulroad",
  "plant-hire": "dozer",
  materials: "stockpile",
  "field-service": "hose",
  engine: "engine",
  hydraulics: "hydraulic",
  preventive: "gauge",
  fabrication: "weld",
  supply: "pallet",
  transport: "lowbed",
  "site-services": "pump",
  shield: "shield",
  clock: "clock",
  gauge: "gauge",
  clipboard: "clipboard",
  hardhat: "hardhat",
  leaf: "leaf",
  book: "book",
};

/** Resolves whatever the CMS holds — new key, legacy key or slug — to an icon. */
export function resolveIcon(value: string | undefined, slug?: string): EquipmentKey {
  if (slug && SERVICE_ICONS[slug]) return SERVICE_ICONS[slug];
  if (value && value in PATHS) return value as EquipmentKey;
  if (value && LEGACY_ICON_MAP[value]) return LEGACY_ICON_MAP[value];
  return "bench";
}
