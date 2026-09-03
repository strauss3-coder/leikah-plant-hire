import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading, Paragraphs } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import {
  getBusiness,
  getIndustries,
  getIndustryBySlug,
  getProjects,
  getServices,
} from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};

  return buildMetadata({
    title: `${industry.name} — Plant Hire & Maintenance`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    image: industry.image,
    seo: industry.seo,
  });
}

export default async function IndustryDetailPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const [industry, services, projects, business] = await Promise.all([
    getIndustryBySlug(slug),
    getServices(),
    getProjects(),
    getBusiness(),
  ]);

  if (!industry) notFound();

  const sectorServices = services.filter((s) => industry.serviceSlugs.includes(s.slug));
  const sectorProjects = projects.filter((p) => p.industrySlug === industry.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ])}
      />

      <PageHeader
        blueprint="hauler"
        eyebrow="Sector"
        headline={industry.name}
        lead={industry.summary}
        image={industry.image}
        trail={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: industry.name },
        ]}
      />

      {/* --- Overview + compliance --------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="The sector"
              title={`Working in ${industry.name.toLowerCase()}`}
              tone="darker"
            />
            <Reveal delay={0.1}>
              <Paragraphs
                text={industry.overview}
                paragraphClassName="text-steel-300 sm:text-lg"
              />
            </Reveal>
          </div>

          <Reveal direction="left">
            <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <CornerMarks />
              <h2 className="eyebrow flex items-center gap-2.5 text-gold-500">
                <FileCheck2 className="size-4" />
                Compliance in this sector
              </h2>
              <ul className="mt-5 flex flex-col gap-4">
                {industry.compliance.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-steel-300">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Challenges ---------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="The real constraints"
            title="What actually costs money in this sector"
            lead="Not a generic list of pain points. These are the pressures the operations we work for talk about in their own production meetings."
            tone="light"
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-ink-900/10 sm:grid-cols-2">
            {industry.challenges.map((challenge) => (
              <RevealItem key={challenge.title} className="flex gap-4 bg-paper-100 p-7">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold-600" />
                <div>
                  <h3 className="text-base font-bold text-ink-950">{challenge.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {challenge.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Services ------------------------------------------------------------ */}
      {sectorServices.length > 0 && (
        <Section tone="darker">
          <div className="shell flex flex-col gap-12">
            <SectionHeading
              eyebrow="What we bring"
              title={`Services we run for ${industry.name.toLowerCase()}`}
              tone="darker"
              className="max-w-3xl"
            />
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {sectorServices.map((service, i) => (
                <RevealItem key={service.id} className="flex">
                  <ServiceCard service={service} index={i} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      {/* --- Projects ------------------------------------------------------------- */}
      {sectorProjects.length > 0 && (
        <Section tone="dark">
          <div className="shell flex flex-col gap-12">
            <SectionHeading
              eyebrow="Work delivered"
              title="Recent contracts in this sector"
              className="max-w-3xl"
            />
            <RevealGroup className="grid gap-4 lg:grid-cols-3" stagger={0.08}>
              {sectorProjects.map((project) => (
                <RevealItem key={project.id} className="flex">
                  <ProjectCard project={project} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <CtaBanner
        headline={`Tell us about your ${industry.name.toLowerCase()} operation`}
        body="Send the scope and the constraint you are working against. We will tell you which of our services answers it — and if none of them do, we will say so."
        phone={business.phone}
      />
    </>
  );
}
