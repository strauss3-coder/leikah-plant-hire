import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Both metadata routes are pure functions of the CMS content, so they can be
// generated at build time. Declaring that explicitly is also what lets them be
// emitted as files by the static export target.
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The portal and the enquiry endpoints have nothing to index and
        // should never appear in a search result.
        disallow: ["/portal", "/portal/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
