import type { Service } from "@/lib/cms/types";

/* ============================================================================
   SERVICE CATALOGUE

   Thirteen services across four divisions. Each carries the full detail set the
   service template renders: overview, benefits, sectors, method, plant, safety
   controls and related work. Everything here is editable in the portal.
   ========================================================================= */

export const services: Service[] = [
  /* --- EARTHMOVING ------------------------------------------------------- */
  {
    id: "svc-bulk-earthworks",
    slug: "bulk-earthworks",
    division: "earthmoving",
    title: "Bulk Excavation & Overburden Stripping",
    summary:
      "Opening and advancing the cut — topsoil, softs and hard overburden moved to plan, on volume and on schedule.",
    overview:
      "Bulk earthworks is where a mining plan becomes a working face. We strip topsoil to the depth the rehabilitation plan calls for and stockpile it separately, then take the softs and weathered material down to the coal or ore horizon in benches that the geotechnical parameters allow.\n\nProduction is measured, not estimated. Every fleet runs against a survey-set target, cycle times are logged per shift, and volumes are reconciled against the surveyor's month-end. When the plan changes — and on a live pit it always does — we re-sequence with the mine planner rather than pushing on to a stale target.\n\nWe work to the client's slope design and no further. Where the face is close to a highwall, a road or a servitude, the sequence goes through a documented change-control before a machine moves.",
    icon: "excavation",
    image: "excavator-coal-bench-fleet",
    gallery: ["excavator-adt-loading-coal", "liebherr-excavator-standby", "dozer-lowbed-loadout-pit"],
    benefits: [
      {
        title: "Volumes reconciled to survey",
        description:
          "Monthly volumes are signed off against the client surveyor's pick-up, not against our own count. What you are invoiced for is what was moved.",
      },
      {
        title: "Fleet matched to the cut",
        description:
          "Excavator, hauler and dozer sizes are matched to haul distance and bench height so you are not paying for a fleet that spends the shift waiting.",
      },
      {
        title: "Selective stripping protects rehab",
        description:
          "Topsoil and subsoil are lifted and stockpiled separately, which keeps the closure liability where it should be and avoids a rehandle later.",
      },
      {
        title: "Production reported daily",
        description:
          "Shift volumes, machine hours, availability and standing time reach your production meeting the next morning in the format your team already uses.",
      },
    ],
    industries: ["mining", "construction", "government", "industrial"],
    process: [
      {
        id: "be-1",
        step: 1,
        title: "Site walk and survey pick-up",
        description:
          "We walk the area with your surveyor and planner, agree the design surface, mark services and no-go zones, and lift a starting survey both parties sign.",
        duration: "1–2 days",
      },
      {
        id: "be-2",
        step: 2,
        title: "Method statement and risk assessment",
        description:
          "Sequence, fleet, slope angles, edge protection and traffic management are written up and submitted for approval by mine SHE before mobilisation.",
        duration: "3–5 days",
      },
      {
        id: "be-3",
        step: 3,
        title: "Mobilisation",
        description:
          "Plant is transported in on lowbed, inspected on arrival, and operators are inducted onto the site's rules before a machine turns a track.",
        duration: "2–4 days",
      },
      {
        id: "be-4",
        step: 4,
        title: "Production",
        description:
          "Benches advance to the agreed sequence. Volumes, hours and availability are logged per shift and reported daily.",
        duration: "Per programme",
      },
      {
        id: "be-5",
        step: 5,
        title: "Survey close-out and handover",
        description:
          "Final surface is surveyed, reconciled against the design, and handed over with as-built data and the volume reconciliation pack.",
        duration: "3–5 days",
      },
    ],
    equipment: [
      { name: "Tracked excavators", detail: "30 t to 75 t class for bench loading and bulk cut" },
      { name: "Track-type tractors", detail: "D8 to D10 class for stripping, ripping and push" },
      { name: "Articulated dump trucks", detail: "30 t to 40 t class matched to haul length" },
      { name: "Motor graders", detail: "Bench and ramp trim, surface maintenance" },
      { name: "Vibratory rollers", detail: "Compaction on ramps and platforms" },
    ],
    safety: [
      "Edge protection and berms to the mine's standard before any machine works within a bench length of a crest",
      "Traffic management plan and right-of-way rules agreed with the mine before mobilisation",
      "Daily pre-start inspections logged per machine, defects locked out until repaired",
      "Spotters and exclusion zones wherever plant works near people, services or structures",
      "Slope monitoring parameters observed; work stops on any deviation and resumes only on geotech clearance",
    ],
    relatedSlugs: ["haul-road-construction", "materials-handling", "plant-hire"],
    availability: "Continuous production shifts, 7 days",
    featured: true,
    order: 1,
  },
  {
    id: "svc-haul-road-construction",
    slug: "haul-road-construction",
    division: "earthmoving",
    title: "Haul Road Construction & Maintenance",
    summary:
      "Roads built and held to a standard that protects your tyre and suspension spend as much as your cycle times.",
    overview:
      "A haul road is the cheapest productivity gain on most sites and the most expensive thing to neglect. Rolling resistance costs fuel on every cycle, and a poor surface destroys tyres and struts long before their hours are up.\n\nWe build to a layer design — subgrade preparation, selected layer, wearing course — with cross-fall and drainage that actually sheds water rather than collecting it in the wheel path. Once built, roads are held: graded on a set frequency, watered to the dust limit, potholes and corrugation cut out before they spread.\n\nThe same crews build ramps, tip heads and workshop platforms, so the standard does not change when the work moves off the main haul route.",
    icon: "haul-road",
    image: "dozer-d9t-dusk",
    gallery: ["water-bowser-dust-suppression", "dozer-d10t-refurbished", "excavator-coal-bench-fleet"],
    benefits: [
      {
        title: "Rolling resistance controlled",
        description:
          "A maintained wearing course and correct cross-fall cut fuel burn and cycle time on every load that crosses it.",
      },
      {
        title: "Tyre and strut life protected",
        description:
          "Cutting rock out of the wheel path and holding the profile is the difference between a tyre reaching its hours and failing early.",
      },
      {
        title: "Drainage designed in",
        description:
          "Cross-fall, table drains and mitre drains are built with the road, not added after the first rain takes the surface off.",
      },
      {
        title: "Dust suppressed to the limit",
        description:
          "Water bowsers on a set circuit keep visibility and the dust fallout limit in hand without over-watering into a slip hazard.",
      },
    ],
    industries: ["mining", "construction", "government", "industrial"],
    process: [
      {
        id: "hr-1",
        step: 1,
        title: "Route and layer design",
        description:
          "Alignment, gradient, width and layer works are set against the largest vehicle on the route and the material available on site.",
        duration: "3–7 days",
      },
      {
        id: "hr-2",
        step: 2,
        title: "Subgrade and layer works",
        description:
          "Subgrade is proof-rolled, soft spots removed, and selected layers placed and compacted to the density specification.",
        duration: "Per length",
      },
      {
        id: "hr-3",
        step: 3,
        title: "Wearing course and drainage",
        description:
          "Wearing course placed to design thickness with cross-fall trimmed, table and mitre drains cut, and berms formed to the mine standard.",
        duration: "Per length",
      },
      {
        id: "hr-4",
        step: 4,
        title: "Maintenance cycle",
        description:
          "Grader and water bowser circuits run to an agreed frequency, with defects logged and cut out before they propagate.",
        duration: "Ongoing",
      },
    ],
    equipment: [
      { name: "Motor graders", detail: "Blade trim, cross-fall and drain cutting" },
      { name: "Water bowsers", detail: "16 000 L to 20 000 L for dust suppression circuits" },
      { name: "Vibratory rollers", detail: "Smooth drum and padfoot for layer compaction" },
      { name: "Tracked excavators", detail: "Drain excavation and berm forming" },
      { name: "Articulated dump trucks", detail: "Layer material haul" },
    ],
    safety: [
      "Berms maintained to half the tyre height of the largest vehicle on the route",
      "Traffic accommodation and pilot vehicles wherever maintenance runs on a live haul route",
      "Water application controlled to avoid creating a slip hazard on gradient",
      "Night work only under adequate lighting with reflective delineation in place",
    ],
    relatedSlugs: ["bulk-earthworks", "site-services", "plant-hire"],
    availability: "Construction programmes and standing maintenance contracts",
    featured: true,
    order: 2,
  },
  {
    id: "svc-plant-hire",
    slug: "plant-hire",
    division: "earthmoving",
    title: "Plant Hire — Wet & Dry",
    summary:
      "Dozers, excavators, haulers and support plant on hire, with or without operators, mobilised on low-bed to your site.",
    overview:
      "Plant hire is the division the business is named for. Machines go out wet — with a competent, inducted operator and full maintenance carried by us — or dry, where your operators run the machine and we carry the major component risk.\n\nEvery unit leaves the yard on a signed condition report with hour meter, fluid levels, fire suppression and safety equipment recorded. It comes back the same way, so hire disputes are settled by a document rather than an argument.\n\nBecause the workshop is ours, a machine on hire is not waiting on a third party when something fails. The mobile units carry the parts that most often stop a machine, and the yard is inside the OEM corridor for everything else.",
    icon: "plant-hire",
    image: "dozer-d10t-refurbished",
    gallery: ["dozer-lowbed-haul-road", "adt-lowbed-quarry-delivery", "liebherr-excavator-standby", "adt-lowbed-transport-dusk"],
    benefits: [
      {
        title: "Wet hire with inducted operators",
        description:
          "Operators arrive with medicals, competencies and inductions in order, so the machine is producing on day one instead of sitting at the gate.",
      },
      {
        title: "Maintenance carried by us",
        description:
          "On wet hire, servicing, component risk and breakdown response sit with Leikah. Your cost per hour is the rate, not the rate plus surprises.",
      },
      {
        title: "Condition reports both ways",
        description:
          "Signed off-hire and on-hire inspections with photographs remove the argument at the end of a contract.",
      },
      {
        title: "Mobilisation handled end to end",
        description:
          "Low-bed transport, abnormal-load arrangements and site delivery are ours to organise, not another vendor for you to chase.",
      },
    ],
    industries: ["mining", "construction", "industrial", "government", "commercial"],
    process: [
      {
        id: "ph-1",
        step: 1,
        title: "Requirement and availability",
        description:
          "We confirm machine class, attachment, hours per month, haul profile and site access, then confirm availability against the fleet board.",
        duration: "Same day",
      },
      {
        id: "ph-2",
        step: 2,
        title: "Rate and terms",
        description:
          "Written rate covering wet or dry, minimum hours, fuel basis, mobilisation and standing time. No verbal rates.",
        duration: "24–48 hours",
      },
      {
        id: "ph-3",
        step: 3,
        title: "Pre-delivery inspection",
        description:
          "Machine is serviced, safety equipment checked, fire suppression certified, and a photographic condition report is issued before loading.",
        duration: "1–2 days",
      },
      {
        id: "ph-4",
        step: 4,
        title: "Mobilisation and induction",
        description:
          "Low-bed delivery to site, unloading under a lift plan where required, operator induction and hand-over signed on site.",
        duration: "1–3 days",
      },
      {
        id: "ph-5",
        step: 5,
        title: "In-service support",
        description:
          "Scheduled services carried out on site to the hour meter, with breakdown response on the 24-hour line for the duration of the hire.",
        duration: "Duration of hire",
      },
    ],
    equipment: [
      { name: "Track-type tractors", detail: "D6 through D10 class, ripper-equipped where required" },
      { name: "Tracked excavators", detail: "20 t to 75 t class, bucket or hammer" },
      { name: "Articulated dump trucks", detail: "25 t to 40 t class" },
      { name: "Motor graders", detail: "Haul road and platform work" },
      { name: "Front-end loaders", detail: "Stockpile and load-out duty" },
      { name: "Water bowsers and service trucks", detail: "Dust suppression and in-field servicing" },
    ],
    safety: [
      "Operators supplied with current medicals, competency certificates and site inductions",
      "Fire suppression and first-aid equipment certified before every dispatch",
      "Lift plans for any offload requiring a crane or lifting equipment",
      "Abnormal load permits and escorts arranged where the load requires them",
      "Daily pre-use inspections recorded by the operator and countersigned by the site supervisor",
    ],
    relatedSlugs: ["bulk-earthworks", "breakdown-response", "preventive-maintenance"],
    availability: "Short-term, monthly and contract hire",
    featured: true,
    order: 3,
  },
  {
    id: "svc-materials-handling",
    slug: "materials-handling",
    division: "earthmoving",
    title: "Bulk Materials Handling & Stockpiling",
    summary:
      "Load-out, rehandle, stockpile construction and tip-head management kept clear of the production fleet.",
    overview:
      "Material that is stockpiled badly costs twice — once to build the pile and again to rehandle it. We build stockpiles to a shape that drains, stays stable and can be reclaimed without a machine working under an unsupported face.\n\nLoad-out crews work to your despatch schedule, with weighbridge tickets reconciled daily. Tip heads are kept trimmed and bermed so haulers can turn and tip without a spotter having to improvise.\n\nWhere material is contaminated or segregated by grade, the sequence is planned so grades do not mix in the pile — the cheapest quality control there is.",
    icon: "materials",
    image: "excavator-adt-loading-coal",
    gallery: ["excavator-coal-bench-fleet", "adt-lowbed-quarry-delivery"],
    benefits: [
      {
        title: "Rehandle designed out",
        description:
          "Stockpiles are placed and shaped for the way the material will be reclaimed, which removes a whole handling step from the cost.",
      },
      {
        title: "Grades kept separate",
        description:
          "Sequencing and pad layout stop grades contaminating each other, protecting the product before it reaches the plant.",
      },
      {
        title: "Tip heads kept safe",
        description:
          "Trimmed, bermed and lit tip heads let haulers cycle without hesitation, which is both a safety and a throughput gain.",
      },
      {
        title: "Despatch reconciled daily",
        description:
          "Weighbridge tickets and loader counts are reconciled every day, not at month end when nobody can reconstruct the difference.",
      },
    ],
    industries: ["mining", "industrial", "construction", "warehouse"],
    process: [
      {
        id: "mh-1",
        step: 1,
        title: "Pad and stockpile layout",
        description:
          "Pads are set out for drainage, stability and reclaim access, with grade separation planned in from the start.",
        duration: "2–4 days",
      },
      {
        id: "mh-2",
        step: 2,
        title: "Build sequence",
        description:
          "Material is placed in lifts that keep the face reclaimable and the pile stable, with tip heads bermed and trimmed as they advance.",
        duration: "Ongoing",
      },
      {
        id: "mh-3",
        step: 3,
        title: "Load-out and despatch",
        description:
          "Loaders and excavators work to the despatch schedule, with tickets reconciled against loader counts daily.",
        duration: "Per schedule",
      },
      {
        id: "mh-4",
        step: 4,
        title: "Stock reconciliation",
        description:
          "Monthly survey of stockpile volumes against system stock, with variances investigated rather than absorbed.",
        duration: "Monthly",
      },
    ],
    equipment: [
      { name: "Front-end loaders", detail: "Load-out and pile shaping" },
      { name: "Tracked excavators", detail: "Reclaim and selective handling" },
      { name: "Articulated dump trucks", detail: "Rehandle and tip-head feed" },
      { name: "Track-type tractors", detail: "Pile trimming and pad preparation" },
    ],
    safety: [
      "No machine works under an unsupported or over-steepened stockpile face",
      "Tip heads bermed to the mine standard and inspected before every shift",
      "Spotters and radio protocols wherever loaders and haulers share a load-out area",
      "Dust suppression maintained across load-out and tipping points",
    ],
    relatedSlugs: ["bulk-earthworks", "haul-road-construction", "site-services"],
    availability: "Shift-based and contract",
    featured: false,
    order: 4,
  },
  {
    id: "svc-site-establishment",
    slug: "site-establishment",
    division: "earthmoving",
    title: "Site Clearing, Terracing & Rehabilitation",
    summary:
      "Greenfield clearing, platform terracing and closure earthworks — from first cut to the profile the closure plan calls for.",
    overview:
      "Site establishment sets the cost of everything that follows. Clearing, grubbing and terracing done to the right levels means the civils contractor is not correcting your work before starting their own.\n\nOn the other end of the life cycle, rehabilitation earthworks return the profile to the closure plan: voids shaped, slopes battered to a stable angle, topsoil replaced from the stockpiles lifted at the start.\n\nBoth ends of that cycle need the same discipline — survey control, documented levels, and a handover pack that stands up when the regulator or the next contractor asks what was done.",
    icon: "excavation",
    image: "dozer-lowbed-loadout-pit",
    gallery: ["dozer-d9t-dusk", "excavator-coal-bench-fleet"],
    benefits: [
      {
        title: "Platforms to survey level",
        description:
          "Terraces and platforms are trimmed to design level and tolerance, so the following trade builds rather than corrects.",
      },
      {
        title: "Topsoil banked for closure",
        description:
          "Topsoil lifted at establishment is stockpiled and protected, which is what makes rehabilitation affordable years later.",
      },
      {
        title: "Slopes battered to a stable angle",
        description:
          "Closure profiles are shaped to the angle the geotechnical report specifies, not the angle the machine finds easiest.",
      },
      {
        title: "Handover pack that stands up",
        description:
          "As-built survey, level sheets and photographic records are handed over as a set, ready for the regulator or the next contractor.",
      },
    ],
    industries: ["mining", "construction", "government", "commercial", "industrial"],
    process: [
      {
        id: "se-1",
        step: 1,
        title: "Clearing and grubbing",
        description:
          "Vegetation cleared and stumped, with material separated for chipping, burning or disposal per the environmental authorisation.",
        duration: "Per area",
      },
      {
        id: "se-2",
        step: 2,
        title: "Topsoil strip and stockpile",
        description:
          "Topsoil lifted to the depth specified and stockpiled in protected berms, seeded where it will stand for a season or more.",
        duration: "Per area",
      },
      {
        id: "se-3",
        step: 3,
        title: "Bulk cut and terracing",
        description:
          "Platforms cut and filled to design level, compacted in layers where they will carry structures or traffic.",
        duration: "Per programme",
      },
      {
        id: "se-4",
        step: 4,
        title: "Trim, survey and handover",
        description:
          "Final trim to tolerance, as-built survey lifted, and the level and photographic pack issued on handover.",
        duration: "3–7 days",
      },
    ],
    equipment: [
      { name: "Track-type tractors", detail: "Clearing, stripping and bulk push" },
      { name: "Tracked excavators", detail: "Grubbing, trenching and slope shaping" },
      { name: "Motor graders", detail: "Platform trim to level" },
      { name: "Vibratory rollers", detail: "Layer compaction on structural fill" },
      { name: "Articulated dump trucks", detail: "Cut-to-fill haul" },
    ],
    safety: [
      "Services located and proved before any excavation begins",
      "Environmental authorisation conditions briefed to every operator on the crew",
      "Dust and noise controls maintained where work is near occupied property",
      "Erosion protection installed on exposed slopes ahead of the rain season",
    ],
    relatedSlugs: ["bulk-earthworks", "haul-road-construction", "materials-handling"],
    availability: "Project programmes",
    featured: false,
    order: 5,
  },

  /* --- MECHANICAL --------------------------------------------------------- */
  {
    id: "svc-engine-overhauls",
    slug: "engine-overhauls",
    division: "mechanical",
    title: "Heavy Diesel Engine Overhauls",
    summary:
      "Full strip, measure, machine and rebuild of heavy diesel engines to OEM specification, returned with a warranty and the report to back it.",
    overview:
      "An engine that comes into the July Street workshop is stripped completely, cleaned, and measured before a single part is ordered. Bores, journals, decks and bearing housings are gauged against OEM limits and the findings go into a written strip report — you approve the rebuild scope knowing what is actually wrong, not what somebody guessed on the phone.\n\nMachining is done through established engineering houses in the Middelburg corridor. Bearings, seals, gaskets, injectors and pumps are OEM or OEM-approved equivalents, and the substitution is disclosed rather than buried in a line item.\n\nOn assembly, torque and clearance are recorded at every critical joint. The engine is run, timed and load-checked before it leaves, and it goes out with the strip report, the parts schedule and the run sheet.",
    icon: "engine",
    image: "engine-flywheel-housing",
    gallery: [
      "diesel-engine-workshop-strip",
      "engine-block-machined",
      "timing-gear-train-assembly",
      "reconditioned-block-lifted",
      "powertrain-assembly-bench",
    ],
    benefits: [
      {
        title: "Quoted after strip, not before",
        description:
          "You approve a scope built on measured findings. No open-ended rebuild that grows every week you ask about it.",
      },
      {
        title: "Torque and clearance recorded",
        description:
          "Every critical joint is recorded on the build sheet. If something is queried later, there is a number to check it against.",
      },
      {
        title: "Parts disclosed line by line",
        description:
          "OEM or approved-equivalent is stated per item. You know exactly what went into the engine you are paying for.",
      },
      {
        title: "Run and load-tested before release",
        description:
          "The engine is run, timed and checked under load in the workshop, so the first time it works hard is not on your face.",
      },
    ],
    industries: ["mining", "industrial", "construction", "factories", "commercial"],
    process: [
      {
        id: "eo-1",
        step: 1,
        title: "Receive, log and strip",
        description:
          "Unit is received against a job card, photographed, and stripped completely with components tagged to the job.",
        duration: "2–4 days",
      },
      {
        id: "eo-2",
        step: 2,
        title: "Clean, crack-test and measure",
        description:
          "Components are cleaned, crack-tested where specified, and dimensionally measured against OEM service limits.",
        duration: "3–5 days",
      },
      {
        id: "eo-3",
        step: 3,
        title: "Strip report and quotation",
        description:
          "Findings, photographs and a line-by-line parts schedule are issued for approval before any machining or ordering starts.",
        duration: "1–2 days",
      },
      {
        id: "eo-4",
        step: 4,
        title: "Machining and parts",
        description:
          "Machining is carried out through the engineering corridor on our doorstep; parts are drawn from OEM channels in Middelburg and Witbank.",
        duration: "5–15 days",
      },
      {
        id: "eo-5",
        step: 5,
        title: "Assembly to build sheet",
        description:
          "Assembly proceeds with torque, clearance and end-float recorded at every critical joint on a signed build sheet.",
        duration: "4–8 days",
      },
      {
        id: "eo-6",
        step: 6,
        title: "Run, test and release",
        description:
          "Engine is run, timed, load-checked and released with the strip report, parts schedule, build sheet and warranty terms.",
        duration: "1–2 days",
      },
    ],
    equipment: [
      { name: "Engine stands and rotators", detail: "Full-rotation assembly of in-line and vee blocks" },
      { name: "Overhead lifting", detail: "Rated lifting across the workshop bays for block and head handling" },
      { name: "Precision measuring", detail: "Bore gauges, micrometers, dial indicators, straight edges" },
      { name: "Torque and angle equipment", detail: "Calibrated wrenches and angle gauges to OEM procedure" },
      { name: "Cleaning and crack detection", detail: "Component wash and dye-penetrant inspection" },
    ],
    safety: [
      "Lifting done only on rated, inspected equipment with a competent rigger",
      "Isolation and lock-out applied before any work on an installed engine",
      "Waste oil, coolant and filters handled under the workshop's environmental controls",
      "Hot work permits and fire watch for any welding or cutting in the bays",
    ],
    relatedSlugs: ["powertrain-rebuilds", "preventive-maintenance", "breakdown-response"],
    availability: "Workshop programme with agreed turnaround",
    featured: true,
    order: 6,
  },
  {
    id: "svc-powertrain-rebuilds",
    slug: "powertrain-rebuilds",
    division: "mechanical",
    title: "Transmission & Final Drive Rebuilds",
    summary:
      "Powershift transmissions, differentials, final drives and torque converters rebuilt, tested and returned ready to fit.",
    overview:
      "Powertrain work is unforgiving of shortcuts. A clutch pack set outside tolerance or a pre-load taken by feel rather than by gauge will come back, usually at the worst moment.\n\nWe strip transmissions, differentials and final drives completely, measure every wear surface, and rebuild to the OEM clearance and pre-load figures. Bearings are set with the specified pre-load, backlash is dialled and recorded, and shift pressures are checked on the bench where the unit allows it.\n\nUnits are painted, sealed, tagged and palletised for transport, and they go out with the same documentation set as an engine rebuild.",
    icon: "engine",
    image: "adt-transmission-assembly",
    gallery: ["transmission-housing-overhaul", "final-drive-rebuild-complete", "engine-block-machined"],
    benefits: [
      {
        title: "Clearances measured, not judged",
        description:
          "Backlash, end-float and pre-load are set to the OEM figure with a gauge and written on the build sheet.",
      },
      {
        title: "Wear surfaces assessed honestly",
        description:
          "If a housing or a carrier is past its limit, we say so in the strip report rather than building a unit that will fail early.",
      },
      {
        title: "Bench-tested where possible",
        description:
          "Shift pressure and rotation are checked before dispatch on units that can be tested off the machine.",
      },
      {
        title: "Ready to fit on arrival",
        description:
          "Units arrive sealed, tagged, palletised and with the correct fitting hardware, so the fitment crew is not waiting on a missing item.",
      },
    ],
    industries: ["mining", "industrial", "construction", "commercial"],
    process: [
      {
        id: "pt-1",
        step: 1,
        title: "Receive and strip",
        description:
          "Unit logged, drained, stripped and components tagged with the job number and position.",
        duration: "2–3 days",
      },
      {
        id: "pt-2",
        step: 2,
        title: "Measure and report",
        description:
          "Gears, shafts, bearings, carriers and housings measured against service limits; findings and photographs issued for approval.",
        duration: "2–4 days",
      },
      {
        id: "pt-3",
        step: 3,
        title: "Rebuild to specification",
        description:
          "Assembly with new bearings, seals and friction material, with backlash, end-float and pre-load set and recorded.",
        duration: "4–10 days",
      },
      {
        id: "pt-4",
        step: 4,
        title: "Test, seal and dispatch",
        description:
          "Rotation and pressure checks where applicable, then painted, sealed, tagged and palletised for transport to site.",
        duration: "1–2 days",
      },
    ],
    equipment: [
      { name: "Hydraulic presses", detail: "Bearing and bush removal and fitment" },
      { name: "Induction heaters", detail: "Controlled interference fits without flame damage" },
      { name: "Dial and backlash gauges", detail: "Setting and recording gear backlash and end-float" },
      { name: "Torque multipliers", detail: "High-torque fastener control on carriers and hubs" },
      { name: "Overhead lifting", detail: "Rated handling of complete transmission assemblies" },
    ],
    safety: [
      "Stored-energy components released under controlled conditions before strip",
      "Rated slings and lifting points used for every component lift",
      "Press work carried out behind guarding with the correct support fixtures",
      "Waste oil and friction material disposed of through licensed channels",
    ],
    relatedSlugs: ["engine-overhauls", "hydraulic-services", "preventive-maintenance"],
    availability: "Workshop programme with agreed turnaround",
    featured: true,
    order: 7,
  },
  {
    id: "svc-hydraulic-services",
    slug: "hydraulic-services",
    division: "mechanical",
    title: "Hydraulic Systems, Cylinders & Hose",
    summary:
      "Cylinder re-lining, pump and valve bank overhaul, and hose assemblies crimped on site or in the workshop.",
    overview:
      "Most hydraulic call-outs are not a failed pump. They are a hose that chafed through, a seal that let go, or contamination that has been circulating for weeks. Fault-finding starts with pressure and flow readings, not with a parts order.\n\nCylinders are stripped, honed and re-lined where the bore allows, with new seal kits and rechromed or replaced rods. Pumps, motors and valve banks are overhauled and set to the correct standby and relief pressures.\n\nHose assemblies are crimped to SAE and EN specification, either at the workshop or from the mobile units on site, so a burst hose is measured, made and fitted in one visit rather than three.",
    icon: "hydraulics",
    image: "hydraulic-hose-replacement",
    gallery: ["hydraulic-valve-bank-inspection", "field-service-excavator-repair"],
    benefits: [
      {
        title: "Diagnosis before parts",
        description:
          "Pressure and flow are measured first. You are not billed for a pump that was never the problem.",
      },
      {
        title: "Hoses made on site",
        description:
          "Mobile units carry hose, fittings and a crimper, so a burst line is measured, made and fitted in the same visit.",
      },
      {
        title: "Contamination taken seriously",
        description:
          "Systems are flushed and filtration addressed, because putting a clean component into a dirty system just buys another failure.",
      },
      {
        title: "Pressures set and recorded",
        description:
          "Standby, relief and pilot pressures are set to specification and written down, so the next technician has a baseline.",
      },
    ],
    industries: ["mining", "industrial", "factories", "construction", "commercial"],
    process: [
      {
        id: "hy-1",
        step: 1,
        title: "Pressure and flow diagnosis",
        description:
          "System is tested under load with gauges and flow meters to isolate the actual fault before anything is removed.",
        duration: "Hours",
      },
      {
        id: "hy-2",
        step: 2,
        title: "Component removal and strip",
        description:
          "Affected cylinder, pump, motor or valve bank is removed under controlled depressurisation and stripped for assessment.",
        duration: "1–3 days",
      },
      {
        id: "hy-3",
        step: 3,
        title: "Overhaul",
        description:
          "Bores honed, rods rechromed or replaced, seal kits renewed, valve spools and pump internals assessed and replaced as measured.",
        duration: "3–10 days",
      },
      {
        id: "hy-4",
        step: 4,
        title: "Flush, refit and set",
        description:
          "System flushed, filtration renewed, component refitted, and pressures set and recorded against specification.",
        duration: "1–2 days",
      },
    ],
    equipment: [
      { name: "Hose crimping machines", detail: "Workshop and mobile crimpers to SAE and EN specification" },
      { name: "Honing and cylinder benches", detail: "Cylinder strip, hone and reassembly" },
      { name: "Pressure and flow test gear", detail: "Load testing and pressure setting on the machine" },
      { name: "Filtration and flush units", detail: "System decontamination after a component failure" },
      { name: "Seal and fitting stock", detail: "Common seal kits and fittings carried on the mobile units" },
    ],
    safety: [
      "Systems depressurised and stored energy released before any line is broken",
      "Fluid injection hazards briefed; no leak is ever traced by hand",
      "Spill kits deployed at every break point and used oil captured for licensed disposal",
      "Hot surfaces and pressurised accumulators isolated before work begins",
    ],
    relatedSlugs: ["breakdown-response", "engine-overhauls", "preventive-maintenance"],
    availability: "Workshop and 24-hour mobile",
    featured: true,
    order: 8,
  },
  {
    id: "svc-preventive-maintenance",
    slug: "preventive-maintenance",
    division: "mechanical",
    title: "Planned Maintenance Contracts",
    summary:
      "Scheduled servicing, oil sampling and condition monitoring that catches failures while they are still a service, not a rebuild.",
    overview:
      "Unplanned failure costs several times what the same repair costs when it is planned. A planned maintenance contract puts servicing on the hour meter and inspection on a schedule, so components are changed on evidence rather than after they let go.\n\nOil sampling is the backbone. Wear metals, silicon and viscosity are trended per component, and a rising trend triggers an inspection long before a bearing surfaces in a filter. Undercarriage and wear-plate measurements are logged the same way, which turns replacement into a budgeted item.\n\nEach contract carries a service matrix per machine, agreed intervals, an escalation path and a monthly report your maintenance planner can put straight into their own system.",
    icon: "preventive",
    image: "diesel-engine-workshop-strip",
    gallery: ["engine-flywheel-housing", "adt-transmission-assembly", "hydraulic-valve-bank-inspection"],
    benefits: [
      {
        title: "Failures caught on trend",
        description:
          "Oil analysis and wear measurement flag a developing failure while it is still a service item instead of a rebuild.",
      },
      {
        title: "Budget you can forecast",
        description:
          "Component replacement moves from unpredictable emergency spend to a scheduled line in next quarter's budget.",
      },
      {
        title: "Availability that holds",
        description:
          "Servicing planned around your production schedule keeps machines out of the workshop during the hours you need them.",
      },
      {
        title: "Reporting your planner can use",
        description:
          "Monthly reports come in a format that drops into your maintenance system rather than sitting in an inbox as a PDF.",
      },
    ],
    industries: ["mining", "industrial", "factories", "warehouse", "commercial", "government"],
    process: [
      {
        id: "pm-1",
        step: 1,
        title: "Fleet audit",
        description:
          "Every machine is inspected and recorded — hours, condition, outstanding defects and current service position.",
        duration: "3–7 days",
      },
      {
        id: "pm-2",
        step: 2,
        title: "Service matrix and intervals",
        description:
          "A matrix per machine sets service intervals, tasks, parts and consumables, agreed against your production calendar.",
        duration: "3–5 days",
      },
      {
        id: "pm-3",
        step: 3,
        title: "Scheduled execution",
        description:
          "Services carried out on site or in the workshop to the hour meter, with job cards signed and defects logged.",
        duration: "Ongoing",
      },
      {
        id: "pm-4",
        step: 4,
        title: "Sampling and trending",
        description:
          "Oil samples drawn each service, results trended per component, and exceedances escalated with a recommended action.",
        duration: "Per interval",
      },
      {
        id: "pm-5",
        step: 5,
        title: "Monthly review",
        description:
          "Availability, cost per hour, defect backlog and upcoming component changes reviewed with your planner every month.",
        duration: "Monthly",
      },
    ],
    equipment: [
      { name: "Mobile service units", detail: "On-site servicing with fluid transfer and waste capture" },
      { name: "Oil sampling kits", detail: "Sealed sampling with laboratory turnaround and trending" },
      { name: "Undercarriage gauges", detail: "Wear measurement for planned undercarriage replacement" },
      { name: "Diagnostic laptops", detail: "OEM fault code retrieval and parameter checks" },
      { name: "Thermal and vibration tools", detail: "Condition monitoring on rotating equipment" },
    ],
    safety: [
      "Isolation and lock-out before any service task on a machine",
      "Waste oil, filters and rags captured on site and disposed of through licensed contractors",
      "Working-at-height controls for servicing on large plant decks",
      "Fire suppression and extinguisher inspections included in every scheduled service",
    ],
    relatedSlugs: ["engine-overhauls", "breakdown-response", "plant-hire"],
    availability: "Contract, aligned to your production calendar",
    featured: true,
    order: 9,
  },
  {
    id: "svc-fabrication-repair",
    slug: "fabrication-repair",
    division: "mechanical",
    title: "Structural Repair & Fabrication",
    summary:
      "Crack repair, wear-plate renewal, bucket and body rebuilds, and fabricated equipment built to drawing.",
    overview:
      "Structures on mining plant crack. Booms, chassis, bins and buckets carry cyclic loads their whole life, and the repair matters as much as the weld. Cracks are ground out, prepared, welded to a documented procedure and, where the load path warrants it, reinforced rather than simply filled.\n\nWear management is the other half: liner and wear-plate renewal on buckets, bins and chutes, with the plate specified to the abrasion actually seen rather than to whatever is in stock.\n\nThe fabrication bay also builds to drawing — diesel bowsers, service bodies, skids, stands and site equipment — with materials certified and welds carried out by coded welders.",
    icon: "fabrication",
    image: "fabrication-team-bowser",
    gallery: ["parts-dispatch-pallet", "final-drive-rebuild-complete"],
    benefits: [
      {
        title: "Repairs to a written procedure",
        description:
          "Preparation, consumable, pass sequence and pre-heat are specified per repair rather than left to the welder on the day.",
      },
      {
        title: "Reinforced where the load says so",
        description:
          "A crack that keeps returning is a design problem. Where the load path warrants it, we reinforce instead of re-welding the same seam.",
      },
      {
        title: "Wear plate matched to the duty",
        description:
          "Plate grade is specified to the abrasion actually seen on your material, which is what makes a liner last its intended life.",
      },
      {
        title: "Built to drawing, certified",
        description:
          "Fabricated equipment is built to drawing with material certificates and coded welders, and handed over with the documentation.",
      },
    ],
    industries: ["mining", "industrial", "factories", "construction", "warehouse"],
    process: [
      {
        id: "fr-1",
        step: 1,
        title: "Inspection and crack detection",
        description:
          "Affected area cleaned and inspected, with dye-penetrant or magnetic-particle testing to establish the true extent.",
        duration: "1 day",
      },
      {
        id: "fr-2",
        step: 2,
        title: "Repair procedure",
        description:
          "Preparation, consumable, pre-heat and pass sequence specified in writing before any arc is struck.",
        duration: "1–2 days",
      },
      {
        id: "fr-3",
        step: 3,
        title: "Execution",
        description:
          "Crack ground out and welded to procedure by coded welders, with reinforcement added where the load path requires it.",
        duration: "Per scope",
      },
      {
        id: "fr-4",
        step: 4,
        title: "Verification and finish",
        description:
          "Repair re-tested, dressed, primed and painted, with the procedure and test results handed over.",
        duration: "1–2 days",
      },
    ],
    equipment: [
      { name: "MIG, MMA and gouging plant", detail: "Structural welding and carbon-arc preparation" },
      { name: "Plate rolling and cutting", detail: "Profile cutting and forming for liners and bodies" },
      { name: "Overhead lifting", detail: "Rated handling of bodies, buckets and fabricated assemblies" },
      { name: "NDT equipment", detail: "Dye-penetrant and magnetic-particle crack detection" },
      { name: "Pre-heat equipment", detail: "Controlled pre-heat and interpass temperature on heavy sections" },
    ],
    safety: [
      "Hot work permits, fire watch and gas testing before any cutting or welding",
      "Fume extraction and respiratory protection in the fabrication bays",
      "Structures supported and cribbed before load-bearing members are cut",
      "Confined-space controls where work is inside a bin, tank or body",
    ],
    relatedSlugs: ["powertrain-rebuilds", "preventive-maintenance", "parts-supply"],
    availability: "Workshop and on site",
    featured: false,
    order: 10,
  },

  /* --- SUPPLY -------------------------------------------------------------- */
  {
    id: "svc-parts-supply",
    slug: "parts-supply",
    division: "supply",
    title: "Parts, Filtration & Consumables",
    summary:
      "Filters, lubricants, hose, undercarriage, ground-engaging tools and workshop consumables, delivered to site.",
    overview:
      "The supply division exists because the yard sits inside one of the densest heavy-engineering corridors in Mpumalanga. OEM dealers, electrical wholesalers, machining houses and spares retailers are all within a short drive of July Street, which turns a two-day parts wait into a same-day collection.\n\nWe supply filtration, lubricants and greases, hydraulic hose and fittings, undercarriage, ground-engaging tools, bearings, seals, fasteners and workshop consumables. Where an OEM part is specified, an OEM part is supplied; where an approved equivalent is appropriate, it is offered as an alternative with the difference stated.\n\nStanding orders can be held against your fleet list so that the consumables your machines actually use are on the shelf before you ask for them.",
    icon: "supply",
    image: "parts-dispatch-pallet",
    gallery: ["fabrication-team-bowser", "diesel-engine-workshop-strip"],
    benefits: [
      {
        title: "Inside the OEM corridor",
        description:
          "The yard sits among the dealers and machining houses, which is why a part that would take days elsewhere is collected the same morning.",
      },
      {
        title: "Equivalents disclosed, never substituted quietly",
        description:
          "If an approved equivalent is offered, it is named on the quote with the price difference shown. Nothing is swapped without you knowing.",
      },
      {
        title: "Standing orders against your fleet",
        description:
          "Service kits are held against your machine list so consumables are on the shelf before the service falls due.",
      },
      {
        title: "Delivered to site",
        description:
          "Parts are palletised, labelled to the machine and job, and delivered to site rather than left for you to collect.",
      },
    ],
    industries: ["mining", "industrial", "construction", "factories", "warehouse", "commercial"],
    process: [
      {
        id: "ps-1",
        step: 1,
        title: "Part identification",
        description:
          "Machine model, serial and application confirmed so the part number is right the first time.",
        duration: "Same day",
      },
      {
        id: "ps-2",
        step: 2,
        title: "Quotation",
        description:
          "Written quote with OEM and approved-equivalent options, lead times and delivery basis stated.",
        duration: "Same day to 24 hours",
      },
      {
        id: "ps-3",
        step: 3,
        title: "Sourcing",
        description:
          "Drawn from stock or collected through the Middelburg and Witbank OEM channels, with lead time confirmed on order.",
        duration: "Same day to 5 days",
      },
      {
        id: "ps-4",
        step: 4,
        title: "Delivery and reconciliation",
        description:
          "Palletised, labelled to machine and job, delivered to site and signed for against the order.",
        duration: "Per schedule",
      },
    ],
    equipment: [
      { name: "Hose assembly bench", detail: "Hydraulic hose made to length while you wait" },
      { name: "Filtration and lubricant stock", detail: "Common service items held for the regional fleet mix" },
      { name: "Delivery vehicles", detail: "Site delivery across the Mpumalanga coalfields" },
      { name: "Forklift and handling", detail: "Palletised despatch and receiving" },
    ],
    safety: [
      "Safety data sheets supplied with every lubricant, chemical and consumable",
      "Loads secured and labelled to the transport regulations before despatch",
      "Hazardous items segregated in storage and transport",
    ],
    relatedSlugs: ["preventive-maintenance", "hydraulic-services", "fabrication-repair"],
    availability: "Mon–Fri 07:00–17:00, Sat 07:00–13:00",
    featured: true,
    order: 11,
  },

  /* --- EMERGENCY ----------------------------------------------------------- */
  {
    id: "svc-breakdown-response",
    slug: "breakdown-response",
    division: "emergency",
    title: "24-Hour Breakdown Response",
    summary:
      "Mobile field service units dispatched day or night, carrying diagnostics, welding, crimping and fluid transfer.",
    overview:
      "Machines do not fail during office hours. The breakdown line is answered around the clock, every day of the year, and a call is logged with the machine, the fault, the site and the access requirements before the unit rolls.\n\nField service vehicles carry diagnostic laptops, welding plant, a hose crimper with hose and fitting stock, fluid transfer and the consumables that resolve the majority of call-outs on the first visit. Where a component has to come off, transport is arranged from the same call rather than as a separate exercise the next morning.\n\nYou get a written fault report after every call-out — what failed, why, what was done, and what should be watched. That report is what stops the same failure recurring next month.",
    icon: "field-service",
    image: "field-service-excavator-repair",
    gallery: ["leikah-response-vehicle", "hydraulic-hose-replacement", "hydraulic-valve-bank-inspection"],
    benefits: [
      {
        title: "Answered around the clock",
        description:
          "The emergency line is a person, every hour of every day, including public holidays. Not a voicemail box checked in the morning.",
      },
      {
        title: "Equipped to finish the job",
        description:
          "Units carry diagnostics, welding, hose crimping and fluid transfer, which is why most call-outs are resolved on the first visit.",
      },
      {
        title: "Recovery arranged on the same call",
        description:
          "If the component has to come off, low-bed and workshop slots are arranged from the same call rather than the next morning.",
      },
      {
        title: "Written fault report every time",
        description:
          "What failed, why, what was done and what to watch — the report is what stops you paying for the same failure twice.",
      },
    ],
    industries: ["mining", "industrial", "factories", "construction", "warehouse", "commercial", "government"],
    process: [
      {
        id: "br-1",
        step: 1,
        title: "Call logged",
        description:
          "Machine, fault symptoms, site, access requirements and site contact captured against a call reference.",
        duration: "Minutes",
      },
      {
        id: "br-2",
        step: 2,
        title: "Triage and dispatch",
        description:
          "Technician and parts matched to the reported fault, and the unit is dispatched with an ETA confirmed to your site contact.",
        duration: "Within the hour",
      },
      {
        id: "br-3",
        step: 3,
        title: "On-site diagnosis",
        description:
          "Machine isolated, fault confirmed by measurement, and the repair scope agreed with your supervisor before work starts.",
        duration: "On arrival",
      },
      {
        id: "br-4",
        step: 4,
        title: "Repair or recover",
        description:
          "Repaired in the field where possible; where not, the component or machine is recovered to July Street on arranged transport.",
        duration: "Same visit",
      },
      {
        id: "br-5",
        step: 5,
        title: "Fault report",
        description:
          "Written report issued covering root cause, work done, parts used and the recommended follow-up action.",
        duration: "24 hours",
      },
    ],
    equipment: [
      { name: "Mobile field service units", detail: "Fully equipped response vehicles with tooling and consumables" },
      { name: "On-board hose crimping", detail: "Hose measured, made and fitted at the machine" },
      { name: "Portable welding plant", detail: "Field repair of structures and mountings" },
      { name: "Diagnostic laptops", detail: "OEM fault codes, live data and parameter checks" },
      { name: "Fluid transfer and capture", detail: "Oil, coolant and fuel transfer with spill containment" },
    ],
    safety: [
      "Machine isolated and locked out before any work begins, without exception",
      "Site induction and permit requirements confirmed before the unit is dispatched",
      "Night work carried out under adequate lighting with reflective delineation",
      "Spill containment deployed before any line, filter or drain plug is opened",
      "Suspended loads and raised implements supported mechanically, never on hydraulics alone",
    ],
    relatedSlugs: ["hydraulic-services", "preventive-maintenance", "plant-hire"],
    availability: "24 hours, 365 days",
    featured: true,
    order: 12,
  },
  {
    id: "svc-site-services",
    slug: "site-services",
    division: "emergency",
    title: "Dewatering & Dust Suppression",
    summary:
      "Pump sets, lay-flat and water bowser circuits that keep the pit dry and the haul road visible.",
    overview:
      "Water in the pit stops production and undermines the highwall. Dust on the haul road is a visibility hazard and, on most operations, a licence condition.\n\nWe install and run dewatering sets — pump, prime mover, lay-flat and discharge — sized to the inflow and the lift, with the discharge routed to the point your water management plan specifies. Sets are monitored and refuelled on a circuit, not left to run until someone notices they have stopped.\n\nDust suppression runs on a water bowser circuit with application rates set to the road, so surfaces stay bound without becoming slippery on gradient.",
    icon: "site-services",
    image: "pit-dewatering-pump-set",
    gallery: ["water-bowser-dust-suppression", "excavator-coal-bench-fleet"],
    benefits: [
      {
        title: "Sets sized to the actual inflow",
        description:
          "Pump and prime mover are matched to inflow and lift, so the set keeps ahead of the water rather than falling behind it.",
      },
      {
        title: "Monitored and refuelled on a circuit",
        description:
          "Sets are checked and refuelled on a schedule, so you find out about a stopped pump from us, not from a flooded bench.",
      },
      {
        title: "Discharge routed to plan",
        description:
          "Discharge goes where your water management plan says it goes, with the routing documented for the environmental file.",
      },
      {
        title: "Dust controlled without creating a slip",
        description:
          "Application rates are set to the road and the gradient, keeping the fallout limit in hand without watering a ramp into a hazard.",
      },
    ],
    industries: ["mining", "construction", "industrial", "government"],
    process: [
      {
        id: "ss-1",
        step: 1,
        title: "Assess inflow and lift",
        description:
          "Inflow rate, static lift and discharge routing established so the set is sized correctly rather than by guess.",
        duration: "1–2 days",
      },
      {
        id: "ss-2",
        step: 2,
        title: "Install and commission",
        description:
          "Pump, prime mover, suction and lay-flat installed, discharge routed to plan, and the set commissioned and proved.",
        duration: "1–3 days",
      },
      {
        id: "ss-3",
        step: 3,
        title: "Run and monitor",
        description:
          "Sets checked, refuelled and serviced on a circuit, with running hours and volumes logged.",
        duration: "Ongoing",
      },
      {
        id: "ss-4",
        step: 4,
        title: "Dust circuit",
        description:
          "Water bowsers run a set circuit at application rates matched to road surface and gradient.",
        duration: "Per shift",
      },
    ],
    equipment: [
      { name: "Diesel-driven pump sets", detail: "Tractor and skid-mounted units sized to inflow" },
      { name: "Lay-flat and suction hose", detail: "Discharge routing across distance and lift" },
      { name: "Water bowsers", detail: "16 000 L to 20 000 L dust suppression circuits" },
      { name: "Fuel and service bowsers", detail: "In-field refuelling of running sets" },
    ],
    safety: [
      "Pump sets bunded and sited clear of the water's edge with safe access maintained",
      "Discharge lines secured and routed clear of traffic and pedestrian routes",
      "Refuelling carried out with spill containment and no running engine",
      "Water application controlled on gradient to avoid creating a slip hazard",
    ],
    relatedSlugs: ["haul-road-construction", "plant-hire", "breakdown-response"],
    availability: "Continuous, with monitored circuits",
    featured: false,
    order: 13,
  },
];
