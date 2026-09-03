import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FaqBrowser } from "@/components/site/FaqBrowser";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getFaqs, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("faq");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/faq",
    image: page.image,
    seo: page.seo,
  });
}

export default async function FaqPage() {
  const [page, faqs, business] = await Promise.all([
    getPageMeta("faq"),
    getFaqs(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />

      <PageHeader
        blueprint="engine"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell">
          <FaqBrowser faqs={faqs} />
        </div>
      </Section>

      <CtaBanner
        headline="Question not answered here?"
        body="Ask it directly. We would rather give you a straight answer now than have you find out something inconvenient halfway through a contract."
        phone={business.phone}
        primaryLabel="Ask us"
        primaryHref="/contact"
      />
    </>
  );
}
