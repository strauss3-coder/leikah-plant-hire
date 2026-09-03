import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getIndustries, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("industries");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/industries",
    image: page.image,
    seo: page.seo,
  });
}

export default async function IndustriesPage() {
  const [page, industries, business] = await Promise.all([
    getPageMeta("industries"),
    getIndustries(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ])}
      />

      <PageHeader
        blueprint="hauler"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />

      <Section tone="darker">
        <div className="shell flex flex-col gap-4">
          {industries.map((industry, i) => (
            <Reveal key={industry.id} delay={i * 0.04}>
              <Link
                href={`/industries/${industry.slug}`}
                className="group chamfer relative grid overflow-hidden border border-steel-600/18 bg-ink-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold-500/45 lg:grid-cols-[0.4fr_1fr]"
              >
                <div className="relative overflow-hidden lg:h-full">
                  <Media
                    media={industry.image}
                    alt=""
                    ratio="16 / 9"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="h-full w-full lg:absolute lg:inset-0"
                    imageClassName="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent lg:bg-gradient-to-r" />
                </div>

                <div className="flex flex-col gap-4 p-7 lg:flex-row lg:items-center lg:gap-10 lg:p-9">
                  <div className="flex-1">
                    <span className="eyebrow text-gold-500 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-3 text-display-4 text-paper-50">{industry.name}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel-400">
                      {industry.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className="hidden text-xs text-steel-500 tabular lg:block">
                      {industry.serviceSlugs.length} services
                    </span>
                    <span className="chamfer-sm inline-flex size-11 items-center justify-center border border-steel-600/25 text-steel-300 transition-all duration-400 group-hover:border-gold-500/60 group-hover:text-gold-400">
                      <ArrowRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        headline="Working in a sector that is not listed?"
        body="The plant and the discipline travel. Tell us the constraint you are working against and we will say plainly whether we are the right contractor for it."
        phone={business.phone}
        primaryLabel="Talk to us"
        primaryHref="/contact"
      />
    </>
  );
}
