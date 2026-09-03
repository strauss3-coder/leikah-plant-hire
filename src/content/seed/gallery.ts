import type { GalleryItem } from "@/lib/cms/types";

/* ============================================================================
   GALLERY

   Every entry points at a slug in the media manifest, so renditions can be
   regenerated without touching content. Captions are written per image rather
   than reused from the alt text — alt text describes, captions explain.
   ========================================================================= */

const item = (
  media: string,
  caption: string,
  category: string,
  order: number,
  extra: Partial<GalleryItem> = {},
): GalleryItem => ({
  id: `gal-${media}`,
  media,
  caption,
  category,
  type: "image",
  featured: false,
  order,
  ...extra,
});

export const gallery: GalleryItem[] = [
  /* --- Earthmoving --------------------------------------------------------- */
  item(
    "excavator-coal-bench-fleet",
    "Primary loading fleet positioned on an advancing coal bench.",
    "Earthmoving",
    1,
    { featured: true },
  ),
  item(
    "excavator-adt-loading-coal",
    "Excavator loading haulers against the coal highwall — the cycle the whole plan is built on.",
    "Earthmoving",
    2,
  ),
  item(
    "dozer-d9t-dusk",
    "A D9T still working the profile as the light goes. Haul roads are held on a frequency, not on a complaint.",
    "Earthmoving",
    3,
    { featured: true, projectSlug: "haul-road-rebuild-coal-operation" },
  ),
  item(
    "dozer-lowbed-loadout-pit",
    "Load-out from an open pit, with the terraced walls showing the bench sequence behind it.",
    "Earthmoving",
    4,
  ),

  /* --- Plant & fleet -------------------------------------------------------- */
  item(
    "dozer-d10t-refurbished",
    "A track-type tractor back on site after a workshop turnaround, ripper fitted and ready for the cut.",
    "Plant & Fleet",
    5,
    { featured: true },
  ),
  item(
    "liebherr-excavator-standby",
    "Excavator on standby between cuts, with the service vehicle alongside for the pre-start.",
    "Plant & Fleet",
    6,
  ),
  item(
    "leikah-response-vehicle",
    "The rapid-response vehicle in Leikah livery — the first thing that arrives when a machine stops.",
    "Plant & Fleet",
    7,
    { featured: true },
  ),
  item(
    "water-bowser-dust-suppression",
    "Water bowser on the dust suppression circuit, application rate set to the road rather than applied uniformly.",
    "Plant & Fleet",
    8,
  ),

  /* --- Field service -------------------------------------------------------- */
  item(
    "field-service-excavator-repair",
    "Field crew working a mining excavator in place. Recovering a machine that size off a live bench is a job in itself.",
    "Field Service",
    9,
    { featured: true, projectSlug: "mining-excavator-field-repair" },
  ),
  item(
    "hydraulic-hose-replacement",
    "Replacement line measured, crimped and fitted at the machine — one visit rather than three.",
    "Field Service",
    10,
    { pairedWith: "hydraulic-valve-bank-inspection", pairRole: "after" },
  ),
  item(
    "hydraulic-valve-bank-inspection",
    "Valve bank at diagnosis. Pressure and flow are measured before anything is removed.",
    "Field Service",
    11,
    { pairedWith: "hydraulic-hose-replacement", pairRole: "before" },
  ),
  item(
    "pit-dewatering-pump-set",
    "Dewatering set running lay-flat off a flooded pit, sized to the inflow and the lift.",
    "Field Service",
    12,
  ),

  /* --- Workshop ------------------------------------------------------------- */
  item(
    "diesel-engine-workshop-strip",
    "A heavy diesel as received. Nothing is ordered until it is stripped, cleaned and measured.",
    "Workshop",
    13,
    { pairedWith: "engine-flywheel-housing", pairRole: "before" },
  ),
  item(
    "engine-flywheel-housing",
    "The same class of unit built back to OEM specification, flywheel housing fitted and ready for release.",
    "Workshop",
    14,
    { featured: true, pairedWith: "diesel-engine-workshop-strip", pairRole: "after" },
  ),
  item(
    "engine-block-machined",
    "Cylinder block cleaned and laid out for measurement against service limits.",
    "Workshop",
    15,
  ),
  item(
    "timing-gear-train-assembly",
    "Gear train set and timed. Backlash and end-float are gauged and recorded, not judged.",
    "Workshop",
    16,
  ),
  item(
    "reconditioned-block-lifted",
    "Reconditioned block on rated slings, moving to the assembly bay.",
    "Workshop",
    17,
  ),
  item(
    "powertrain-assembly-bench",
    "Engine and gearbox married on the bench with fuel lines fitted, ahead of run and load check.",
    "Workshop",
    18,
  ),
  item(
    "transmission-housing-overhaul",
    "Transmission housing stripped and measured on arrival, before a parts schedule is written.",
    "Workshop",
    19,
    { pairedWith: "adt-transmission-assembly", pairRole: "before" },
  ),
  item(
    "adt-transmission-assembly",
    "The completed assembly sealed, tagged and palletised with the fitting hardware included.",
    "Workshop",
    20,
    { featured: true, pairedWith: "transmission-housing-overhaul", pairRole: "after" },
  ),
  item(
    "final-drive-rebuild-complete",
    "Final drive rebuilt, painted and lifted out for dispatch.",
    "Workshop",
    21,
  ),
  item(
    "fabrication-team-bowser",
    "The fabrication bay building a bunded diesel unit to drawing, welded by coded welders.",
    "Workshop",
    22,
    { projectSlug: "site-fuel-infrastructure-fabrication" },
  ),

  /* --- Logistics & supply ---------------------------------------------------- */
  item(
    "adt-lowbed-quarry-delivery",
    "Hauler delivered into a working quarry, in a window agreed around the blast schedule.",
    "Logistics",
    23,
    { projectSlug: "quarry-plant-mobilisation" },
  ),
  item(
    "dozer-lowbed-haul-road",
    "Dozer chained down for mobilisation. Abnormal-load arrangements are ours to organise, not yours.",
    "Logistics",
    24,
  ),
  item(
    "adt-lowbed-transport-dusk",
    "Hauler in transit at the end of the day, moving between sites.",
    "Logistics",
    25,
  ),
  item(
    "parts-dispatch-pallet",
    "Consumables palletised and labelled to machine and job, ready for site delivery.",
    "Supply",
    26,
  ),
];
