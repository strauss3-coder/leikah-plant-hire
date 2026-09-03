import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ServiceFilter } from "@/components/site/ServiceFilter";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getDivisions, getPageMeta, getServices } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("services");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/services",
    image: page.image,
    seo: page.seo,
  });
}

export default async function ServicesPage() {
  const [page, services, divisions, business] = await Promise.all([
    getPageMeta("services"),
    getServices(),
    getDivisions(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHeader
        blueprint="dozer"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <Section tone="darker">
        <div className="shell">
          {/* useSearchParams needs a boundary during prerender. The fallback is
              the complete, unfiltered grid rather than nothing, so the static
              HTML still carries every service for crawlers and for anyone whose
              JavaScript has not arrived yet. */}
          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
              </div>
            }
          >
            <ServiceFilter services={services} divisions={divisions} />
          </Suspense>
        </div>
      </Section>

      <CtaBanner
        headline="Not sure which service you need?"
        body="Describe the machine, the volume or the deadline and we will tell you which division answers it — and whether we are the right people for it at all."
        phone={business.phone}
      />
    </>
  );
}
