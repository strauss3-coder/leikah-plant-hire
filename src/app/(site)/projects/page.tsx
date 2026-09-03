import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ProjectFilter } from "@/components/site/ProjectFilter";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getIndustries, getPageMeta, getProjects } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("projects");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/projects",
    image: page.image,
    seo: page.seo,
  });
}

export default async function ProjectsPage() {
  const [page, projects, industries, business] = await Promise.all([
    getPageMeta("projects"),
    getProjects(),
    getIndustries(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />

      <Section tone="darker">
        <div className="shell">
          <ProjectFilter projects={projects} industries={industries} />
        </div>
      </Section>

      <CtaBanner
        headline="Want references for a tender submission?"
        body="Where a client permits it, we will put you directly in touch with the planner or maintenance manager who signed the work off."
        phone={business.phone}
        primaryLabel="Request references"
        primaryHref="/contact"
      />
    </>
  );
}
