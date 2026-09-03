import type { Metadata } from "next";
import { Gauge, LineChart, ClipboardCheck, Timer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media, MediaScrim } from "@/components/ui/Media";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { CtaBanner } from "@/components/site/CtaBanner";
import { ButtonLink } from "@/components/ui/Button";
import { CornerMarks, Parallax } from "@/components/graphics/Atmosphere";
import {
  getBusiness,
  getPageMeta,
  getServiceBySlug,
  getServicesByDivision,
} from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("maintenance");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/maintenance",
    image: page.image,
    seo: page.seo,
  });
}

/* The economic argument for planned maintenance, stated without hand-waving. */
const ECONOMICS = [
  {
    icon: LineChart,
    title: "Unplanned failure costs several times the planned repair",
    body: "Emergency parts pricing, recovery, standing time and the production lost while it is all arranged — none of which appear when the same component is changed on a schedule.",
  },
  {
    icon: Gauge,
    title: "Oil analysis buys you weeks of warning",
    body: "Wear metals, silicon and viscosity trended per component show a bearing or gear set deteriorating long before it becomes a symptom on the machine.",
  },
  {
    icon: Timer,
    title: "Servicing planned around production, not into it",
    body: "The service matrix is written against your production calendar, so machines come off during hours you can afford to lose them.",
  },
  {
    icon: ClipboardCheck,
    title: "Component spend becomes a budget line",
    body: "Replacement moves from unpredictable emergency spend to a forecastable item you can put in next quarter's budget with a date against it.",
  },
];

export default async function MaintenancePage() {
  const [page, services, business, pmService] = await Promise.all([
    getPageMeta("maintenance"),
    getServicesByDivision("mechanical"),
    getBusiness(),
    getServiceBySlug("preventive-maintenance"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Maintenance Solutions", path: "/maintenance" },
        ])}
      />

      <PageHeader
        blueprint="engine"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Maintenance" }]}
      >
        <ButtonLink href="/quote?service=preventive-maintenance" size="lg" withArrow>
          Discuss a maintenance contract
        </ButtonLink>
      </PageHeader>

      {/* --- The economics --------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Why planned beats reactive"
            title="The argument for planning, in four figures your finance team already knows"
            lead="None of this is new. What changes outcomes is running it as a discipline rather than as an intention."
            tone="darker"
            size="xl"
          />

          <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2">
            {ECONOMICS.map(({ icon: Icon, title, body }) => (
              <RevealItem key={title} className="flex flex-col gap-4 bg-ink-900 p-7">
                <span className="chamfer-sm inline-flex size-12 items-center justify-center border border-steel-600/25 text-gold-400">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base leading-snug font-bold text-paper-50">{title}</h3>
                <p className="text-sm leading-relaxed text-steel-400">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Workshop capability --------------------------------------------- */}
      <Section tone="light">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal direction="right">
            <div className="chamfer relative overflow-hidden border border-ink-900/10">
              <Parallax distance={24}>
                <Media
                  media="engine-block-machined"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  ratio="4 / 3"
                  className="w-full scale-110"
                />
              </Parallax>
              <MediaScrim from="bottom" intensity="light" />
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="The workshop"
              title="Quoted after the strip, never before it"
              lead="A rebuild scope that is not built on measurement grows every week you ask about it. Ours is built on gauged findings and issued in writing before a single part is ordered."
              tone="light"
            />

            <RevealGroup className="flex flex-col divide-y divide-ink-900/10 border-y border-ink-900/10">
              {[
                ["Strip report", "Measurements against OEM service limits, with photographs of every significant finding."],
                ["Parts schedule", "Line by line, with OEM and approved-equivalent options priced separately."],
                ["Build sheet", "Torque, clearance and end-float recorded and signed at every critical joint."],
                ["Run and test", "Run, timed and load-checked in the workshop before it is released to site."],
              ].map(([title, body]) => (
                <RevealItem key={title} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:gap-8">
                  <h3 className="shrink-0 text-sm font-bold text-ink-950 sm:w-40">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-500">{body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* --- Contract process -------------------------------------------------- */}
      {pmService && (
        <Section tone="darker">
          <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="How a contract starts"
              title="From fleet audit to a monthly review"
              lead="Five stages, each with an output your maintenance planner can use directly."
              tone="darker"
            />
            <ProcessTimeline steps={pmService.process} />
          </div>
        </Section>
      )}

      {/* --- Services ------------------------------------------------------------ */}
      <Section tone="dark">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="Mechanical division"
            title="Everything the workshop and the mobile units cover"
            className="max-w-3xl"
          />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {services.map((service, i) => (
              <RevealItem key={service.id} className="flex">
                <ServiceCard service={service} index={i} className="w-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Reporting ------------------------------------------------------------ */}
      <Section tone="darker" tight>
        <div className="shell">
          <Reveal>
            <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-8 brushed sm:p-12">
              <CornerMarks />
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <span className="eyebrow text-gold-500">Monthly reporting</span>
                  <h2 className="mt-4 text-display-4 text-paper-50">
                    Reporting your planner can drop straight into their own system
                  </h2>
                </div>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {[
                    "Availability per machine",
                    "Cost per operating hour",
                    "Defect backlog and ageing",
                    "Oil analysis trend per component",
                    "Undercarriage and wear measurement",
                    "Component changes due next period",
                    "Services completed against plan",
                    "Outstanding parts and lead times",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-steel-300">
                      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        headline="Send us your fleet list"
        body="We will audit it, build a service matrix against your production calendar, and show you what the planned version of your current maintenance spend looks like."
        phone={business.phone}
        primaryLabel="Start with a fleet audit"
        primaryHref="/quote?service=preventive-maintenance"
      />
    </>
  );
}
