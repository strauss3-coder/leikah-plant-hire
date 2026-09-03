import type { Metadata } from "next";
import { MessageSquareQuote } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { ProjectCard } from "@/components/site/ProjectCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import { getBusiness, getFeaturedProjects, getPageMeta, getTestimonials } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("testimonials");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/testimonials",
    image: page.image,
    seo: page.seo,
  });
}

export default async function TestimonialsPage() {
  const [page, testimonials, projects, business] = await Promise.all([
    getPageMeta("testimonials"),
    getTestimonials(),
    getFeaturedProjects(3),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell">
          {testimonials.length > 0 ? (
            <div className="flex flex-col gap-16">
              <TestimonialCarousel testimonials={testimonials} className="mx-auto max-w-4xl" />

              <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((item) => (
                  <RevealItem key={item.id} className="flex flex-col gap-4 bg-ink-950 p-7">
                    <p className="text-sm leading-relaxed text-steel-300">&ldquo;{item.quote}&rdquo;</p>
                    <div className="mt-auto pt-3">
                      <p className="text-sm font-semibold text-paper-50">{item.author}</p>
                      <p className="text-xs text-steel-500">
                        {item.position}
                        {item.company && ` · ${item.company}`}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ) : (
            /* No invented quotes. The page says what it can honestly say and
               sends the reader to the work instead. */
            <Reveal>
              <div className="chamfer relative mx-auto max-w-3xl border border-steel-600/18 bg-ink-900 p-8 text-center brushed sm:p-12">
                <CornerMarks />
                <MessageSquareQuote className="mx-auto size-8 text-gold-500" />
                <h2 className="mt-6 text-display-4 text-paper-50">
                  We publish client feedback only with the client&rsquo;s permission
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-steel-400">
                  Most of the operations we work for hold contractor relationships under
                  confidentiality terms. Rather than publish anything we cannot attribute, we will
                  put you directly in touch with a planner or maintenance manager who has signed our
                  work off, wherever they are willing to take the call.
                </p>
                <p className="mt-6 text-sm text-steel-300">
                  Ask for references at{" "}
                  <a
                    href={`mailto:${business.email}`}
                    className="text-gold-400 underline underline-offset-4 hover:text-gold-300"
                  >
                    {business.email}
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {projects.length > 0 && (
        <Section tone="dark">
          <div className="shell flex flex-col gap-10">
            <SectionHeading
              eyebrow="In the meantime"
              title="Judge us on the work instead"
              lead="Every project carries the method, the programme and the outcome — including the parts that were difficult."
              className="max-w-3xl"
            />
            <RevealGroup className="grid gap-4 lg:grid-cols-3" stagger={0.07}>
              {projects.map((project) => (
                <RevealItem key={project.id} className="flex">
                  <ProjectCard project={project} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <CtaBanner
        headline="Worked with us before?"
        body="If we did well, we would value your feedback on the record. If we did not, we would rather hear it directly and put it right."
        phone={business.phone}
        primaryLabel="Send us feedback"
        primaryHref="/contact"
      />
    </>
  );
}
