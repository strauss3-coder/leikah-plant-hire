import type {
  Testimonial,
  ClientLogo,
  DocumentAsset,
  Faq,
  NewsPost,
  CareerPosting,
} from "@/lib/cms/types";

/* ============================================================================
   EDITORIAL CONTENT

   Testimonials, client logos, compliance documents and vacancies ship EMPTY on
   purpose. Every one of them is a claim about a third party or a real-world
   fact, and inventing them would put false statements on a commercial site that
   bids for mine and municipal work.

   All four modules are fully built in the portal and every consuming component
   handles the empty state, so the moment the client supplies real material it
   appears on the site without a code change. The portal dashboard lists them as
   outstanding pre-launch items.
   ========================================================================= */

export const testimonials: Testimonial[] = [];

export const clients: ClientLogo[] = [];

export const documents: DocumentAsset[] = [];

/** No vacancies seeded — the careers page runs on speculative applications until real roles are posted. */
export const careers: CareerPosting[] = [];

/* --- Frequently asked ------------------------------------------------------ */

export const faqs: Faq[] = [
  {
    id: "faq-areas",
    question: "Which areas do you work in?",
    answer:
      "The yard is in Middelburg and most work sits inside the Mpumalanga coalfields — Middelburg, Witbank/eMalahleni, Hendrina, Ogies, Kriel, Belfast, Delmas and Secunda. We mobilise further for contract work; the quotation states the mobilisation cost so there is nothing to discover later.",
    category: "General",
    order: 1,
  },
  {
    id: "faq-hours",
    question: "What are your operating hours?",
    answer:
      "The workshop and offices run Monday to Friday 07:00–17:00 and Saturday 07:00–13:00. Breakdown dispatch does not keep office hours — the emergency line is answered around the clock, every day of the year, including public holidays.",
    category: "General",
    order: 2,
  },
  {
    id: "faq-response",
    question: "How quickly can you get to a breakdown?",
    answer:
      "For sites inside the Middelburg and Witbank corridor we aim to have a unit dispatched within the hour of the call being logged, with an ETA confirmed to your site contact before it leaves. Further afield the dispatch time depends on distance and site access, and we give you a realistic figure on the call rather than an optimistic one.",
    category: "Emergency",
    serviceSlug: "breakdown-response",
    order: 3,
  },
  {
    id: "faq-first-visit",
    question: "Will the first visit fix the machine?",
    answer:
      "Most of the time, yes. The field units carry diagnostics, welding plant, a hose crimper with hose and fitting stock, fluid transfer and the consumables behind the majority of call-outs. Where a component has to come off the machine, low-bed transport and a workshop slot are arranged from the same call rather than as a separate exercise the next day.",
    category: "Emergency",
    serviceSlug: "breakdown-response",
    order: 4,
  },
  {
    id: "faq-wet-dry",
    question: "What is the difference between wet and dry hire?",
    answer:
      "Wet hire means the machine comes with a competent, inducted operator, and servicing, maintenance and major component risk sit with us. Dry hire means your operators run the machine. Both are quoted with the fuel basis, minimum hours, mobilisation and standing time stated in writing.",
    category: "Plant Hire",
    serviceSlug: "plant-hire",
    order: 5,
  },
  {
    id: "faq-hire-minimum",
    question: "Is there a minimum hire period?",
    answer:
      "Minimum hours are set per machine class and stated on the quotation. Short-term, monthly and contract hire are all available, and mobilisation is priced separately so a longer hire is not carrying a hidden transport cost.",
    category: "Plant Hire",
    serviceSlug: "plant-hire",
    order: 6,
  },
  {
    id: "faq-condition-report",
    question: "How is machine condition recorded at the start and end of a hire?",
    answer:
      "Every unit leaves on a photographic condition report with hour meter, fluid levels, tyres or undercarriage, safety equipment and fire suppression recorded and signed. Off-hire is inspected the same way. Damage discussions are then settled against a document rather than a recollection.",
    category: "Plant Hire",
    serviceSlug: "plant-hire",
    order: 7,
  },
  {
    id: "faq-operators",
    question: "Are your operators inducted and certified?",
    answer:
      "Yes. Operators supplied on wet hire carry current medicals, competency certificates for the machine class and the site inductions the operation requires. We send the file before mobilisation so nobody is turned away at the gate.",
    category: "Plant Hire",
    serviceSlug: "plant-hire",
    order: 8,
  },
  {
    id: "faq-strip-report",
    question: "How do you quote an engine or transmission rebuild?",
    answer:
      "We do not quote a rebuild before the unit is stripped. The engine or transmission is stripped completely, cleaned and measured against OEM service limits, and you receive a written strip report with photographs and a line-by-line parts schedule. You approve a scope built on measurement, not on an estimate over the phone.",
    category: "Workshop",
    serviceSlug: "engine-overhauls",
    order: 9,
  },
  {
    id: "faq-oem-parts",
    question: "Do you fit genuine OEM parts?",
    answer:
      "Where an OEM part is specified, an OEM part is fitted. Where an approved equivalent is appropriate, it is offered as a named alternative on the quotation with the price difference shown. Nothing is substituted without you seeing it first.",
    category: "Workshop",
    order: 10,
  },
  {
    id: "faq-turnaround",
    question: "What turnaround should I expect on a workshop rebuild?",
    answer:
      "It depends on the findings and on machining and parts lead times, both of which are stated in the strip report before you approve. Once the scope is approved we commit to a date, and if something threatens that date you hear about it when we do rather than on the day.",
    category: "Workshop",
    order: 11,
  },
  {
    id: "faq-warranty",
    question: "Is rebuilt work under warranty?",
    answer:
      "Yes. Warranty terms are stated on the quotation and issued with the completed job, alongside the strip report, parts schedule and build sheet. The build sheet records torque, clearance and end-float at every critical joint, which is what makes a warranty claim straightforward to assess.",
    category: "Workshop",
    order: 12,
  },
  {
    id: "faq-documentation",
    question: "What documentation comes with completed workshop work?",
    answer:
      "A strip report with measurements and photographs, a line-by-line parts schedule, a signed build sheet with recorded torque and clearance figures, the run or test sheet, and the warranty terms. It goes into your asset file as a set.",
    category: "Workshop",
    order: 13,
  },
  {
    id: "faq-pm-contract",
    question: "How does a planned maintenance contract work?",
    answer:
      "We audit your fleet, build a service matrix per machine against your production calendar, and execute services to the hour meter on site or in the workshop. Oil samples are drawn at each service and trended per component, so a developing failure is flagged while it is still a service item. You get a monthly report covering availability, cost per hour, defect backlog and upcoming component changes.",
    category: "Maintenance",
    serviceSlug: "preventive-maintenance",
    order: 14,
  },
  {
    id: "faq-oil-analysis",
    question: "Why does oil analysis matter if the machine is running fine?",
    answer:
      "Because by the time a machine is not running fine, the cheap intervention has passed. Wear metals, silicon and viscosity trended per component show a bearing or a gear set deteriorating weeks before it surfaces as a symptom. That window is the difference between a planned component change and an unplanned rebuild.",
    category: "Maintenance",
    serviceSlug: "preventive-maintenance",
    order: 15,
  },
  {
    id: "faq-parts-lead",
    question: "How fast can you get parts?",
    answer:
      "The yard sits inside the Middelburg heavy-engineering corridor, with OEM dealers, electrical wholesalers, machining houses and spares retailers within a short drive. Common items are same-day; anything ordered in has its lead time confirmed on the order rather than estimated.",
    category: "Supply",
    serviceSlug: "parts-supply",
    order: 16,
  },
  {
    id: "faq-standing-order",
    question: "Can you hold stock against our fleet?",
    answer:
      "Yes. Give us your machine list and we hold the service kits and consumables those machines actually consume, so the parts are on the shelf before the service falls due instead of being ordered when it does.",
    category: "Supply",
    serviceSlug: "parts-supply",
    order: 17,
  },
  {
    id: "faq-safety-file",
    question: "Can you supply a health and safety file for our site?",
    answer:
      "Yes. Method statements, risk assessments, operator competencies, medicals, legal appointments, plant inspection records and insurance certificates are prepared per site to the requirements of your SHE department. Tell us the template you use and we complete yours rather than submitting ours.",
    category: "Safety",
    order: 18,
  },
  {
    id: "faq-incidents",
    question: "How do you handle incidents and near misses?",
    answer:
      "Every incident and near miss is reported, investigated to root cause and closed out with a corrective action that is verified rather than assumed. Where the work is on your site, your reporting protocol takes precedence and our record follows yours.",
    category: "Safety",
    order: 19,
  },
  {
    id: "faq-environment",
    question: "How do you manage spills and waste on site?",
    answer:
      "Spill containment is deployed before any line, filter or drain plug is opened — not fetched after a spill. Used oil, filters, rags and coolant are captured on site and disposed of through licensed contractors, with disposal certificates available for your environmental file.",
    category: "Safety",
    order: 20,
  },
  {
    id: "faq-quote-time",
    question: "How long does a quotation take?",
    answer:
      "Plant hire rates and parts quotations are usually back within 24 hours. Earthworks and contract work need a site visit first, and we give you the date of that visit when you submit the request rather than leaving it open.",
    category: "Quotes",
    order: 21,
  },
  {
    id: "faq-site-visit",
    question: "Do you charge for a site visit or assessment?",
    answer:
      "Not for a quotation on work we are being considered for. If a visit turns into diagnostic work on a machine — measuring pressures, pulling codes, stripping to assess — that is chargeable and it is agreed with you before it starts.",
    category: "Quotes",
    order: 22,
  },
  {
    id: "faq-vendor",
    question: "Are you set up for corporate vendor onboarding?",
    answer:
      "Yes. Company registration, tax clearance, banking confirmation, insurance certificates and B-BBEE documentation are maintained as a current pack and issued on request. Send us your vendor form and we complete yours rather than sending our own set of documents.",
    category: "Quotes",
    order: 23,
  },
  {
    id: "faq-payment",
    question: "What are your payment terms?",
    answer:
      "Terms are stated on the quotation. Account facilities are available to onboarded corporate and municipal clients subject to the usual credit application; otherwise work is quoted on a deposit and completion basis.",
    category: "Quotes",
    order: 24,
  },
];

/* --- Insight ---------------------------------------------------------------- */

export const news: NewsPost[] = [
  {
    id: "news-haul-roads",
    slug: "haul-road-maintenance-cheapest-productivity-gain",
    title: "The haul road is the cheapest productivity gain on most sites",
    excerpt:
      "Rolling resistance is paid on every cycle of every shift. Very few interventions return as much for as little as holding a road to its profile.",
    body:
      "Ask a production meeting where the next percentage point of throughput is coming from and the answers are usually expensive: another hauler, a bigger excavator, more operators. The cheapest answer is almost always already on site, and it is the road.\n\n## Rolling resistance is a tax on every load\n\nEvery percentage point of rolling resistance costs fuel and cycle time on every single load that crosses the surface. Unlike a machine purchase, the cost is invisible — it never appears as a line item, it just quietly raises the cost per tonne on everything.\n\nA road that has lost its cross-fall holds water in the wheel path. Water softens the layer, the wheel path deepens, and the deeper path holds more water. The failure is self-accelerating, which is why patching it after the fact never quite catches up.\n\n## Tyres and struts are the bill you actually see\n\nRock in the wheel path is what takes a tyre out before its hours. Corrugation and potholes load suspension struts in ways they were never designed for. Those costs do land as line items, but by the time they do, the road has been bad for months.\n\n## What holding a road actually requires\n\nThree things, none of them dramatic:\n\n- A wearing course that is maintained to thickness rather than allowed to wear through to the layer beneath.\n- Cross-fall trimmed on a set frequency so the surface sheds water instead of holding it.\n- Drains that are cut and kept open, discharging clear of the formation rather than back onto it.\n\nThe grader pass that does this is not glamorous and it does not show up in a production report. It shows up in fuel, in tyres, and in the cycle time that the plan assumed you would get.\n\n## Do it on a frequency, not on a complaint\n\nThe operations that keep their roads are the ones that grade to a schedule. The ones that lose them are the ones that grade when somebody complains. By the time a haul truck driver complains, the wearing course is already gone.",
    category: "Operations",
    author: "Leikah Plant Hire",
    publishedAt: "2025-07-14",
    image: "dozer-d9t-dusk",
    featured: true,
    status: "published",
  },
  {
    id: "news-strip-report",
    slug: "what-an-honest-strip-report-contains",
    title: "What an honest strip report should contain — and why you should insist on one",
    excerpt:
      "A rebuild quoted before the unit is stripped is a guess. Here is what the report you approve should actually show you.",
    body:
      "The most expensive words in a workshop are \"we'll sort it out as we go\". A rebuild scope that is not built on measurement grows every week you ask about it, and neither side ends up happy.\n\n## Measure first, quote second\n\nAn engine or transmission should be stripped completely, cleaned and measured before a single part is ordered. Bores, journals, decks, bearing housings, gears, shafts and carriers all have OEM service limits. Either a component is inside them or it is not, and that is a number, not an opinion.\n\n## What the report should show you\n\n- **Measurements against service limits**, component by component, so you can see what is worn and by how much.\n- **Photographs** of the significant findings, not a general shot of the bench.\n- **A line-by-line parts schedule** with OEM and approved-equivalent options priced separately where an equivalent is being offered.\n- **Machining scope** stated explicitly, including who is doing it and what it will take.\n- **A turnaround date** built on the actual lead times, not on optimism.\n\n## Why it protects both sides\n\nWith that report in hand, you are approving a defined scope at a defined price. The workshop is protected too — nobody is arguing later about work that was always going to be necessary but was never written down.\n\n## The build sheet matters just as much\n\nWhen the unit is assembled, torque, clearance and end-float should be recorded at every critical joint. If a question arises in twelve months, there is a figure to check against instead of a memory. Ask for the build sheet with the completed job. Any workshop that hesitates has told you something.",
    category: "Workshop",
    author: "Leikah Plant Hire",
    publishedAt: "2025-05-28",
    image: "engine-block-machined",
    featured: true,
    status: "published",
  },
  {
    id: "news-oil-analysis",
    slug: "planning-component-changes-on-oil-analysis",
    title: "Planning component changes on evidence instead of on failure",
    excerpt:
      "Oil analysis moves component replacement from an emergency into a budget line. The mechanism is simpler than it sounds.",
    body:
      "Unplanned failure costs several times what the same repair costs when it is planned — in emergency parts pricing, in recovery, and in the production that stops while it is all arranged. Oil analysis is the least expensive way to move that spend from unplanned to planned.\n\n## Trends, not single results\n\nA single oil result tells you very little. Read in isolation, a slightly elevated iron figure could be anything. Read as the fourth rising result in a row on the same component, it is a bearing or a gear set telling you what it intends to do.\n\nThe discipline is therefore trending: sample at every service, on the same component, and plot the result. Wear metals, silicon and viscosity are the three that carry most of the signal.\n\n## What each one is telling you\n\n- **Wear metals** — iron, copper, chrome, aluminium — point to which internal surface is deteriorating.\n- **Silicon** usually means dirt ingress. That is a filtration or a seal problem, and it will destroy a component far faster than normal wear.\n- **Viscosity** drifting off grade suggests fuel dilution, contamination, or oil that has simply been in service too long.\n\n## From a rising trend to a booked slot\n\nA rising trend triggers a physical inspection. An inspection that confirms it books the unit into the workshop at a time that suits your production plan. Parts are ordered at normal lead times rather than at emergency rates, and the machine comes off when you can afford to lose it.\n\nThat is the whole mechanism. It is not complicated, and it does not require new technology. It requires sampling every time and actually reading the trend when the results come back.",
    category: "Maintenance",
    author: "Leikah Plant Hire",
    publishedAt: "2025-03-19",
    image: "adt-transmission-assembly",
    featured: false,
    status: "published",
  },
];
