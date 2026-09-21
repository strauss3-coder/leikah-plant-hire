import type { Metadata } from "next";
import type {
  BusinessInfo,
  SeoFields,
  Project,
  Service,
  LegalDocument,
} from "./cms/types";
import { getMedia } from "./cms/media";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL at deploy time; the fallback keeps
 * local development and preview builds from emitting broken absolute URLs.
 *
 * This is the one value every absolute URL on the site derives from: canonical
 * tags, Open Graph and Twitter URLs, the sitemap, robots.txt and every @id and
 * url in the JSON-LD graph. Changing the production domain means changing it
 * here and in the deploy workflow, and nowhere else.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://leikahgroup.co.za";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The canonical form of a URL for the current build target.
 *
 * The static export sets `trailingSlash: true`, so Next emits canonical tags
 * ending in a slash. The sitemap is built by hand from `absoluteUrl`, which
 * does not, and a sitemap that lists `/about` while the page declares
 * `/about/` as canonical hands Google two spellings of one page. This keeps
 * the two in step on both targets.
 */
export function canonicalUrl(path = "/") {
  const url = absoluteUrl(path);
  if (process.env.STATIC_EXPORT !== "1") return url;
  return url.endsWith("/") ? url : `${url}/`;
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
    // The image keys are spread in only when there is one. Setting them to
    // `undefined` explicitly overrides the default from the root layout rather
    // than inheriting it, which left the legal pages sharing with no preview
    // image at all.
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: absoluteUrl(path),
      ...(ogImage
        ? { images: [{ url: ogImage, width: asset.width, height: asset.height, alt: asset.alt }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
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
    // Both voice lines. The second is calls only, so it is not offered
    // anywhere as a messaging target.
    telephone: business.secondaryPhone
      ? [business.phone, business.secondaryPhone]
      : business.phone,
    ...(business.email ? { email: business.email } : {}),
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
    // The mark, as an absolute URL. Google reads `logo` for the knowledge
    // panel and will not resolve a relative path from JSON-LD.
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/icon-512.png"),
      width: 512,
      height: 512,
    },
    image: [absoluteUrl("/brand/icon-512.png")],
    /**
     * Separate reachable lines rather than one number repeated. The breakdown
     * line is declared as its own contact point with 24/7 hours, which is what
     * lets Google surface "open now" against an emergency query at 02:00.
     *
     * WhatsApp is published as a contact point rather than a `telephone`,
     * because the second line is calls only and conflating the two would
     * advertise messaging on a number that does not take it.
     */
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: business.phone,
        areaServed: "ZA",
        availableLanguage: ["en", "af"],
      },
      ...(business.emergencyPhone
        ? [
            {
              "@type": "ContactPoint",
              contactType: "emergency",
              telephone: business.emergencyPhone,
              areaServed: "ZA",
              availableLanguage: ["en", "af"],
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "https://schema.org/Monday",
                  "https://schema.org/Tuesday",
                  "https://schema.org/Wednesday",
                  "https://schema.org/Thursday",
                  "https://schema.org/Friday",
                  "https://schema.org/Saturday",
                  "https://schema.org/Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
            },
          ]
        : []),
      ...(business.whatsapp
        ? [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              telephone: business.whatsapp,
              areaServed: "ZA",
              availableLanguage: ["en", "af"],
            },
          ]
        : []),
    ],
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

/**
 * Legal pages are WebPage nodes rather than Articles: they are terms, not
 * editorial, and `dateModified` is the field that actually matters on them.
 */
export function legalDocumentSchema(
  doc: LegalDocument,
  path: string,
  business: BusinessInfo,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: doc.title,
    description: doc.lead,
    url: absoluteUrl(path),
    dateModified: doc.updated,
    inLanguage: "en-ZA",
    isPartOf: { "@type": "WebSite", name: business.tradingName, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}#organisation` },
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
