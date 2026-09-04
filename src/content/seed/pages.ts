import type { HomeContent, AboutContent, PageMeta, Stat } from "@/lib/cms/types";
import { business } from "./business";

/* ============================================================================
   PAGE CONTENT

   The home and about singletons, plus the header block for every other route.
   Counter values are either structural (they count something in this file) or
   derived from a single business field, so nothing drifts out of step.
   ========================================================================= */

const yearsOperating = new Date().getFullYear() - business.foundedYear;

export const homeStats: Stat[] = [
  {
    id: "stat-years",
    value: yearsOperating,
    suffix: "+",
    label: "Years on the coalfields",
    note: "Derived from the founding year on the business record.",
    order: 1,
  },
  {
    id: "stat-dispatch",
    value: 24,
    suffix: "/7",
    label: "Breakdown dispatch",
    note: "Answered every day of the year, public holidays included.",
    order: 2,
  },
  {
    id: "stat-divisions",
    value: 4,
    label: "Operating divisions",
    note: "Earthmoving, mechanical, supply and emergency response.",
    order: 3,
  },
  {
    id: "stat-areas",
    value: business.serviceAreas.length,
    label: "Towns in the service footprint",
    note: "Across the Mpumalanga coalfields and the corridor around them.",
    order: 4,
  },
];

export const home: HomeContent = {
  hero: {
    brandName: "Leikah Plant Hire",
    descriptor: "PLANT HIRE",
    tagline: "Heavy plant, earthmoving and mechanical support across the Mpumalanga coalfields.",
    trustIndicators: [
      "24-Hour Dispatch",
      "Plant Hire",
      "Earthmoving",
      "Heavy Mechanical",
      "Middelburg, Mpumalanga",
    ],
    partner: {
      label: "In association with",
      name: "ISM Supply and Maintenance",
      logo: "/brand/partner-ism.png",
    },
    media: [
      "excavator-coal-bench-fleet",
      "dozer-d9t-dusk",
      "dozer-lowbed-haul-road",
      "field-service-excavator-repair",
    ],
  },
  trustLine: "Working across the Mpumalanga coalfields, quarries and industrial corridor",
  brandStatement:
    "One contractor for the machines that move the ground and the workshop that keeps them moving. Middelburg, since the yard opened.",
  brandFootnote: "Est. Mpumalanga · Plant · Earthmoving · Mechanical",
  fleetEyebrow: "The fleet",
  fleetHeadline: "The plant that does the work",
  fleetLead:
    "Machine class is matched to the bench, the haul and the ground — not to whatever happens to be standing idle. Every unit goes out on a signed condition report.",
  processEyebrow: "How a job runs",
  processHeadline: "From the first call to the machine back in production",
  processLead:
    "Five stages. Each one has an output you can see, and nothing moves to the next until the previous one is signed.",
  processStages: [
    {
      id: "walk-1",
      label: "Day one",
      title: "Site walk and scope",
      body: "We walk the ground with your planner, agree what is actually being asked for, and lift a starting survey both parties sign.",
      icon: "clipboard",
    },
    {
      id: "walk-2",
      label: "Before mobilisation",
      title: "Method and safety file",
      body: "Sequence, fleet, slope angles and traffic management written up and submitted to your SHE department in your template.",
      icon: "hardhat",
    },
    {
      id: "walk-3",
      label: "Week one",
      title: "Mobilisation",
      body: "Plant transported in on low-bed, inspected on arrival, operators inducted before a machine turns a track.",
      icon: "lowbed",
    },
    {
      id: "walk-4",
      label: "Ongoing",
      title: "Production and maintenance",
      body: "Benches advance to the agreed sequence while planned servicing and 24-hour response keep the fleet on the face.",
      icon: "excavator",
    },
    {
      id: "walk-5",
      label: "Close-out",
      title: "Survey and handover",
      body: "Final surface surveyed and reconciled against design, handed over with as-built data and the volume reconciliation pack.",
      icon: "bench",
    },
  ],
  introEyebrow: "What we do",
  introHeadline: "Two divisions, one number to call",
  introLead:
    "We move bulk material, build and hold haul roads, and rebuild the components that stop your fleet — from a yard inside the Middelburg heavy-engineering corridor, with breakdown response answered around the clock.",
  introBody:
    "Most operations end up managing an earthmoving contractor and a mechanical contractor separately, and discovering at the worst moment that neither owns the problem. Leikah runs both under one roof.\n\nThe earthmoving side moves material and builds the roads that carry it. The mechanical side keeps the machines that do it — yours as well as ours — in production, with a workshop on July Street and mobile units that go out at any hour. The supply division sits behind both, because the yard is inside the corridor where the parts already are.",
  introImage: "leikah-response-vehicle",
  introPoints: [
    {
      title: "One accountable contractor",
      description:
        "Production and maintenance under one contract removes the gap that both sides usually point at when something goes wrong.",
    },
    {
      title: "A workshop that backs the fleet",
      description:
        "Machines on hire are not waiting on a third party. Component work happens in our own bays, on our own schedule.",
    },
    {
      title: "Inside the parts corridor",
      description:
        "OEM dealers, machining houses and wholesalers sit within a short drive of the yard, which is why lead times are short.",
    },
  ],
  stats: homeStats,
  whyUs: [
    {
      title: "Answered around the clock",
      description:
        "The breakdown line reaches a person every hour of every day, including public holidays. A call is logged with machine, fault and access before a unit rolls.",
      icon: "clock",
    },
    {
      title: "Quoted on measurement",
      description:
        "Rebuilds are quoted after the strip, not before it. You approve a scope built on gauged findings and a line-by-line parts schedule.",
      icon: "gauge",
    },
    {
      title: "Documented as standard",
      description:
        "Build sheets, strip reports, condition reports and survey reconciliations are issued as a matter of course, not on request.",
      icon: "shield",
    },
    {
      title: "Equipped to finish on the first visit",
      description:
        "Field units carry diagnostics, welding, hose crimping and fluid transfer, which is why most call-outs are closed without a second trip.",
      icon: "field-service",
    },
  ],
  safetyEyebrow: "Health, safety & environment",
  safetyHeadline: "The controls come first, and anyone can stop the job",
  safetyBody:
    "Heavy plant, live benches and a workshop full of stored energy do not forgive improvisation. Every person on a Leikah crew has the authority to stop work when a control is missing — without permission and without consequence.",
  safetyPoints: [
    "Isolation and lock-out before every task, with stored energy released and implements supported mechanically",
    "Method statements, risk assessments and safety files prepared in your template, to your SHE department's requirements",
    "Operator competencies, medicals and legal appointments tracked to expiry and renewed before they lapse",
    "Spill containment deployed before a line is opened, with licensed disposal and certificates retained",
  ],
  safetyImage: "fabrication-team-bowser",
  ctaHeadline: "Tell us what has stopped, or what needs to move",
  ctaBody:
    "Send the machine and the fault, or the volume and the deadline. You will get a straight answer on whether we can do it, when, and what it costs.",
};

export const about: AboutContent = {
  eyebrow: "About Leikah Plant Hire",
  headline: "Built around the machines that do not get to stop",
  lead: "A Middelburg plant hire, earthmoving and heavy mechanical contractor working the Mpumalanga coalfields and the industrial corridor that supplies them.",
  story:
    "Leikah Plant Hire operates from a yard at 7 July Street in Middelburg's New Industrial Area — deliberately, not incidentally. The street and the ones around it hold OEM dealers, spares retailers, electrical wholesalers and machining houses. A component that would take days to source somewhere else is collected the same morning here, and that single fact shapes what the business is able to promise on turnaround.\n\nThe work splits into two divisions that most operations buy separately. The earthmoving side advances the cut, builds and holds haul roads, handles product and prepares platforms. The mechanical side rebuilds the engines, transmissions, final drives and hydraulic assemblies that keep heavy fleets in production — ours and the client's alike.\n\nRunning both matters more than it sounds. A contractor who only moves material has no answer when a machine fails, and a workshop with no production experience does not understand what a day of downtime actually costs. Holding both means one contract, one accountable party, and no gap in the middle for a problem to fall into.\n\nBehind them sits the supply division and a breakdown line that is answered at any hour. Continuous operations do not fail conveniently, and a hauler down at two in the morning is production the month never gets back.",
  image: "excavator-coal-bench-fleet",
  values: [
    {
      title: "Say the real number",
      description:
        "A realistic date beats an optimistic one every time. If something threatens a commitment, the client hears about it when we do — not on the day it was due.",
    },
    {
      title: "Measure before you quote",
      description:
        "Rebuild scopes are built on gauged findings and volumes are reconciled to the client's surveyor. Estimates dressed as facts cost both sides money.",
    },
    {
      title: "Write it down",
      description:
        "Build sheets, condition reports, fault reports and survey records exist so that a question in twelve months has an answer instead of a recollection.",
    },
    {
      title: "The control comes first",
      description:
        "Anyone on a crew can stop a job when a control is missing. Production targets have never justified the alternative and never will.",
    },
  ],
  timeline: [
    {
      year: "Origin",
      title: "Dozer and plant hire",
      description:
        "The business starts where the name does — supplying dozers and earthmoving plant into open-cast operations across the Middelburg district.",
    },
    {
      year: "Expansion",
      title: "Earthmoving contracts",
      description:
        "Machine hire grows into contracted production: bulk cut, overburden stripping, haul road construction and materials handling under our own supervision.",
    },
    {
      year: "Workshop",
      title: "Heavy mechanical division established",
      description:
        "A workshop at 7 July Street brings engine, transmission, final drive and hydraulic rebuilds in-house, so plant on hire is never waiting on a third party.",
    },
    {
      year: "Response",
      title: "24-hour field service",
      description:
        "Mobile units equipped with diagnostics, welding, hose crimping and fluid transfer put a breakdown answer on the road at any hour of the day or night.",
    },
    {
      year: "Supply",
      title: "Parts and consumables division",
      description:
        "Proximity to the OEM corridor turns into a supply offering — filtration, lubricants, hose, undercarriage and consumables delivered to site.",
    },
  ],
  capabilities: [
    { label: "Base of operations", value: "7 July Street, New Industrial Area, Middelburg" },
    { label: "Divisions", value: "Earthmoving · Mechanical · Supply · Emergency" },
    { label: "Breakdown dispatch", value: "24 hours, 365 days" },
    { label: "Workshop capability", value: "Engines, powertrain, hydraulics, fabrication" },
    { label: "Plant supplied", value: "Dozers, excavators, haulers, graders, support plant" },
    { label: "Hire basis", value: "Wet or dry, short-term to contract" },
    { label: "Primary sectors", value: "Mining, quarrying, civils, industrial" },
    { label: "Documentation", value: "Strip reports, build sheets, condition reports, survey reconciliation" },
  ],
};

/* --- Route headers --------------------------------------------------------- */

export const pages: Record<string, PageMeta> = {
  services: {
    key: "services",
    title: "Our Services",
    eyebrow: "Capability",
    headline: "Everything from the first cut to the last torque setting",
    lead: "Thirteen services across four divisions. Each one is quoted on what the work actually requires, and delivered with the documentation to prove what was done.",
    image: "excavator-coal-bench-fleet",
  },
  industries: {
    key: "industries",
    title: "Industries We Serve",
    eyebrow: "Sectors",
    headline: "The pressure is different in every sector. The discipline is not.",
    lead: "Mining, quarrying, civils, industrial and public-sector operations each carry their own constraints. What follows is what those constraints actually are, and which of our services answer them.",
    image: "dozer-lowbed-loadout-pit",
  },
  projects: {
    key: "projects",
    title: "Projects",
    eyebrow: "Work delivered",
    headline: "What the work looked like, and what it changed",
    lead: "Selected contracts across earthmoving, workshop and field service. Client names are withheld where contracts require it and the sector is shown instead.",
    image: "dozer-d9t-dusk",
  },
  maintenance: {
    key: "maintenance",
    title: "Maintenance Solutions",
    eyebrow: "Mechanical division",
    headline: "Keeping a heavy fleet in production, on evidence rather than on failure",
    lead: "Planned maintenance, component rebuilds and condition monitoring from a workshop that also runs its own fleet — so the schedule is written by people who know what downtime costs.",
    image: "engine-flywheel-housing",
  },
  supply: {
    key: "supply",
    title: "Supply Division",
    eyebrow: "Parts & consumables",
    headline: "Parts on site before the shift changes",
    lead: "Filtration, lubricants, hose, undercarriage, ground-engaging tools and consumables, sourced through the OEM corridor on our doorstep and delivered to site.",
    image: "parts-dispatch-pallet",
  },
  emergency: {
    key: "emergency",
    title: "Emergency Services",
    eyebrow: "24-hour response",
    headline: "Machines do not fail during office hours",
    lead: "The breakdown line is answered every hour of every day. Field units carry what it takes to close most call-outs on the first visit.",
    image: "field-service-excavator-repair",
  },
  "health-safety": {
    key: "health-safety",
    title: "Health & Safety",
    eyebrow: "HSEQ",
    headline: "The controls come first, and anyone can stop the job",
    lead: "How we work, what we require of ourselves, and what we hand over so your SHE department can verify it rather than take our word for it.",
    image: "fabrication-team-bowser",
  },
  gallery: {
    key: "gallery",
    title: "Gallery",
    eyebrow: "On site & in the workshop",
    headline: "The work, photographed where it happened",
    lead: "Benches, haul roads, workshop bays and field call-outs across the Mpumalanga coalfields.",
    image: "excavator-adt-loading-coal",
  },
  careers: {
    key: "careers",
    title: "Careers",
    eyebrow: "Join the crew",
    headline: "Operators, technicians and fitters who do it properly",
    lead: "We hire people who are prepared to stop a job when a control is missing, and who write down what they did. If that is how you work, we want to hear from you.",
    image: "fabrication-team-bowser",
  },
  news: {
    key: "news",
    title: "News & Insight",
    eyebrow: "From the yard",
    headline: "What we have learnt keeping fleets in production",
    lead: "Practical notes on maintenance, earthworks and the decisions that quietly govern the cost of running heavy plant.",
    image: "engine-block-machined",
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    eyebrow: "Client feedback",
    headline: "What the operations we work for say",
    lead: "Feedback from the planners, engineers and maintenance managers who hold us to a schedule.",
    image: "liebherr-excavator-standby",
  },
  faq: {
    key: "faq",
    title: "Frequently Asked Questions",
    eyebrow: "Straight answers",
    headline: "The questions we get asked before a first contract",
    lead: "Hire terms, workshop process, response times, safety files and vendor onboarding — answered directly.",
    image: "diesel-engine-workshop-strip",
  },
  contact: {
    key: "contact",
    title: "Contact",
    eyebrow: "Get in touch",
    headline: "One number for the yard. The same one at two in the morning.",
    lead: "Reach the right department directly, or send it through and we will route it. Breakdowns go straight to the 24-hour line.",
    image: "leikah-response-vehicle",
  },
  quote: {
    key: "quote",
    title: "Request a Quote",
    eyebrow: "Quotation request",
    headline: "Tell us what needs to move, or what has stopped",
    lead: "The more detail you give, the closer the first number is to the final one. Photographs and specifications help more than anything.",
    image: "adt-lowbed-quarry-delivery",
  },
};
