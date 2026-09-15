import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";
import { CookieSettingsPanel } from "@/components/site/CookieSettingsPanel";
import { getBusiness, getLegal, getLegalDocument } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema, legalDocumentSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("cookies");
  return buildMetadata({
    title: doc.title,
    description: doc.lead,
    path: "/cookies",
    seo: doc.seo,
  });
}

export default async function CookiePolicyPage() {
  const [doc, legal, business] = await Promise.all([
    getLegalDocument("cookies"),
    getLegal(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path: "/cookies" },
        ])}
      />
      <JsonLd data={legalDocumentSchema(doc, "/cookies", business)} />
      <LegalDocument doc={doc} business={business}>
        {/* The policy is only useful if the reader can act on it here. */}
        <CookieSettingsPanel categories={legal.cookieCategories} />
      </LegalDocument>
    </>
  );
}
