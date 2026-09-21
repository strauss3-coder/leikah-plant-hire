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
  /* --- Precision machining ---------------------------------------------------
     The line boring set, kept in the order the repair actually runs so the
     category reads as a sequence rather than a pile of close-ups. The worn
     bore and the finished bore are declared as a before/after pair.
     ------------------------------------------------------------------------ */
  item(
    "line-borer-rigged-on-boom",
    "The boring bar clamped to the boom itself. The machine stays where it is and the machine shop comes to it.",
    "Precision Machining",
    27,
    { featured: true },
  ),
  item(
    "bore-weld-build-up",
    "A worn pin bore welded back up. Metal goes in before anything is cut, which is what separates a repair from a patch.",
    "Precision Machining",
    28,
    { pairedWith: "boom-eye-bored-to-size", pairRole: "before" },
  ),
  item(
    "boom-eye-bored-to-size",
    "The same joint cut back to the drawing size, concentric to the original centre line.",
    "Precision Machining",
    29,
    { pairedWith: "bore-weld-build-up", pairRole: "after", featured: true },
  ),
  item(
    "bore-weld-ready-to-machine",
    "Weld deposit standing proud of finished size, waiting on the boring bar.",
    "Precision Machining",
    30,
  ),
  item(
    "boring-bar-through-bore",
    "Boring bar set through the joint with the cutting head mounted mid span.",
    "Precision Machining",
    31,
  ),
  item(
    "twin-lug-bores-restored",
    "Paired lugs bored from one setup. Two separate setups is how a new pin ends up binding.",
    "Precision Machining",
    32,
  ),
  item(
    "link-bore-finished",
    "Finished bore running the full depth of the boss, with an even tool finish.",
    "Precision Machining",
    33,
  ),
  item(
    "bush-pressed-into-bore",
    "New bush pressed into the restored bore and measured before the joint is pinned back up.",
    "Precision Machining",
    34,
  ),
  item(
    "bore-repair-job-carded",
    "Bore repair carried out under the machine, with the job card taped to the boom above the work.",
    "Precision Machining",
    35,
  ),

  /* --- Workshop, from our own bays ------------------------------------------- */
  item(
    "workshop-bay-plant-stripped",
    "A wheel loader stripped down in the bay. Machines come in whole and go out whole.",
    "Workshop",
    36,
    { featured: true },
  ),
  item(
    "workshop-adt-on-stands",
    "Hauler lifted for a driveline repair, with the bay height to get underneath it properly.",
    "Workshop",
    37,
  ),
  item(
    "workshop-bays-in-use",
    "Both bays under load. Workshop capacity is what keeps a turnaround honest.",
    "Workshop",
    38,
  ),
  item(
    "workshop-component-racking",
    "Rebuilt components racked alongside the bays, logged to the machine they belong to.",
    "Workshop",
    39,
  ),
  item(
    "transmission-on-rebuild-stand",
    "Transmission on the rebuild stand, stripped, measured and built back up.",
    "Workshop",
    40,
  ),
  item(
    "differential-housing-rebuilt",
    "Differential housing rebuilt and repainted, ready to go back under the machine.",
    "Workshop",
    41,
  ),
  item(
    "drive-axle-assembly-complete",
    "Complete drive axle assembled and laid out for a final check before fitment.",
    "Workshop",
    42,
  ),
  item(
    "long-block-built-up",
    "Long block built up on the bench, ready to be run and load-tested before release.",
    "Workshop",
    43,
  ),
  item(
    "cylinder-block-bores-finished",
    "Cylinder block finished and laid out, bores measured and recorded against specification.",
    "Workshop",
    44,
  ),
  item(
    "final-drive-slung-for-fitment",
    "Final drive slung and ready for fitment, out of the bay and into the daylight.",
    "Workshop",
    45,
  ),

  /* --- Field service --------------------------------------------------------- */
  item(
    "field-crew-under-machine",
    "A crew working a repair on the ground where the machine stopped. Most breakdowns are not polite enough to happen near a workshop.",
    "Field Service",
    46,
    { featured: true },
  ),
  item(
    "powertrain-lifted-by-crane",
    "Engine and transmission lifted clear on site, with the crane brought in rather than the machine dragged out.",
    "Field Service",
    47,
  ),
  item(
    "powertrain-removal-in-field",
    "Powertrain guided down onto stands in the field, which is where the strip actually begins.",
    "Field Service",
    48,
  ),
  item(
    "service-vehicle-rigged-on-site",
    "Service vehicle rigged alongside the machine, carrying its own welding plant.",
    "Field Service",
    49,
  ),
  item(
    "on-site-cutting-and-welding",
    "Cutting and welding brought to the bucket instead of the bucket brought to the bay.",
    "Field Service",
    50,
  ),
  item(
    "cooling-pack-turbo-exposed",
    "Cooling pack and turbocharger opened up for inspection before anything is quoted.",
    "Field Service",
    51,
  ),
  item(
    "engine-stripped-on-site",
    "Engine stripped where it stands, with components laid out and logged as they come off.",
    "Field Service",
    52,
  ),
  item(
    "live-mine-service-call",
    "A service call on a live operation, coned off and worked around the traffic still running.",
    "Field Service",
    53,
  ),

  /* --- Logistics & supply ---------------------------------------------------- */
  item(
    "crane-truck-component-recovery",
    "Crane truck recovering components for return to the workshop.",
    "Logistics",
    54,
  ),
  item(
    "hub-wrapped-for-transport",
    "Wheel end wrapped and sealed before it travels. Contamination in transit undoes the rebuild.",
    "Supply",
    55,
  ),
  item(
    "final-drive-wrapped-dispatch",
    "Rebuilt final drive sealed for dispatch, logged out against the machine it is going to.",
    "Supply",
    56,
  ),
  item(
    "component-returned-to-machine",
    "Rebuilt component back on site, in front of the machine it came off.",
    "Supply",
    57,
  ),
  /* --- Coal & materials -------------------------------------------------------
     The product rather than the plant. These are the only photographs in the
     library that show what is actually being sold.
     ------------------------------------------------------------------------ */
  item(
    "coal-slab-in-hand",
    "Coal off the face, still showing the bedding it was laid down in.",
    "Coal & Materials",
    58,
    { featured: true },
  ),
  item(
    "coal-sample-on-bucket-tooth",
    "A sample set on the bucket lip. Quality gets checked where it is dug, not at the weighbridge.",
    "Coal & Materials",
    59,
    { featured: true },
  ),
  item(
    "coal-sample-at-the-face",
    "Product held up against the cut it came out of.",
    "Coal & Materials",
    60,
  ),
  item(
    "coal-seam-exposed",
    "The seam uncovered and clean, with the overburden stood back off the edge.",
    "Coal & Materials",
    61,
  ),

  /* --- Earthmoving, from the pit ---------------------------------------------- */
  item(
    "coal-bench-excavator-working",
    "An excavator down on the coal at the foot of the red overburden face.",
    "Earthmoving",
    62,
    { featured: true },
  ),
  item(
    "opencast-pit-overview",
    "The cut seen from above the highwall, which is the only place the sequence makes sense.",
    "Earthmoving",
    63,
  ),
  item(
    "pit-panorama-waterline",
    "Working down to the waterline. Standing water sets the limit of the cut until it is pumped.",
    "Earthmoving",
    64,
  ),

  /* --- Plant & fleet ----------------------------------------------------------- */
  item(
    "liebherr-excavator-low-angle",
    "Excavator between passes, photographed from the floor it is standing on.",
    "Plant & Fleet",
    65,
    { featured: true },
  ),
  item(
    "excavator-with-lighting-tower",
    "Lighting plant set up beside the machine. The pit does not stop when the light goes.",
    "Plant & Fleet",
    66,
  ),
  item(
    "excavator-and-site-vehicles",
    "Machine and vehicles sharing the pit road, which is where most of the risk on a site actually sits.",
    "Plant & Fleet",
    67,
  ),
  item(
    "excavator-undercarriage-detail",
    "Undercarriage at close range. Track wear is the single biggest running cost on a machine this size.",
    "Plant & Fleet",
    68,
  ),

  /* --- Field service ------------------------------------------------------------ */
  item(
    "site-inspection-pit-floor",
    "Walking the pit floor. Most of what goes into a quote is decided on a visit like this one.",
    "Field Service",
    69,
  ),
];
