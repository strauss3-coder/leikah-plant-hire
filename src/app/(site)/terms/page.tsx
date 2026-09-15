import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";
import { getBusiness, getLegalDocument } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema, legalDocumentSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("terms");
  return buildMetadata({
    title: doc.title,
    description: doc.lead,
    path: "/terms",
    seo: doc.seo,
  });
}

export default async function TermsPage() {
  const [doc, business] = await Promise.all([getLegalDocument("terms"), getBusiness()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path: "/terms" },
        ])}
      />
      <JsonLd data={legalDocumentSchema(doc, "/terms", business)} />
      <LegalDocument doc={doc} business={business} />
    </>
  );
}
