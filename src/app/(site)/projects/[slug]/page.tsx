import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, MapPin, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading, Paragraphs } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { MilestoneTimeline } from "@/components/site/ProcessTimeline";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import {
  getBusiness,
  getIndustryBySlug,
  getProjectBySlug,
  getProjects,
  getServices,
  getTestimonials,
} from "@/lib/cms";
import { getMediaList } from "@/lib/cms/media";
import { buildMetadata, JsonLd, breadcrumbSchema, projectSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.heroImage,
    seo: project.seo,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, allProjects, services, business, testimonials] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getServices(),
    getBusiness(),
    getTestimonials(),
  ]);

  if (!project) notFound();

  const industry = await getIndustryBySlug(project.industrySlug);
  const usedServices = services.filter((s) => project.serviceSlugs.includes(s.slug));
  const gallery = getMediaList(project.gallery);
  const testimonial = testimonials.find((t) => t.id === project.testimonialId);
  const more = allProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={industry?.name ?? "Project"}
        headline={project.title}
        lead={project.summary}
        image={project.heroImage}
        trail={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: industry?.name ?? "Project" },
        ]}
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-4">
          <MetaItem icon={<Building2 className="size-4" />} label="Client" value={project.client} />
          <MetaItem icon={<MapPin className="size-4" />} label="Location" value={`${project.location}, ${project.province}`} />
          <MetaItem
            icon={<CalendarDays className="size-4" />}
            label={project.completionDate ? "Completed" : "Started"}
            value={formatDate(project.completionDate ?? project.startDate)}
          />
        </dl>
      </PageHeader>

      {/* --- Metrics band ------------------------------------------------------- */}
      {project.metrics.length > 0 && (
        <div className="border-b border-steel-600/15 bg-ink-900">
          <RevealGroup className="shell grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric) => (
              <RevealItem key={metric.label} className="bg-ink-900 px-2 py-8 sm:px-6">
                <span className="block font-display text-2xl font-black tracking-tight text-gold-gradient sm:text-3xl">
                  {metric.value}
                </span>
                <span className="mt-1.5 block text-xs text-steel-400">{metric.label}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}

      {/* --- Narrative ---------------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="The brief" title="What we were asked to solve" tone="darker" size="md" />
              <Reveal delay={0.08}>
                <Paragraphs text={project.brief} paragraphClassName="text-steel-300" />
              </Reveal>
            </div>

            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="Approach" title="How we did it" tone="darker" size="md" />
              <Reveal delay={0.08}>
                <Paragraphs text={project.approach} paragraphClassName="text-steel-300" />
              </Reveal>
            </div>

            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="Outcome" title="What changed" tone="darker" size="md" />
              <Reveal delay={0.08}>
                <Paragraphs text={project.outcome} paragraphClassName="text-steel-300" />
              </Reveal>
            </div>
          </div>

          <Reveal direction="left">
            <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed">
                <CornerMarks />
                <h2 className="eyebrow text-gold-500">Project record</h2>
                <dl className="mt-5 flex flex-col divide-y divide-steel-600/15">
                  <Row label="Sector" value={industry?.name ?? "—"} />
                  <Row label="Location" value={project.location} />
                  <Row label="Province" value={project.province} />
                  <Row label="Started" value={formatDate(project.startDate)} />
                  <Row
                    label="Completed"
                    value={project.completionDate ? formatDate(project.completionDate) : "In progress"}
                  />
                  <Row label="Services" value={String(usedServices.length)} />
                </dl>

                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300"
                  >
                    <PlayCircle className="size-4" />
                    Watch the project video
                  </a>
                )}
              </div>

              {usedServices.length > 0 && (
                <div className="chamfer border border-steel-600/18 bg-ink-900 p-7">
                  <h2 className="eyebrow text-gold-500">Services used</h2>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {usedServices.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="group flex items-center justify-between gap-3 text-sm text-steel-300 transition-colors hover:text-gold-400"
                        >
                          {service.title}
                          <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Before & after ------------------------------------------------------- */}
      {project.beforeAfter?.length ? (
        <Section tone="dark">
          <div className="shell flex flex-col gap-10">
            <SectionHeading
              eyebrow="Before & after"
              title="The condition on arrival, and on handover"
              size="md"
              className="max-w-2xl"
            />
            <div className="flex flex-col gap-10">
              {project.beforeAfter.map((pair, i) => (
                <Reveal key={i}>
                  <BeforeAfter before={pair.before} after={pair.after} caption={pair.caption} />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* --- Programme ------------------------------------------------------------ */}
      {project.milestones.length > 0 && (
        <Section tone="darker">
          <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <SectionHeading
              eyebrow="Programme"
              title="How the work ran"
              lead="Each milestone carried a deliverable the client signed before the next stage started."
              tone="darker"
            />
            <MilestoneTimeline milestones={project.milestones} />
          </div>
        </Section>
      )}

      {/* --- Gallery --------------------------------------------------------------- */}
      {gallery.length > 0 && (
        <Section tone="dark">
          <div className="shell flex flex-col gap-10">
            <SectionHeading eyebrow="On site" title="Photographed during the work" size="md" />
            <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" stagger={0.06}>
              {gallery.map((asset) => (
                <RevealItem key={asset.slug}>
                  <figure className="chamfer overflow-hidden border border-steel-600/18">
                    <Media
                      media={asset.slug}
                      ratio="4 / 3"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="w-full"
                    />
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      {/* --- Client testimonial ----------------------------------------------------- */}
      {testimonial && (
        <Section tone="light" tight>
          <div className="shell">
            <Reveal>
              <blockquote className="mx-auto max-w-3xl text-center">
                <p className="font-display text-display-4 leading-snug font-semibold text-ink-950">
                  “{testimonial.quote}”
                </p>
                <footer className="mt-6 text-sm text-ink-500">
                  <cite className="font-semibold not-italic text-ink-950">{testimonial.author}</cite>
                  {" · "}
                  {testimonial.position}
                  {testimonial.company && `, ${testimonial.company}`}
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </Section>
      )}

      {/* --- More work --------------------------------------------------------------- */}
      {more.length > 0 && (
        <Section tone="darker" tight>
          <div className="shell flex flex-col gap-8">
            <SectionHeading eyebrow="More work" title="Other contracts" tone="darker" size="md" />
            <RevealGroup className="grid gap-4 lg:grid-cols-3" stagger={0.07}>
              {more.map((item) => (
                <RevealItem key={item.id} className="flex">
                  <ProjectCard project={item} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <CtaBanner
        headline="Have work like this?"
        body="Send the scope and the programme. You will get a written response with a date we can actually hold to."
        phone={business.phone}
      />
    </>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="eyebrow flex items-center gap-2 text-steel-500">
        <span className="text-gold-500">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-medium text-steel-100">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-xs text-steel-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-steel-100">{value}</dd>
    </div>
  );
}
