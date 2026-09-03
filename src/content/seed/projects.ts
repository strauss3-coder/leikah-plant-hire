import type { Project } from "@/lib/cms/types";

/* ============================================================================
   PROJECT RECORD

   Client names are withheld by default (`clientNamed: false`) and the sector is
   shown instead — standard practice where mine and plant contracts carry
   confidentiality terms. Where a client gives written permission, switching the
   flag in the portal reveals the name everywhere it appears.
   ========================================================================= */

export const projects: Project[] = [
  {
    id: "prj-haul-road-rebuild",
    slug: "haul-road-rebuild-coal-operation",
    title: "Main haul route rebuilt and placed under standing maintenance",
    client: "Coal producer, Mpumalanga",
    clientNamed: false,
    industrySlug: "mining",
    serviceSlugs: ["haul-road-construction", "site-services", "plant-hire"],
    location: "Middelburg district",
    province: "Mpumalanga",
    startDate: "2024-03-04",
    completionDate: "2024-06-21",
    status: "complete",
    summary:
      "A deteriorating primary haul route rebuilt to a layer design, then held under a standing grader and water circuit.",
    brief:
      "The operation's main haul route had been patched rather than maintained for several seasons. Cross-fall had flattened, the wearing course was gone in the wheel paths, and standing water after rain was cutting the surface faster than it could be repaired. Tyre spend was climbing and cycle times had drifted well off the planning assumption.",
    approach:
      "We proof-rolled the existing subgrade and cut out the soft areas rather than building over them, then placed and compacted a selected layer and a new wearing course to design thickness. Cross-fall was reinstated across the full length and table drains were cut on both sides with mitre drains discharging clear of the formation.\n\nOnce the road was handed over, it went onto a standing maintenance circuit — grader passes on an agreed frequency and a water bowser circuit with application rates set for the gradient rather than applied uniformly.",
    outcome:
      "The route has held its profile through two rain seasons. Defects are cut out at the weekly grader pass instead of being allowed to propagate, and the maintenance circuit continues under a rolling contract.",
    heroImage: "dozer-d9t-dusk",
    gallery: ["water-bowser-dust-suppression", "dozer-d10t-refurbished", "excavator-coal-bench-fleet"],
    metrics: [
      { label: "Route rebuilt", value: "4.2 km" },
      { label: "Programme", value: "16 weeks" },
      { label: "Maintenance", value: "Standing circuit" },
      { label: "Rain seasons held", value: "2" },
    ],
    milestones: [
      {
        id: "hr-m1",
        date: "2024-03-04",
        title: "Survey and layer design",
        description: "Existing route surveyed, subgrade proof-rolled and the layer design set against the largest vehicle on the route.",
      },
      {
        id: "hr-m2",
        date: "2024-03-25",
        title: "Subgrade correction",
        description: "Soft areas excavated and replaced with selected material, compacted to the specified density.",
      },
      {
        id: "hr-m3",
        date: "2024-04-29",
        title: "Wearing course and drainage",
        description: "Wearing course placed to design thickness, cross-fall trimmed and table and mitre drains cut.",
      },
      {
        id: "hr-m4",
        date: "2024-06-21",
        title: "Handover and maintenance start",
        description: "Route handed over on as-built survey and the standing grader and water circuit commenced.",
      },
    ],
    documentIds: [],
    featured: true,
    order: 1,
  },
  {
    id: "prj-excavator-field-repair",
    slug: "mining-excavator-field-repair",
    title: "Mining excavator returned to production without leaving the bench",
    client: "Coal producer, Mpumalanga",
    clientNamed: false,
    industrySlug: "mining",
    serviceSlugs: ["breakdown-response", "hydraulic-services"],
    location: "Middelburg district",
    province: "Mpumalanga",
    startDate: "2025-01-18",
    completionDate: "2025-01-20",
    status: "complete",
    summary:
      "A primary loading unit failed on a coal bench. The field crew mobilised the same day and repaired it in place rather than recovering it.",
    brief:
      "The site's primary loading excavator lost boom function mid-shift on an active coal bench. Recovering a machine of that size off a working bench is a multi-day exercise in its own right, so the first question was whether the repair could be completed in situ.",
    approach:
      "The field service unit was dispatched within the hour with diagnostic equipment, welding plant, a hose crimper and fitting stock. Pressure and flow were measured before anything was removed, which isolated the fault to a failed line and a damaged mounting rather than the pump the site had assumed.\n\nThe machine was isolated and locked out, the implement supported mechanically, and the replacement hose was measured, crimped and fitted at the machine. The damaged mounting was prepared and welded to procedure on the bench, and the system was flushed and filtration renewed before pressures were reset and recorded.",
    outcome:
      "The machine was back in production on the second day without ever leaving the bench. The written fault report identified the chafe point that caused the failure, and the guard added at the same visit has kept it from recurring.",
    heroImage: "field-service-excavator-repair",
    gallery: ["hydraulic-hose-replacement", "hydraulic-valve-bank-inspection", "leikah-response-vehicle"],
    beforeAfter: [
      {
        before: "hydraulic-valve-bank-inspection",
        after: "hydraulic-hose-replacement",
        caption: "Contaminated valve bank at diagnosis, and the replacement line crimped and fitted at the machine.",
      },
    ],
    metrics: [
      { label: "Response", value: "Under 1 hour" },
      { label: "Back in production", value: "Day 2" },
      { label: "Recovery avoided", value: "In-situ repair" },
      { label: "Repeat failures", value: "None" },
    ],
    milestones: [
      {
        id: "ex-m1",
        date: "2025-01-18",
        title: "Call logged and unit dispatched",
        description: "Fault symptoms, machine and access captured against a call reference; unit dispatched within the hour.",
      },
      {
        id: "ex-m2",
        date: "2025-01-18",
        title: "Diagnosis by measurement",
        description: "Pressure and flow testing isolated a failed line and damaged mounting, ruling out the suspected pump failure.",
      },
      {
        id: "ex-m3",
        date: "2025-01-19",
        title: "Repair executed on the bench",
        description: "Hose measured, crimped and fitted on site; mounting prepared and welded to procedure; system flushed.",
      },
      {
        id: "ex-m4",
        date: "2025-01-20",
        title: "Pressures set and report issued",
        description: "Standby and relief pressures set and recorded, machine handed back and the written fault report issued.",
      },
    ],
    documentIds: [],
    featured: true,
    order: 2,
  },
  {
    id: "prj-adt-powertrain-programme",
    slug: "adt-powertrain-rebuild-programme",
    title: "Rolling powertrain rebuild programme across a hauler fleet",
    client: "Contract miner, Mpumalanga",
    clientNamed: false,
    industrySlug: "mining",
    serviceSlugs: ["powertrain-rebuilds", "preventive-maintenance", "parts-supply"],
    location: "July Street workshop, Middelburg",
    province: "Mpumalanga",
    startDate: "2024-08-05",
    completionDate: null,
    status: "ongoing",
    summary:
      "Transmissions and final drives rebuilt on a rolling schedule set by oil analysis, so units come off before they fail.",
    brief:
      "A hauler fleet was losing transmissions without warning, each failure taking a machine out for weeks and pulling parts forward at emergency pricing. The client wanted the failures moved from unplanned to planned.",
    approach:
      "We audited the fleet and put every unit onto scheduled oil sampling, trending wear metals per component rather than reading each result in isolation. A rising trend triggers an inspection, and an inspection that confirms the trend books the unit into the workshop.\n\nRebuilds run to the standard workshop process — full strip, measurement against service limits, a written strip report approved before parts are ordered, and assembly with backlash, end-float and pre-load set and recorded on the build sheet. Units go back sealed, tagged and palletised with the fitting hardware included.",
    outcome:
      "Powertrain work has moved almost entirely onto the planned schedule. Units come off on evidence from the oil trend rather than after a failure, and the parts for each rebuild are ordered at normal lead time rather than at emergency rates.",
    heroImage: "adt-transmission-assembly",
    gallery: ["transmission-housing-overhaul", "final-drive-rebuild-complete", "adt-lowbed-quarry-delivery"],
    beforeAfter: [
      {
        before: "transmission-housing-overhaul",
        after: "adt-transmission-assembly",
        caption: "Housing stripped and measured on arrival, and the completed assembly sealed and ready for fitment.",
      },
    ],
    metrics: [
      { label: "Programme", value: "Rolling" },
      { label: "Trigger", value: "Oil trend" },
      { label: "Documentation", value: "Build sheet per unit" },
      { label: "Parts lead time", value: "Standard, not emergency" },
    ],
    milestones: [
      {
        id: "pt-m1",
        date: "2024-08-05",
        title: "Fleet audit",
        description: "Every hauler inspected and recorded — hours, condition, outstanding defects and service position.",
      },
      {
        id: "pt-m2",
        date: "2024-09-02",
        title: "Sampling programme established",
        description: "Scheduled oil sampling introduced across the fleet with per-component trending and escalation thresholds.",
      },
      {
        id: "pt-m3",
        date: "2024-10-14",
        title: "First planned removals",
        description: "Units booked into the workshop on trend evidence rather than after failure, with parts ordered at normal lead time.",
      },
      {
        id: "pt-m4",
        date: "2025-02-03",
        title: "Programme extended",
        description: "Scope extended to final drives and differentials on the same trend-triggered basis.",
      },
    ],
    documentIds: [],
    featured: true,
    order: 3,
  },
  {
    id: "prj-engine-overhaul-turnaround",
    slug: "engine-overhaul-shutdown-turnaround",
    title: "Engine overhaul delivered inside a fixed shutdown window",
    client: "Industrial operation, Mpumalanga",
    clientNamed: false,
    industrySlug: "industrial",
    serviceSlugs: ["engine-overhauls", "parts-supply"],
    location: "July Street workshop, Middelburg",
    province: "Mpumalanga",
    startDate: "2024-11-11",
    completionDate: "2024-12-13",
    status: "complete",
    summary:
      "A heavy diesel stripped, measured, machined and rebuilt against a shutdown date that could not move.",
    brief:
      "The unit had to be back on the plant before a fixed shutdown window closed. Missing the date meant waiting for the following cycle, so the turnaround commitment mattered as much as the rebuild itself.",
    approach:
      "The engine was stripped completely on arrival and measured against OEM service limits before anything was ordered. The strip report and a line-by-line parts schedule were issued within two days, so the client approved a scope built on measurement rather than assumption.\n\nMachining went through the engineering houses in the Middelburg corridor and parts were drawn from OEM channels within the same district, which is what made the schedule achievable. Assembly proceeded to a build sheet with torque, clearance and end-float recorded at every critical joint, and the unit was run, timed and load-checked before release.",
    outcome:
      "The engine was delivered nine days before the window closed, with the strip report, parts schedule, build sheet and run sheet handed over as a set for the client's asset file.",
    heroImage: "engine-flywheel-housing",
    gallery: [
      "diesel-engine-workshop-strip",
      "engine-block-machined",
      "timing-gear-train-assembly",
      "reconditioned-block-lifted",
      "powertrain-assembly-bench",
    ],
    beforeAfter: [
      {
        before: "diesel-engine-workshop-strip",
        after: "engine-flywheel-housing",
        caption: "The unit as received for strip-down, and the completed long block built to OEM specification.",
      },
    ],
    metrics: [
      { label: "Turnaround", value: "32 days" },
      { label: "Delivered", value: "9 days early" },
      { label: "Scope approved", value: "After strip" },
      { label: "Handover", value: "Full build documentation" },
    ],
    milestones: [
      {
        id: "eo-m1",
        date: "2024-11-11",
        title: "Received and stripped",
        description: "Unit logged against a job card, photographed and stripped with all components tagged to the job.",
      },
      {
        id: "eo-m2",
        date: "2024-11-15",
        title: "Strip report issued",
        description: "Measurements against service limits, photographs and a line-by-line parts schedule issued for approval.",
      },
      {
        id: "eo-m3",
        date: "2024-11-29",
        title: "Machining and parts complete",
        description: "Machining completed through the local engineering corridor and all parts received.",
      },
      {
        id: "eo-m4",
        date: "2024-12-13",
        title: "Run, tested and released",
        description: "Assembled to build sheet, run and load-checked, and released with full documentation.",
      },
    ],
    documentIds: [],
    featured: true,
    order: 4,
  },
  {
    id: "prj-quarry-mobilisation",
    slug: "quarry-plant-mobilisation",
    title: "Plant mobilised into a working hard-rock quarry",
    client: "Aggregate producer",
    clientNamed: false,
    industrySlug: "quarry",
    serviceSlugs: ["plant-hire", "materials-handling"],
    location: "Mpumalanga",
    province: "Mpumalanga",
    startDate: "2024-05-13",
    completionDate: "2024-05-17",
    status: "complete",
    summary:
      "Haulers and support plant delivered on low-bed into a live quarry, inducted and producing within the week.",
    brief:
      "The operation needed additional hauling capacity at short notice without interrupting production in a working pit. Delivery had to happen around live blasting and load-out.",
    approach:
      "Machines were serviced and issued with photographic condition reports before loading. Abnormal-load arrangements and low-bed transport were organised end to end, with delivery windows agreed around the blast schedule and load-out traffic.\n\nOffloading was carried out to a lift and traffic plan agreed with the quarry, and operators completed site induction before taking machines onto the benches.",
    outcome:
      "All units were on site, inducted and producing within the same week, with no interruption to the quarry's own load-out.",
    heroImage: "adt-lowbed-quarry-delivery",
    gallery: ["adt-lowbed-transport-dusk", "dozer-lowbed-haul-road", "excavator-adt-loading-coal"],
    metrics: [
      { label: "Mobilisation", value: "5 days" },
      { label: "Production interrupted", value: "None" },
      { label: "Condition reports", value: "Signed both ways" },
      { label: "Operators", value: "Inducted on arrival" },
    ],
    milestones: [
      {
        id: "qm-m1",
        date: "2024-05-13",
        title: "Pre-delivery inspection",
        description: "Machines serviced, safety equipment checked and photographic condition reports issued before loading.",
      },
      {
        id: "qm-m2",
        date: "2024-05-15",
        title: "Transport and delivery",
        description: "Low-bed transport with abnormal-load arrangements, delivered in windows agreed around the blast schedule.",
      },
      {
        id: "qm-m3",
        date: "2024-05-16",
        title: "Offload to lift plan",
        description: "Units offloaded under an agreed lift and traffic plan without interrupting quarry load-out.",
      },
      {
        id: "qm-m4",
        date: "2024-05-17",
        title: "Induction and handover",
        description: "Operators inducted onto the site's rules and machines handed over on a signed on-hire inspection.",
      },
    ],
    documentIds: [],
    featured: false,
    order: 5,
  },
  {
    id: "prj-fuel-infrastructure",
    slug: "site-fuel-infrastructure-fabrication",
    title: "Site fuel storage fabricated and commissioned",
    client: "Contract miner, Mpumalanga",
    clientNamed: false,
    industrySlug: "mining",
    serviceSlugs: ["fabrication-repair", "site-services"],
    location: "July Street workshop, Middelburg",
    province: "Mpumalanga",
    startDate: "2025-04-07",
    completionDate: "2025-05-16",
    status: "complete",
    summary:
      "A bunded diesel storage unit built to drawing in the fabrication bay and commissioned on the client's site.",
    brief:
      "The operation was refuelling from drums and losing time on every fill. They needed a compliant, bunded storage unit sized to the fleet, built to drawing and commissioned on site.",
    approach:
      "The unit was fabricated in the July Street bay to the approved drawing, with certified material and welds carried out by coded welders. Bunding, venting, dispensing and spill containment were built in rather than added on, and the whole assembly was pressure-checked and coated before transport.\n\nCommissioning on site covered the dispensing equipment, containment and the operating procedure the site team would work to.",
    outcome:
      "Refuelling moved off drums onto a compliant bunded installation, with material certificates and the fabrication record handed over for the site's environmental and asset files.",
    heroImage: "fabrication-team-bowser",
    gallery: ["parts-dispatch-pallet", "water-bowser-dust-suppression"],
    metrics: [
      { label: "Build", value: "To approved drawing" },
      { label: "Welding", value: "Coded welders" },
      { label: "Containment", value: "Bunded, built in" },
      { label: "Handover", value: "Material certificates" },
    ],
    milestones: [
      {
        id: "fi-m1",
        date: "2025-04-07",
        title: "Drawing approved",
        description: "Capacity, bunding, venting and dispensing configuration agreed and the drawing signed off.",
      },
      {
        id: "fi-m2",
        date: "2025-04-22",
        title: "Fabrication",
        description: "Unit fabricated from certified material with welding carried out by coded welders to procedure.",
      },
      {
        id: "fi-m3",
        date: "2025-05-09",
        title: "Test and coat",
        description: "Assembly pressure-checked, containment verified and the unit coated for service.",
      },
      {
        id: "fi-m4",
        date: "2025-05-16",
        title: "Delivery and commissioning",
        description: "Delivered, installed and commissioned on site with the operating procedure handed to the site team.",
      },
    ],
    documentIds: [],
    featured: false,
    order: 6,
  },
];
