import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { FleetShowcase } from "@/components/site/FleetShowcase";
import { CtaBanner } from "@/components/site/CtaBanner";
import { EquipmentIcon, type EquipmentKey } from "@/components/graphics/EquipmentIcon";
import { StrataDivider, CornerMarks } from "@/components/graphics/Atmosphere";
import { getBusiness, getFleet } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Fleet",
    description:
      "Dozers, excavators, articulated haulers, graders, water bowsers and mobile field service units on hire across the Mpumalanga coalfields.",
    path: "/fleet",
    image: "dozer-d10t-refurbished",
  });
}

export default async function FleetPage() {
  const [fleet, business] = await Promise.all([getFleet(), getBusiness()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
        ])}
      />

      <PageHeader
        blueprint="dozer"
        eyebrow="Plant & equipment"
        headline="The fleet, class by class"
        lead="Machine class matched to the bench, the haul and the ground. Every unit goes out on a signed photographic condition report and comes back the same way."
        image="dozer-d10t-refurbished"
        trail={[{ label: "Home", href: "/" }, { label: "Fleet" }]}
      />

      <Section tone="darker">
        <div className="shell-wide">
          <Reveal>
            <FleetShowcase fleet={fleet} />
          </Reveal>
        </div>
      </Section>

      <StrataDivider label="RL · Full register" />

      {/* --- The register: every class, with its full application list -------- */}
      <Section tone="dark" className="pt-0">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="Register"
            title="What each class is for"
            lead="Described by duty rather than by unit count — a fleet list is out of date the week it is published, and a machine you were promised that is on another site helps nobody."
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-4 lg:grid-cols-2" stagger={0.06}>
            {fleet.map((item) => (
              <RevealItem key={item.id} className="flex">
                <article className="chamfer relative flex w-full flex-col gap-6 border border-steel-600/25 bg-ink-900 p-7">
                  <CornerMarks />

                  <div className="flex items-start gap-5">
                    <span className="chamfer-sm inline-flex size-16 shrink-0 items-center justify-center border border-gold-500/35 text-gold-400">
                      <EquipmentIcon name={item.icon as EquipmentKey} className="size-10" />
                    </span>
                    <div>
                      <span className="eyebrow text-steel-500">{item.category}</span>
                      <h3 className="mt-2 text-display-4 text-paper-50">{item.name}</h3>
                      <p className="mt-2 text-sm font-medium text-gold-400">{item.strapline}</p>
                    </div>
                  </div>

                  <Media
                    media={item.image}
                    alt=""
                    ratio="16 / 9"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="chamfer-sm w-full"
                  />

                  <p className="text-sm leading-relaxed text-steel-400">{item.description}</p>

                  <dl className="grid gap-px bg-steel-600/25 sm:grid-cols-2">
                    {item.specs.map((spec) => (
                      <div key={spec.label} className="bg-ink-900 py-3 pr-3">
                        <dt className="eyebrow text-[0.5625rem] text-steel-500">{spec.label}</dt>
                        <dd className="mt-1 text-sm font-semibold text-paper-50">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div>
                    <h4 className="eyebrow mb-3 text-steel-500">Typical applications</h4>
                    <ul className="flex flex-col gap-2">
                      {item.applications.map((a) => (
                        <li key={a} className="flex gap-3 text-sm text-steel-300">
                          <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-500" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.serviceSlug && (
                    <Link
                      href={`/services/${item.serviceSlug}`}
                      className="group/link mt-auto inline-flex w-fit items-center gap-2 border-t border-steel-600/25 pt-5 text-sm font-medium text-gold-400"
                    >
                      <span className="relative">
                        How we run it
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 group-hover/link:w-full" />
                      </span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CtaBanner
        headline="Need a machine on site?"
        body="Tell us the bench height, the haul distance and the hours you need it for, and we will tell you which class fits and what it costs."
        phone={business.emergencyPhone}
        primaryLabel="Check availability"
        primaryHref="/quote?service=plant-hire"
      />
    </>
  );
}
