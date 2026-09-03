import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CornerMarks, GoldBloom, SurveyGrid } from "@/components/graphics/Atmosphere";
import {
  getBusiness,
  getPageMeta,
  getServiceBySlug,
  getServicesByDivision,
} from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("emergency");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/emergency",
    image: page.image,
    seo: page.seo,
  });
}

/** What the response vehicle carries — the reason most call-outs close on visit one. */
const ON_BOARD = [
  ["Diagnostics", "OEM fault codes, live data and parameter checks on a laptop at the machine."],
  ["Hose crimping", "Hose stock, fittings and a crimper, so a burst line is measured, made and fitted on the spot."],
  ["Welding plant", "Portable welding for field repair of structures, mountings and brackets."],
  ["Fluid transfer", "Oil, coolant and fuel transfer with spill containment deployed before anything is opened."],
  ["Pressure testing", "Gauges and flow meters, so the fault is measured rather than guessed at."],
  ["Common consumables", "Filters, seals, belts and the fasteners that account for most call-outs."],
];

const BEFORE_YOU_CALL = [
  "Machine make, model and fleet number",
  "What it was doing when it stopped",
  "Any fault codes or warning lamps showing",
  "Whether the machine can be moved, and to where",
  "Site name, access route and gate requirements",
  "Site contact and their number",
  "Induction or permit requirements for our crew",
];

export default async function EmergencyPage() {
  const [page, business, service, services] = await Promise.all([
    getPageMeta("emergency"),
    getBusiness(),
    getServiceBySlug("breakdown-response"),
    getServicesByDivision("emergency"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Emergency Services", path: "/emergency" },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Emergency" }]}
      />

      {/* --- The line ------------------------------------------------------------ */}
      <section className="relative isolate overflow-hidden border-y border-gold-500/25 bg-ink-900">
        <SurveyGrid opacity={0.4} />
        <GoldBloom className="left-1/2 -top-60 -translate-x-1/2" size="60rem" />

        <div className="shell relative py-14 text-center lg:py-20">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-3 text-gold-400">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full rounded-full bg-signal-green opacity-70 motion-safe:animate-[leikah-pulse-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex size-2.5 rounded-full bg-signal-green" />
              </span>
              The line is open right now
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={telHref(business.emergencyPhone)}
              className="mt-6 inline-block font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-none font-black tracking-tight text-gold-gradient tabular transition-opacity hover:opacity-85"
            >
              {business.emergencyPhone}
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-steel-300">
              {business.emergencyNote}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={telHref(business.emergencyPhone)}
                className="chamfer-sm inline-flex h-14 w-full items-center justify-center gap-3 bg-gold-500 px-8 font-semibold text-ink-950 transition-colors hover:bg-gold-400 sm:w-auto"
              >
                <Phone className="size-4" />
                Call the breakdown line
              </a>
              <a
                href={whatsappHref(
                  business.whatsapp,
                  "Breakdown — machine down on site. Details to follow.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="chamfer-sm inline-flex h-14 w-full items-center justify-center gap-3 border border-steel-600/30 px-7 font-medium text-paper-50 transition-colors hover:border-gold-500/60 sm:w-auto"
              >
                <MessageCircle className="size-4 text-gold-400" />
                WhatsApp the details
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Response process ----------------------------------------------------- */}
      {service && (
        <Section tone="darker">
          <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="What happens after you call"
              title="From the call to the written fault report"
              lead="Five stages. The last one is what stops you paying for the same failure twice."
              tone="darker"
            />
            <ProcessTimeline steps={service.process} />
          </div>
        </Section>
      )}

      {/* --- On board -------------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal direction="right">
            <div className="chamfer overflow-hidden border border-ink-900/10">
              <Media
                media="leikah-response-vehicle"
                sizes="(min-width: 1024px) 50vw, 100vw"
                ratio="4 / 3"
                className="w-full"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="On the vehicle"
              title="Equipped to finish the job on the first visit"
              lead="A second trip costs you another shift. The units are stocked so that most call-outs never need one."
              tone="light"
            />
            <RevealGroup className="flex flex-col divide-y divide-ink-900/10 border-y border-ink-900/10">
              {ON_BOARD.map(([title, body]) => (
                <RevealItem key={title} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:gap-8">
                  <h3 className="shrink-0 text-sm font-bold text-ink-950 sm:w-36">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-500">{body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* --- Before you call --------------------------------------------------------- */}
      <Section tone="darker" tight>
        <div className="shell">
          <Reveal>
            <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-8 brushed sm:p-12">
              <CornerMarks />
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <span className="eyebrow text-gold-500">Have this ready</span>
                  <h2 className="mt-4 text-display-4 text-paper-50">
                    Seven things that get a unit moving faster
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-steel-400">
                    None of it is essential — call first and we will work the rest out. But having it
                    to hand is usually the difference between an hour and half a day.
                  </p>
                </div>
                <ol className="flex flex-col divide-y divide-steel-600/15 border-y border-steel-600/15">
                  {BEFORE_YOU_CALL.map((item, i) => (
                    <li key={item} className="flex items-center gap-4 py-3">
                      <span className="eyebrow shrink-0 text-gold-500/70 tabular">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-steel-300">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Services ------------------------------------------------------------------ */}
      {services.length > 0 && (
        <Section tone="dark" tight>
          <div className="shell flex flex-col gap-8">
            <SectionHeading eyebrow="Also on call" title="Round-the-clock site services" size="md" />
            <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {services.map((item) => (
                <RevealItem key={item.id} className="flex">
                  <ServiceCard service={item} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}
    </>
  );
}
