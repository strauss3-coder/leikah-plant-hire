import type { Metadata } from "next";
import type { BusinessInfo, SeoFields, Project, Service } from "./cms/types";
import { getMedia } from "./cms/media";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL at deploy time; the fallback keeps
 * local development and preview builds from emitting broken absolute URLs.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://leikahplanthire.co.za";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Builds page metadata from CMS SEO fields, falling back to the page's own copy. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  seo?: SeoFields;
  type?: "website" | "article";
}): Metadata {
  const resolvedTitle = seo?.title ?? title;
  const resolvedDescription = seo?.description ?? description;
  const asset = getMedia(seo?.image ?? image);
  const ogImage = asset.src ? absoluteUrl(asset.src) : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: absoluteUrl(path),
      images: ogImage ? [{ url: ogImage, width: asset.width, height: asset.height, alt: asset.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/* ============================================================================
   STRUCTURED DATA

   Emitted as JSON-LD. The organisation graph is what puts the yard on the map
   panel for "plant hire Middelburg", and the service and FAQ graphs are what
   corporate buyers' search tools read.
   ========================================================================= */

export function organisationSchema(business: BusinessInfo) {
  const { address } = business;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_URL}#organisation`,
    name: business.tradingName,
    legalName: business.legalName,
    description: business.summary,
    url: SITE_URL,
    telephone: business.phone,
    email: business.email,
    ...(business.foundedYear ? { foundingDate: String(business.foundedYear) } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.suburb}`,
      addressLocality: address.city,
      addressRegion: address.province,
      postalCode: address.postalCode,
      addressCountry: "ZA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.lat,
      longitude: address.lng,
    },
    areaServed: business.serviceAreas.map((name) => ({
      "@type": "City",
      name,
    })),
    openingHoursSpecification: business.hours
      .filter((h) => h.alwaysOpen || h.opens !== null)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${
          ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.day]
        }`,
        opens: h.alwaysOpen ? "00:00" : minutes(h.opens),
        closes: h.alwaysOpen ? "23:59" : minutes(h.closes),
      })),
    sameAs: business.socials.map((s) => s.href),
  };
}

function minutes(value: number | null) {
  if (value === null) return "00:00";
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function serviceSchema(service: Service, business: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: { "@id": `${SITE_URL}#organisation` },
    areaServed: business.serviceAreas.map((name) => ({ "@type": "City", name })),
    url: absoluteUrl(`/services/${service.slug}`),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectSchema(project: Project) {
  const asset = getMedia(project.heroImage);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(asset.src ? { image: absoluteUrl(asset.src) } : {}),
    provider: { "@id": `${SITE_URL}#organisation` },
    locationCreated: { "@type": "Place", name: `${project.location}, ${project.province}` },
    ...(project.completionDate ? { dateCreated: project.completionDate } : {}),
  };
}

/** Renders any JSON-LD object into the document. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Content is generated server-side from typed data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
