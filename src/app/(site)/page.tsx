import { ShieldCheck } from "lucide-react";
import { HomeHero } from "@/components/site/HomeHero";
import { BrandBand } from "@/components/site/BrandBand";
import { StatsBand } from "@/components/site/StatsBand";
import { Marquee } from "@/components/site/Marquee";
import { FleetShowcase } from "@/components/site/FleetShowcase";
import { ServiceEditorial } from "@/components/site/ServiceEditorial";
import { IndustryTiles } from "@/components/site/IndustryTiles";
import { ProcessWalkthrough } from "@/components/site/ProcessWalkthrough";
import { ProjectCard } from "@/components/site/ProjectCard";
import { DivisionShowcase } from "@/components/site/DivisionShowcase";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Media, MediaScrim } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading, Eyebrow, Paragraphs } from "@/components/ui/Section";
import { EquipmentIcon, resolveIcon } from "@/components/graphics/EquipmentIcon";
import { Blueprint } from "@/components/graphics/Blueprint";
import {
  Parallax,
  CornerMarks,
  StrataDivider,
  BrandWatermark,
  BigWordmark,
  SurveyGrid,
  DustField,
  TerrainContours,
} from "@/components/graphics/Atmosphere";
import { TextLink, ButtonLink } from "@/components/ui/Button";
import {
  getBusiness,
  getHome,
  getDivisions,
  getFeaturedServices,
  getFleet,
  getIndustries,
  getFeaturedProjects,
  getFeaturedTestimonials,
} from "@/lib/cms";
import type { EquipmentKey } from "@/components/graphics/EquipmentIcon";

/* ============================================================================
   HOMEPAGE

   Sequenced as a narrative rather than a list of capabilities:

     name → what stops → who answers → proof → the plant → the work →
     how a job runs → who it is for → evidence → safety → ask

   Every band carries a different structural device — oversized wordmark,
   survey readout, machine plate, editorial split, bench walkthrough, image
   tiles — so no two sections read the same way down the page.
   ========================================================================= */

export default async function HomePage() {
  const [business, home, divisions, services, fleet, industries, projects, testimonials] =
    await Promise.all([
      getBusiness(),
      getHome(),
      getDivisions(),
      getFeaturedServices(7),
      getFleet(),
      getIndustries(),
      getFeaturedProjects(3),
      getFeaturedTestimonials(6),
    ]);

  return (
    <>
      <HomeHero hero={home.hero} business={business} />

      {/* --- The name, once, enormous ---------------------------------------- */}
      <BrandBand statement={home.brandStatement} footnote={home.brandFootnote} />

      {/* --- Footprint ------------------------------------------------------- */}
      <div className="border-b border-steel-600/25 bg-ink-950 py-5">
        <div className="shell-wide flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
          <span className="eyebrow shrink-0 text-gold-500">{home.trustLine}</span>
          <Marquee items={business.serviceAreas} className="flex-1" />
        </div>
      </div>

      {/* --- What we do ------------------------------------------------------ */}
      <Section tone="darker" id="introduction" className="overflow-hidden">
        <BrandWatermark className="-left-40 top-10" size="38rem" opacity={0.035} />

        <div className="shell relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-7">
            <SectionHeading
              eyebrow={home.introEyebrow}
              title={home.introHeadline}
              size="xl"
              tone="darker"
            />
            <Reveal delay={0.14}>
              <Paragraphs text={home.introBody} paragraphClassName="text-steel-300 sm:text-lg" />
            </Reveal>

            <RevealGroup className="mt-2 flex flex-col divide-y divide-steel-600/25 border-t border-steel-600/25">
              {home.introPoints.map((point) => (
                <RevealItem key={point.title} className="flex gap-5 py-5">
                  <span aria-hidden="true" className="mt-2 h-px w-8 shrink-0 bg-gold-500" />
                  <div>
                    <h3 className="text-base font-bold text-paper-50">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                      {point.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <TextLink href="/about">The full story behind the yard</TextLink>
            </Reveal>
          </div>

          <Reveal direction="left" className="relative">
            <div className="chamfer relative overflow-hidden border border-steel-600/25">
              <Parallax distance={26}>
                <Media
                  media={home.introImage}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  ratio="4 / 3"
                  className="w-full scale-110"
                  imageClassName="object-cover"
                />
              </Parallax>
              <MediaScrim from="bottom" intensity="light" />
            </div>

            <div className="chamfer-sm relative z-10 -mt-12 ml-6 max-w-sm border border-steel-600/30 bg-ink-900/95 p-6 backdrop-blur-xl lg:-mt-16 lg:ml-10">
              <CornerMarks />
              <span className="eyebrow text-gold-500">Base of operations</span>
              <p className="mt-3 font-display text-lg font-bold text-paper-50">
                {business.address.street}, {business.address.suburb}
              </p>
              <p className="mt-1 text-sm text-steel-400">
                {business.address.city}, {business.address.province}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-steel-400">
                {business.address.directions}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <StrataDivider label="RL · Divisions" />

      {/* --- Divisions ------------------------------------------------------- */}
      <Section tone="darker" className="pt-0">
        <div className="shell-wide flex flex-col gap-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Operating divisions"
              title="Four divisions that answer to one contract"
              lead="Production and maintenance under one roof, so there is no gap in the middle for a problem to fall into."
              tone="darker"
              className="max-w-3xl"
            />
            <Reveal delay={0.1}>
              <ButtonLink href="/services" variant="ghost" size="md" withArrow>
                All services
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal>
            <DivisionShowcase divisions={divisions} />
          </Reveal>
        </div>
      </Section>

      <StatsBand stats={home.stats} />

      {/* --- Fleet showcase --------------------------------------------------- */}
      <Section tone="darker" className="relative overflow-hidden">
        <BigWordmark className="top-6" opacity={0.045} align="center" />

        <div className="shell-wide relative flex flex-col gap-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow={home.fleetEyebrow}
              title={home.fleetHeadline}
              lead={home.fleetLead}
              tone="darker"
              className="max-w-3xl"
            />
            <Reveal delay={0.1}>
              <TextLink href="/fleet">The full fleet register</TextLink>
            </Reveal>
          </div>

          <Reveal>
            <FleetShowcase fleet={fleet} />
          </Reveal>
        </div>
      </Section>

      <StrataDivider label="RL · Capability" flip />

      {/* --- Services -------------------------------------------------------- */}
      <Section tone="dark" className="relative overflow-hidden">
        <Blueprint
          machine="dozer"
          intensity={0.24}
          stroke="var(--color-gold-500)"
          className="absolute -right-32 top-24 hidden h-auto w-[40rem] xl:block"
        />
        <BrandWatermark className="-left-32 bottom-8" size="30rem" opacity={0.04} />

        <div className="shell relative flex flex-col gap-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Capability"
              title="What we are asked for most"
              lead="Each service has its own method, plant list and safety controls. Nothing here is a category heading — it is work we do to a documented process."
              className="max-w-3xl"
            />
            <Reveal delay={0.1}>
              <TextLink href="/services">See all thirteen services</TextLink>
            </Reveal>
          </div>

          <ServiceEditorial services={services} />
        </div>
      </Section>

      {/* --- Process walkthrough ---------------------------------------------- */}
      <Section tone="darker" className="relative overflow-hidden">
        <TerrainContours intensity={0.8} />

        <div className="shell-wide relative flex flex-col gap-12">
          <SectionHeading
            eyebrow={home.processEyebrow}
            title={home.processHeadline}
            lead={home.processLead}
            tone="darker"
            className="max-w-3xl"
          />

          <ProcessWalkthrough
            stages={home.processStages.map((s) => ({ ...s, icon: s.icon as EquipmentKey }))}
          />
        </div>
      </Section>

      {/* --- Why us ------------------------------------------------------------ */}
      <Section tone="light" className="relative overflow-hidden">
        <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="Why operations choose Leikah"
            title="The difference is in what gets written down"
            lead="Anyone can move dirt or turn a spanner. What a mine planner or a maintenance manager actually buys is predictability — and predictability is a documentation habit."
            tone="light"
            size="xl"
          />

          <RevealGroup className="grid gap-px bg-ink-900/12 sm:grid-cols-2">
            {home.whyUs.map((reason) => (
              <RevealItem key={reason.title} className="group bg-paper-100 p-7 transition-colors hover:bg-paper-50">
                <span className="chamfer-sm inline-flex size-14 items-center justify-center border border-ink-900/12 bg-paper-50 text-gold-700 transition-colors group-hover:border-gold-600/40">
                  <EquipmentIcon name={resolveIcon(reason.icon)} className="size-8" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-950">{reason.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{reason.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Sectors ----------------------------------------------------------- */}
      <Section tone="darker" className="relative overflow-hidden">
        <div className="shell-wide relative flex flex-col gap-12">
          <SectionHeading
            eyebrow="Sectors"
            title="The pressure is different in every sector"
            lead="Mining, quarrying, civils, industrial and public-sector operations each carry constraints of their own. We work to yours, not to a generic method."
            tone="darker"
            className="max-w-3xl"
          />
          <IndustryTiles industries={industries} />
        </div>
      </Section>

      <StrataDivider label="RL · Work delivered" />

      {/* --- Projects ---------------------------------------------------------- */}
      <Section tone="dark" className="pt-0">
        <div className="shell flex flex-col gap-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Recent work"
              title="What the work looked like, and what it changed"
              lead="Client names are withheld where contracts require it. Everything else — the method, the programme and the outcome — is on the record."
              className="max-w-3xl"
            />
            <Reveal delay={0.1}>
              <TextLink href="/projects">All projects</TextLink>
            </Reveal>
          </div>

          <RevealGroup className="grid gap-4 lg:grid-cols-3" stagger={0.08}>
            {projects.map((project) => (
              <RevealItem key={project.id} className="flex">
                <ProjectCard project={project} className="w-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Health & safety ---------------------------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Media
            media={home.safetyImage}
            alt=""
            sizes="100vw"
            className="size-full"
            imageClassName="object-cover"
            ratio="auto"
          />
          <div className="absolute inset-0 bg-ink-950/89" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/82 to-ink-950/45" />
          <SurveyGrid opacity={0.5} />
          <DustField density={30} tone="steel" />
        </div>

        <div className="shell section grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>{home.safetyEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-display-2 text-paper-50">{home.safetyHeadline}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg">
                {home.safetyBody}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ButtonLink href="/health-safety" variant="secondary" withArrow>
                Our HSEQ standards
              </ButtonLink>
            </Reveal>
          </div>

          <RevealGroup className="flex flex-col gap-px bg-steel-100/14">
            {home.safetyPoints.map((point) => (
              <RevealItem
                key={point}
                className="flex items-start gap-4 bg-ink-950/72 p-6 backdrop-blur-md"
              >
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-500" />
                <p className="text-sm leading-relaxed text-steel-200">{point}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* --- Testimonials (renders only with real feedback) ---------------------- */}
      {testimonials.length > 0 && (
        <Section tone="darker">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Client feedback"
              title="What the operations we work for say"
              tone="darker"
            />
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </Section>
      )}

      <CtaBanner headline={home.ctaHeadline} body={home.ctaBody} phone={business.emergencyPhone} />
    </>
  );
}
