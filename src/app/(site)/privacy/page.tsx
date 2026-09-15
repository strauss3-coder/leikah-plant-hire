import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";
import { getBusiness, getLegalDocument } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema, legalDocumentSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("privacy");
  return buildMetadata({
    title: doc.title,
    description: doc.lead,
    path: "/privacy",
    seo: doc.seo,
  });
}

export default async function PrivacyPage() {
  const [doc, business] = await Promise.all([getLegalDocument("privacy"), getBusiness()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path: "/privacy" },
        ])}
      />
      <JsonLd data={legalDocumentSchema(doc, "/privacy", business)} />
      <LegalDocument doc={doc} business={business} />
    </>
  );
}
