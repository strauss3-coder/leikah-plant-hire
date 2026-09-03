import type { FleetItem } from "@/lib/cms/types";

/* ============================================================================
   FLEET

   Described by class and duty rather than by unit count or serial number.
   A contractor's fleet list changes month to month, and publishing a number
   that is wrong by the time somebody reads it is worse than publishing none.

   Specifications are the figures a planner actually asks for on a first call:
   operating weight band, what the machine is for, and how it is charged.
   ========================================================================= */

export const fleet: FleetItem[] = [
  {
    id: "fleet-dozers",
    slug: "track-type-tractors",
    name: "Track-Type Tractors",
    category: "Earthmoving",
    icon: "dozer",
    strapline: "Bulk push, ripping and the machine the business is named for",
    description:
      "Dozers do the work that sets up everything else — stripping, bulk push, ripping hard material ahead of the excavators, and trimming the benches and ramps the rest of the fleet runs on. Supplied wet with an operator who has worked a coal face, or dry against your own crew.",
    image: "dozer-d10t-refurbished",
    secondaryImage: "dozer-d9t-dusk",
    specs: [
      { label: "Class", value: "D6 – D10" },
      { label: "Operating weight", value: "20 – 70 t" },
      { label: "Attachments", value: "Semi-U blade, single-shank ripper" },
      { label: "Hire basis", value: "Wet or dry, monthly or contract" },
    ],
    applications: [
      "Topsoil stripping and overburden push",
      "Ripping weathered and hard material",
      "Haul road formation and ramp construction",
      "Stockpile trimming and tip-head maintenance",
    ],
    serviceSlug: "plant-hire",
    order: 1,
  },
  {
    id: "fleet-excavators",
    slug: "tracked-excavators",
    name: "Tracked Excavators",
    category: "Earthmoving",
    icon: "excavator",
    strapline: "The production unit — everything else cycles around it",
    description:
      "The loading tool sets the pace of the whole operation. Excavator class is matched to bench height and hauler size so the fleet cycles cleanly rather than one machine waiting on another. Bucket or hammer, with quick-couplers where the work changes through the shift.",
    image: "excavator-coal-bench-fleet",
    secondaryImage: "liebherr-excavator-standby",
    specs: [
      { label: "Class", value: "20 t – 75 t" },
      { label: "Typical duty", value: "Bench loading, bulk cut, trenching" },
      { label: "Attachments", value: "GP and rock buckets, hydraulic hammer" },
      { label: "Hire basis", value: "Wet or dry, shift or contract" },
    ],
    applications: [
      "Bench loading into haulers",
      "Bulk excavation and selective digging",
      "Drain and services excavation",
      "Breaking with hydraulic hammer",
    ],
    serviceSlug: "bulk-earthworks",
    order: 2,
  },
  {
    id: "fleet-haulers",
    slug: "articulated-haulers",
    name: "Articulated Haulers",
    category: "Earthmoving",
    icon: "hauler",
    strapline: "Matched to the haul, not to whatever is standing idle",
    description:
      "Hauler size is chosen against haul distance, gradient and the loading tool, so passes match the bucket and nobody is paying for a truck that spends the cycle waiting. Articulated units handle the ground conditions a rigid truck cannot.",
    image: "adt-lowbed-quarry-delivery",
    secondaryImage: "excavator-adt-loading-coal",
    specs: [
      { label: "Class", value: "25 t – 40 t payload" },
      { label: "Configuration", value: "6×6 articulated" },
      { label: "Typical duty", value: "Overburden, product, rehandle" },
      { label: "Hire basis", value: "Wet, per shift or contract" },
    ],
    applications: [
      "Overburden haulage to dump",
      "Product haulage to stockpile or plant",
      "Rehandle and rehabilitation material",
      "Layer works material on road construction",
    ],
    serviceSlug: "materials-handling",
    order: 3,
  },
  {
    id: "fleet-graders",
    slug: "motor-graders",
    name: "Motor Graders",
    category: "Site services",
    icon: "grader",
    strapline: "The cheapest productivity gain on most operations",
    description:
      "A maintained haul road cuts fuel burn and cycle time on every load that crosses it, and protects tyre and suspension spend that never appears as a line item until it does. Graders run a set circuit rather than being called when somebody complains.",
    image: "dozer-d9t-dusk",
    secondaryImage: "water-bowser-dust-suppression",
    specs: [
      { label: "Typical duty", value: "Haul road and platform trim" },
      { label: "Circuit", value: "Set frequency, not on complaint" },
      { label: "Works with", value: "Water bowser and roller" },
      { label: "Hire basis", value: "Standing maintenance contract" },
    ],
    applications: [
      "Haul road blading and cross-fall reinstatement",
      "Table and mitre drain cutting",
      "Platform and laydown trim to level",
      "Ramp maintenance on gradient",
    ],
    serviceSlug: "haul-road-construction",
    order: 4,
  },
  {
    id: "fleet-bowsers",
    slug: "water-bowsers",
    name: "Water Bowsers",
    category: "Site services",
    icon: "bowser",
    strapline: "Dust held to the limit without watering a ramp into a hazard",
    description:
      "Application rate is set to the road surface and the gradient rather than applied uniformly, because over-watering a ramp creates exactly the hazard the circuit is meant to remove. Bowsers run to a circuit alongside the grader.",
    image: "water-bowser-dust-suppression",
    specs: [
      { label: "Capacity", value: "16 000 – 20 000 L" },
      { label: "Typical duty", value: "Dust suppression circuits" },
      { label: "Control", value: "Rate set to surface and gradient" },
      { label: "Hire basis", value: "Wet, contract" },
    ],
    applications: [
      "Haul road dust suppression",
      "Load-out and tipping point control",
      "Fallout limit compliance",
      "Fire water on standby",
    ],
    serviceSlug: "site-services",
    order: 5,
  },
  {
    id: "fleet-response",
    slug: "field-service-units",
    name: "Field Service Units",
    category: "Mechanical",
    icon: "hose",
    strapline: "Equipped to close a call-out on the first visit",
    description:
      "A second trip costs another shift. The response vehicles carry diagnostics, welding plant, a hose crimper with hose and fitting stock, fluid transfer with spill containment, and the consumables behind most breakdowns — so the majority of call-outs are finished without going back.",
    image: "leikah-response-vehicle",
    secondaryImage: "field-service-excavator-repair",
    specs: [
      { label: "Availability", value: "24 hours, 365 days" },
      { label: "On board", value: "Diagnostics, welding, hose crimping" },
      { label: "Fluids", value: "Transfer and capture, spill kits" },
      { label: "Response", value: "Dispatched with a confirmed ETA" },
    ],
    applications: [
      "Breakdown response on live benches",
      "Hydraulic hose made and fitted at the machine",
      "Field welding of structures and mountings",
      "Scheduled servicing on site",
    ],
    serviceSlug: "breakdown-response",
    order: 6,
  },
];
