import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getGallery, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("gallery");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/gallery",
    image: page.image,
    seo: page.seo,
  });
}

export default async function GalleryPage() {
  const [page, gallery, business] = await Promise.all([
    getPageMeta("gallery"),
    getGallery(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />

      <PageHeader
        blueprint="hauler"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell">
          <GalleryGrid items={gallery} />
        </div>
      </Section>

      <CtaBanner
        headline="Want to see the machine you would be hiring?"
        body="Ask and we will send current photographs and the condition report for the specific unit — not a stock image of the model."
        phone={business.phone}
        primaryLabel="Ask about a machine"
        primaryHref="/contact"
      />
    </>
  );
}
