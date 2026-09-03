import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading, Paragraphs, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { Accordion } from "@/components/ui/Accordion";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { EquipmentIcon, resolveIcon } from "@/components/graphics/EquipmentIcon";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import { ButtonLink } from "@/components/ui/Button";
import {
  getBusiness,
  getServices,
  getServiceBySlug,
  getIndustries,
  getFaqsForService,
} from "@/lib/cms";
import { getMediaList } from "@/lib/cms/media";
import {
  buildMetadata,
  JsonLd,
  breadcrumbSchema,
  serviceSchema,
  faqSchema,
} from "@/lib/seo";

/** The technical drawing each division opens with. */
const DIVISION_BLUEPRINTS: Record<string, "excavator" | "dozer" | "hauler" | "engine"> = {
  earthmoving: "excavator",
  mechanical: "engine",
  supply: "hauler",
  emergency: "dozer",
};

const DIVISION_LABELS: Record<string, string> = {
  earthmoving: "Earthmoving & Plant Hire",
  mechanical: "Heavy Mechanical",
  supply: "Supply Division",
  emergency: "24-Hour Breakdown",
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.image,
    seo: service.seo,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, allServices, industries, business, faqs] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getIndustries(),
    getBusiness(),
    getFaqsForService(slug),
  ]);

  if (!service) notFound();

  const related = allServices.filter((s) => service.relatedSlugs.includes(s.slug));
  const sectors = industries.filter((i) => service.industries.includes(i.slug));
  // Capped at four so the row always fills — an orphaned fifth tile in a
  // four-column grid reads as a mistake. The full set is on /gallery.
  const gallery = getMediaList(service.gallery).slice(0, 4);
  const galleryCols =
    ({ 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" } as Record<number, string>)[
      gallery.length
    ] ?? "lg:grid-cols-4";

  return (
    <>
      <JsonLd data={serviceSchema(service, business)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      <PageHeader
        blueprint={DIVISION_BLUEPRINTS[service.division] ?? "excavator"}
        eyebrow={DIVISION_LABELS[service.division] ?? "Service"}
        headline={service.title}
        lead={service.summary}
        image={service.image}
        trail={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={`/quote?service=${service.slug}`} size="lg" withArrow>
            Request a quotation
          </ButtonLink>
          <span className="chamfer-sm inline-flex h-14 items-center gap-3 border border-steel-600/25 px-5 text-sm text-steel-200">
            <EquipmentIcon name={resolveIcon(service.icon, service.slug)} className="size-7 text-gold-400" />
            {service.availability}
          </span>
        </div>
      </PageHeader>

      {/* --- Overview + spec rail ---------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Overview"
              title="What the work involves"
              tone="darker"
              size="lg"
              id="overview"
            />
            <Reveal delay={0.1}>
              <Paragraphs
                text={service.overview}
                paragraphClassName="text-steel-300 sm:text-lg"
              />
            </Reveal>
          </div>

          {/* Sticky spec plate — the summary a buyer scans before reading. */}
          <Reveal direction="left">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed">
                <CornerMarks />
                <Eyebrow>At a glance</Eyebrow>

                <dl className="mt-5 flex flex-col divide-y divide-steel-600/15">
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-xs text-steel-500">Division</dt>
                    <dd className="text-right text-sm font-medium text-steel-100">
                      {DIVISION_LABELS[service.division] ?? service.division}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-xs text-steel-500">Availability</dt>
                    <dd className="text-right text-sm font-medium text-steel-100">
                      {service.availability}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-xs text-steel-500">Method steps</dt>
                    <dd className="text-right text-sm font-medium text-steel-100 tabular">
                      {service.process.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-xs text-steel-500">Sectors served</dt>
                    <dd className="text-right text-sm font-medium text-steel-100 tabular">
                      {sectors.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-xs text-steel-500">Base</dt>
                    <dd className="text-right text-sm font-medium text-steel-100">
                      {business.address.city}
                    </dd>
                  </div>
                </dl>

                <ButtonLink
                  href={`/quote?service=${service.slug}`}
                  className="mt-6 w-full"
                  withArrow
                >
                  Get a quotation
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Benefits ----------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="What you get"
            title="What this actually changes for your operation"
            tone="light"
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-ink-900/10 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <RevealItem key={benefit.title} className="flex gap-4 bg-paper-100 p-7">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-600" />
                <div>
                  <h3 className="text-base font-bold text-ink-950">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {benefit.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Method -------------------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <SectionHeading
            eyebrow="Method"
            title="How the work runs, step by step"
            lead="Every stage has an output you can see. Nothing moves to the next step until the previous one is signed."
            tone="darker"
          />
          <ProcessTimeline steps={service.process} />
        </div>
      </Section>

      {/* --- Plant + safety ------------------------------------------------------- */}
      <Section tone="dark">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Plant & equipment" title="What we bring to it" size="md" />
            <RevealGroup className="flex flex-col divide-y divide-steel-600/15 border-y border-steel-600/15">
              {service.equipment.map((item) => (
                <RevealItem key={item.name} className="flex items-start gap-4 py-4">
                  <Wrench className="mt-0.5 size-4 shrink-0 text-gold-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-paper-50">{item.name}</h3>
                    <p className="mt-0.5 text-sm text-steel-400">{item.detail}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Safety controls"
              title="What is in place before work starts"
              size="md"
            />
            <RevealGroup className="flex flex-col divide-y divide-steel-600/15 border-y border-steel-600/15">
              {service.safety.map((item) => (
                <RevealItem key={item} className="flex items-start gap-4 py-4">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-500" />
                  <p className="text-sm leading-relaxed text-steel-300">{item}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal>
              <Link
                href="/health-safety"
                className="group inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300"
              >
                Full HSEQ standards
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --- Gallery -------------------------------------------------------------- */}
      {gallery.length > 0 && (
        <Section tone="darker" tight>
          <div className="shell flex flex-col gap-10">
            <SectionHeading
              eyebrow="On the job"
              title="This service, photographed on site"
              tone="darker"
              size="md"
            />
            <RevealGroup className={`grid grid-cols-2 gap-3 sm:gap-4 ${galleryCols}`} stagger={0.06}>
              {gallery.map((asset) => (
                <RevealItem key={asset.slug}>
                  <figure className="chamfer overflow-hidden border border-steel-600/18">
                    <Media
                      media={asset.slug}
                      ratio="4 / 3"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="w-full"
                    />
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300"
              >
                See the full gallery
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </Section>
      )}

      {/* --- Sectors --------------------------------------------------------------- */}
      {sectors.length > 0 && (
        <Section tone="dark">
          <div className="shell flex flex-col gap-10">
            <SectionHeading
              eyebrow="Sectors"
              title="Where this service is used"
              size="md"
              className="max-w-2xl"
            />
            <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
              {sectors.map((sector) => (
                <RevealItem key={sector.id}>
                  <Link
                    href={`/industries/${sector.slug}`}
                    className="group flex h-full flex-col gap-2.5 bg-ink-900 p-6 transition-colors hover:bg-ink-850"
                  >
                    <h3 className="text-base font-bold text-paper-50 transition-colors group-hover:text-gold-400">
                      {sector.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-steel-400">{sector.summary}</p>
                    <ArrowRight className="mt-auto size-4 text-steel-500 transition-all group-hover:translate-x-1 group-hover:text-gold-400" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      {/* --- FAQs ------------------------------------------------------------------ */}
      {faqs.length > 0 && (
        <Section tone="darker">
          <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <SectionHeading
              eyebrow="Questions"
              title="What clients ask about this service"
              tone="darker"
            />
            <Accordion
              items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
              defaultOpen={0}
            />
          </div>
        </Section>
      )}

      {/* --- Related --------------------------------------------------------------- */}
      {related.length > 0 && (
        <Section tone="dark" tight>
          <div className="shell flex flex-col gap-8">
            <SectionHeading eyebrow="Related" title="Usually bought alongside" size="md" />
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {related.map((item) => (
                <RevealItem key={item.id} className="flex">
                  <ServiceCard service={item} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <CtaBanner
        headline={`Need ${service.title.toLowerCase()}?`}
        body="Send the scope, the machine or the volume. You will get a straight answer on whether we can do it, when, and what it costs."
        phone={business.phone}
        primaryHref={`/quote?service=${service.slug}`}
      />
    </>
  );
}
