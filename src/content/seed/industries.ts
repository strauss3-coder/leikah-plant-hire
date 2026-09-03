import type { Industry } from "@/lib/cms/types";

/* ============================================================================
   SECTORS

   Each sector describes the operational pressure it actually carries, then maps
   it to the services that answer it. Ordered by weight of work.
   ========================================================================= */

export const industries: Industry[] = [
  {
    id: "ind-mining",
    slug: "mining",
    name: "Mining & Open-Cast",
    summary:
      "Coal and hard-rock operations across the Mpumalanga fields, where a stopped machine is a stopped shift.",
    overview:
      "Open-cast mining is the core of the business. The yard sits in the middle of the Mpumalanga coalfields, and the work is what those operations need every day — advancing the cut, building and holding haul roads, handling product, and keeping a heavy fleet in production.\n\nThe difference on a mine is that everything is measured. Volumes are reconciled to survey, availability is reported per machine, and safety performance is audited by the client rather than self-declared. We work inside that discipline because our contracts depend on it.\n\nDispatch runs around the clock for a reason. A hauler down at two in the morning on a continuous operation is production lost that the month never recovers.",
    image: "excavator-coal-bench-fleet",
    challenges: [
      {
        title: "Unplanned downtime is measured in shifts",
        description:
          "A single failure on a critical machine can cost a full production shift. Planned maintenance and 24-hour response exist to keep that number at zero.",
      },
      {
        title: "Contractor safety performance is audited",
        description:
          "Mine SHE departments audit contractor files, competencies and method statements. Our documentation is built to be audited, not assembled after a request.",
      },
      {
        title: "Haul road condition drives fleet cost",
        description:
          "Rolling resistance, tyre life and suspension spend all trace back to road condition — one of the cheapest levers on the whole operation.",
      },
      {
        title: "Rehabilitation liability accrues from day one",
        description:
          "Topsoil handled correctly at establishment is what makes closure affordable a decade later. It is an earthworks decision, not a closure decision.",
      },
    ],
    serviceSlugs: [
      "bulk-earthworks",
      "haul-road-construction",
      "plant-hire",
      "materials-handling",
      "breakdown-response",
      "preventive-maintenance",
      "site-services",
    ],
    compliance: [
      "Mine Health and Safety Act compliance and contractor induction",
      "Method statements and risk assessments submitted before mobilisation",
      "Operator competencies, medicals and legal appointments current on file",
      "Machine fire suppression and safety equipment certified before dispatch",
    ],
    order: 1,
  },
  {
    id: "ind-construction",
    slug: "construction",
    name: "Construction & Civils",
    summary:
      "Bulk earthworks, platform preparation and plant hire for contractors working to a programme and a penalty clause.",
    overview:
      "Civil contractors need plant that arrives when the programme says it will and works the hours it was hired for. Late mobilisation and unreliable machines cost the main contractor far more than the hire rate.\n\nWe supply plant wet or dry into civil programmes, and take on the bulk earthworks package directly where that is simpler for the contractor. Levels are worked to survey control and handed over with as-built data the engineer can sign.\n\nWhere a project runs to a tight float, planned servicing is scheduled around the critical path rather than into it.",
    image: "dozer-lowbed-loadout-pit",
    challenges: [
      {
        title: "Programme float is thin",
        description:
          "A machine that arrives two days late or fails for a week eats the float the whole programme depends on.",
      },
      {
        title: "Levels have to satisfy the engineer",
        description:
          "Platform and layer work has to be surveyed and signed. Approximate is a rework instruction with a delay attached.",
      },
      {
        title: "Plant cost has to be predictable",
        description:
          "Wet hire that carries maintenance and breakdown risk gives a cost per hour the estimator can actually rely on.",
      },
    ],
    serviceSlugs: [
      "site-establishment",
      "bulk-earthworks",
      "plant-hire",
      "haul-road-construction",
      "preventive-maintenance",
    ],
    compliance: [
      "Construction Regulations compliance and site-specific health and safety files",
      "Occupational Health and Safety Act appointments and inductions",
      "Plant inspection registers maintained on site",
      "Public liability cover confirmed before mobilisation",
    ],
    order: 2,
  },
  {
    id: "ind-industrial",
    slug: "industrial",
    name: "Industrial & Heavy Engineering",
    summary:
      "Plants, smelters and heavy engineering sites where equipment availability is measured in production units.",
    overview:
      "Industrial sites run their own maintenance teams and need a contractor who complements them rather than competes with them. That usually means the components they do not rebuild in-house — engines, transmissions, final drives, hydraulic assemblies — and the plant they need for a shutdown or an expansion.\n\nWork is planned around the shutdown window. A component that misses the window is not late by a day, it is late by a whole cycle.\n\nDocumentation matters as much as the work. Build sheets, torque records and material certificates go into your asset file and stay there.",
    image: "engine-flywheel-housing",
    challenges: [
      {
        title: "Shutdown windows do not move",
        description:
          "A rebuild that misses the window waits for the next one. Turnaround commitments have to be honoured to the day.",
      },
      {
        title: "In-house teams need a complement, not competition",
        description:
          "The value is in the specialised component work and the plant your own team does not carry, not in duplicating what they already do.",
      },
      {
        title: "Asset records must be defensible",
        description:
          "Build sheets, torque records and material certificates belong in your asset file, available when an insurer or auditor asks.",
      },
    ],
    serviceSlugs: [
      "engine-overhauls",
      "powertrain-rebuilds",
      "hydraulic-services",
      "fabrication-repair",
      "preventive-maintenance",
      "parts-supply",
    ],
    compliance: [
      "Occupational Health and Safety Act compliance and contractor packs",
      "Permit-to-work, hot work and confined space procedures observed",
      "Lifting equipment inspection certificates current",
      "Material and welding certification supplied with fabricated work",
    ],
    order: 3,
  },
  {
    id: "ind-factories",
    slug: "factories",
    name: "Factories & Processing",
    summary:
      "Manufacturing and processing plants where mobile equipment, materials handling and hydraulics keep the line fed.",
    overview:
      "A factory rarely thinks of itself as running a heavy fleet, but the loaders, forklifts, compactors and hydraulic systems that feed and clear the line are exactly that. When one stops, the line notices within the hour.\n\nWe run planned maintenance on that equipment, carry the consumables against your machine list, and answer breakdowns on the same 24-hour line as the mines do.\n\nHydraulic work is often the highest-value item — press systems, tipping gear, baling and compaction equipment all fail in ways that are cheap to prevent and expensive to ignore.",
    image: "fabrication-team-bowser",
    challenges: [
      {
        title: "The line stops when materials handling stops",
        description:
          "Loaders, forklifts and compaction equipment are production equipment, even when the asset register does not treat them that way.",
      },
      {
        title: "Hydraulic failures escalate quickly",
        description:
          "A leak that is left running contaminates the system and turns a seal kit into a pump rebuild.",
      },
      {
        title: "Maintenance has to fit around production",
        description:
          "Servicing is scheduled into the gaps your production plan allows rather than pulling equipment out mid-run.",
      },
    ],
    serviceSlugs: [
      "preventive-maintenance",
      "hydraulic-services",
      "breakdown-response",
      "fabrication-repair",
      "parts-supply",
    ],
    compliance: [
      "Occupational Health and Safety Act compliance and site inductions",
      "Food-safe and clean-area protocols observed where the plant requires them",
      "Lock-out and isolation procedures applied to every task",
      "Safety data sheets supplied for every lubricant and chemical delivered",
    ],
    order: 4,
  },
  {
    id: "ind-quarry",
    slug: "quarry",
    name: "Quarrying & Aggregates",
    summary:
      "Hard-rock quarries and aggregate operations, where abrasion sets the pace of wear on everything.",
    overview:
      "Quarry work is hard on equipment in a way coal is not. Abrasion destroys ground-engaging tools, undercarriage and wear plate on a schedule you can almost set a calendar by — which means it can be planned for rather than reacted to.\n\nWe supply plant into quarry operations, handle load-out and stockpiling, and run the wear management that keeps replacement predictable: measured undercarriage, specified plate grades and scheduled GET renewal.\n\nHaul roads in a quarry carry the same loads as a mine over shorter distances, so surface maintenance pays back even faster.",
    image: "adt-lowbed-quarry-delivery",
    challenges: [
      {
        title: "Abrasion drives the whole cost base",
        description:
          "Undercarriage, wear plate and ground-engaging tools consume budget at a rate that only measurement and planning bring under control.",
      },
      {
        title: "Short cycles magnify road condition",
        description:
          "On a short haul, a poor surface is crossed many more times a shift, so the cost of neglecting it compounds faster.",
      },
      {
        title: "Product grade must stay separated",
        description:
          "Stockpile layout and sequencing are what stop grades contaminating each other before they reach the screens.",
      },
    ],
    serviceSlugs: [
      "plant-hire",
      "materials-handling",
      "haul-road-construction",
      "preventive-maintenance",
      "parts-supply",
    ],
    compliance: [
      "Mine Health and Safety Act compliance where the operation is scheduled under it",
      "Dust and noise management within the operation's authorisation conditions",
      "Edge protection and tip-head standards maintained at every load-out",
      "Blast exclusion protocols observed by all plant and personnel",
    ],
    order: 5,
  },
  {
    id: "ind-warehouse",
    slug: "warehouse",
    name: "Warehousing & Logistics",
    summary:
      "Distribution yards and logistics hubs where surface condition and handling equipment govern throughput.",
    overview:
      "A distribution yard lives on its surface. Potholes and standing water slow every vehicle movement and damage handling equipment, and the cost never appears as a single line item — it is spread across delays, tyres and repairs.\n\nWe build and maintain yard surfaces, handle stormwater drainage, and keep handling equipment serviced on a planned schedule.\n\nWork on a live yard is planned around the traffic, with lay-down and phasing agreed so vehicle movements are never cut off entirely.",
    image: "parts-dispatch-pallet",
    challenges: [
      {
        title: "Surface condition throttles vehicle movement",
        description:
          "Every pothole and ponded area slows the yard down in a way that never shows up as one identifiable cost.",
      },
      {
        title: "Work has to happen around live traffic",
        description:
          "A distribution yard cannot close. Phasing, lay-down and traffic accommodation are planned before the first machine arrives.",
      },
      {
        title: "Handling equipment is production equipment",
        description:
          "Forklifts, loaders and yard tractors need the same planned maintenance discipline as any production asset.",
      },
    ],
    serviceSlugs: [
      "site-establishment",
      "haul-road-construction",
      "preventive-maintenance",
      "parts-supply",
      "breakdown-response",
    ],
    compliance: [
      "Occupational Health and Safety Act compliance and site induction",
      "Traffic management plans agreed before any work on a live yard",
      "Pedestrian segregation maintained throughout the works",
      "Stormwater discharge managed to the site's authorisation",
    ],
    order: 6,
  },
  {
    id: "ind-commercial",
    slug: "commercial",
    name: "Commercial & Property",
    summary:
      "Developers, property funds and commercial estates needing bulk earthworks and platform preparation.",
    overview:
      "Commercial development work is judged on two things: whether the platform is at the level the engineer specified, and whether it was delivered when the programme said it would be.\n\nWe take on bulk earthworks and platform preparation packages for commercial sites, working to survey control and handing over as-built data with the completion certificate.\n\nOn occupied estates, the constraint is usually the neighbours rather than the ground. Dust, noise and access are managed as part of the works, not as an afterthought when the first complaint arrives.",
    image: "dozer-lowbed-loadout-pit",
    challenges: [
      {
        title: "Occupied sites bring their own constraints",
        description:
          "Dust, noise, access and working hours are managed from the start on any site with tenants or neighbours.",
      },
      {
        title: "Levels have to satisfy the engineer",
        description:
          "Platforms are surveyed and signed against design, because approximate work becomes the following trade's delay.",
      },
      {
        title: "Programme certainty carries a cost",
        description:
          "Late earthworks push every trade behind it, which is why mobilisation dates are committed in writing.",
      },
    ],
    serviceSlugs: ["site-establishment", "bulk-earthworks", "plant-hire", "haul-road-construction"],
    compliance: [
      "Construction Regulations compliance and health and safety files",
      "Environmental authorisation conditions observed on site",
      "Noise and dust management on occupied and adjacent property",
      "Public liability cover confirmed before mobilisation",
    ],
    order: 7,
  },
  {
    id: "ind-government",
    slug: "government",
    name: "Government & Municipal",
    summary:
      "Municipal and public-sector works delivered against a tender scope, with the documentation the audit will ask for.",
    overview:
      "Public-sector work is delivered against a scope and audited against a paper trail. Both matter equally. Roads, stormwater, landfill cells and municipal earthworks all carry documentation requirements that a private client would never ask for.\n\nWe deliver to the tender scope and keep the records the audit will want — daily diaries, survey pick-ups, material certificates, disposal certificates and signed variation orders.\n\nVendor onboarding packs, tax clearance and compliance documents are kept current in the portal so a submission is never delayed by a missing certificate.",
    image: "dozer-d9t-dusk",
    challenges: [
      {
        title: "The audit trail is part of the deliverable",
        description:
          "Daily diaries, survey records, certificates and variation orders are as much a deliverable as the earthworks themselves.",
      },
      {
        title: "Scope changes need documented instruction",
        description:
          "Variations are priced and signed before they are built, which protects both the budget and the contractor.",
      },
      {
        title: "Vendor compliance must stay current",
        description:
          "An expired certificate can disqualify a submission entirely, so the compliance pack is maintained continuously.",
      },
    ],
    serviceSlugs: [
      "site-establishment",
      "haul-road-construction",
      "bulk-earthworks",
      "plant-hire",
      "site-services",
    ],
    compliance: [
      "Tender compliance documentation maintained and current",
      "Construction Regulations and OHS Act compliance on all public works",
      "Waste disposal through licensed facilities with certificates retained",
      "Daily site diaries and survey records kept for audit",
    ],
    order: 8,
  },
];
