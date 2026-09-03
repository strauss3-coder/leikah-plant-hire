import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media, MediaScrim } from "@/components/ui/Media";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { CtaBanner } from "@/components/site/CtaBanner";
import { ButtonLink } from "@/components/ui/Button";
import { EquipmentIcon } from "@/components/graphics/EquipmentIcon";
import { CornerMarks, Parallax } from "@/components/graphics/Atmosphere";
import { getBusiness, getPageMeta, getServiceBySlug } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("supply");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/supply",
    image: page.image,
    seo: page.seo,
  });
}

const CATALOGUE = [
  {
    title: "Filtration",
    items: ["Engine oil, fuel and air", "Hydraulic and transmission", "Water separators", "Breathers and cartridges"],
  },
  {
    title: "Lubricants & fluids",
    items: ["Engine and gear oils", "Hydraulic fluid", "Greases and open-gear", "Coolant and additives"],
  },
  {
    title: "Hydraulic hose",
    items: ["Assemblies made to length", "Fittings and adaptors", "Quick couplers", "Hose protection and sleeving"],
  },
  {
    title: "Undercarriage",
    items: ["Track chains and shoes", "Idlers and rollers", "Sprockets and segments", "Recoil and adjuster parts"],
  },
  {
    title: "Ground-engaging tools",
    items: ["Bucket teeth and adaptors", "Cutting edges and end bits", "Wear plate and liners", "Retaining hardware"],
  },
  {
    title: "Workshop consumables",
    items: ["Bearings and seals", "Fasteners and hardware", "Welding consumables", "Rags, absorbents and spill kits"],
  },
];

const CORRIDOR = [
  "Heavy earthmoving OEM dealers",
  "Agricultural and industrial machinery",
  "Industrial electrical wholesalers",
  "CNC machining and engineering",
  "Automotive spares and consumables",
  "Commercial tyre and fitment",
];

export default async function SupplyPage() {
  const [page, business, service] = await Promise.all([
    getPageMeta("supply"),
    getBusiness(),
    getServiceBySlug("parts-supply"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Supply Division", path: "/supply" },
        ])}
      />

      <PageHeader
        blueprint="hauler"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Supply" }]}
      >
        <ButtonLink href="/quote?service=parts-supply" size="lg" withArrow>
          Request a parts quotation
        </ButtonLink>
      </PageHeader>

      {/* --- The corridor advantage ------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Why the address matters"
              title="The supply division exists because of where the yard is"
              lead="July Street sits inside one of the densest heavy-engineering corridors in Mpumalanga. That is not marketing — it is the reason a part that takes days elsewhere is collected here the same morning."
              tone="darker"
            />

            <Reveal delay={0.1}>
              <p className="text-sm leading-relaxed text-steel-400">
                {business.address.directions}
              </p>
            </Reveal>

            <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2">
              {CORRIDOR.map((item) => (
                <RevealItem
                  key={item}
                  className="flex items-center gap-3 bg-ink-950 px-5 py-4 text-sm text-steel-300"
                >
                  <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold-500" />
                  {item}
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal>
              <p className="text-xs text-steel-500">
                All within a short drive of the yard at {business.address.street},{" "}
                {business.address.suburb}.
              </p>
            </Reveal>
          </div>

          <Reveal direction="left">
            <div className="chamfer relative overflow-hidden border border-steel-600/18">
              <Parallax distance={24}>
                <Media
                  media="parts-dispatch-pallet"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  ratio="4 / 3"
                  className="w-full scale-110"
                />
              </Parallax>
              <MediaScrim from="bottom" intensity="medium" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Catalogue ---------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="What we supply"
            title="Held in stock, or collected the same day"
            lead="Common service items for the regional fleet mix are on the shelf. Everything else has a lead time confirmed on the order rather than estimated."
            tone="light"
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {CATALOGUE.map((group) => (
              <RevealItem key={group.title} className="flex flex-col gap-4 bg-paper-100 p-7">
                <h3 className="text-base font-bold text-ink-950">{group.title}</h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-500">
                      <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-gold-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Ordering process ---------------------------------------------------- */}
      {service && (
        <Section tone="darker">
          <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="Ordering"
              title="From part number to site delivery"
              lead="Machine model and serial are confirmed up front, which is what stops the wrong part arriving on a Friday afternoon."
              tone="darker"
            />
            <ProcessTimeline steps={service.process} />
          </div>
        </Section>
      )}

      {/* --- Standing orders ------------------------------------------------------ */}
      <Section tone="dark" tight>
        <div className="shell">
          <Reveal>
            <div className="chamfer relative border border-steel-600/18 bg-ink-850 p-8 brushed sm:p-12">
              <CornerMarks />
              <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
                <div className="flex flex-col gap-5">
                  <span className="chamfer-sm inline-flex size-14 items-center justify-center border border-gold-500/35 text-gold-400">
                    <EquipmentIcon name="pallet" className="size-9" />
                  </span>
                  <h2 className="text-display-4 text-paper-50">
                    Standing orders held against your fleet list
                  </h2>
                  <p className="text-sm leading-relaxed text-steel-400">
                    Send us the machines you run and we hold the service kits and consumables those
                    machines actually consume. The parts are on the shelf before the service falls
                    due — not ordered on the day it does.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    ["Nothing substituted quietly", "An approved equivalent is named on the quotation with the price difference shown."],
                    ["Labelled to machine and job", "Pallets arrive marked up so the fitment crew is not opening boxes to find out what is what."],
                    ["Delivered, not collected", "Site delivery across the coalfields is part of the service, not an extra."],
                  ].map(([title, body]) => (
                    <div key={title} className="border-l border-gold-500/40 pl-5">
                      <h3 className="text-sm font-bold text-paper-50">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-steel-400">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        headline="Send us a part number, or a photograph of the plate"
        body="Machine model and serial get us to the right part first time. Quotations on common items are usually back the same day."
        phone={business.phone}
        primaryLabel="Request a parts quotation"
        primaryHref="/quote?service=parts-supply"
      />
    </>
  );
}
