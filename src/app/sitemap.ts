import type { MetadataRoute } from "next";
import { getServices, getIndustries, getProjects, getNews } from "@/lib/cms";
import { staticRoutes } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/seo";

// Both metadata routes are pure functions of the CMS content, so they can be
// generated at build time. Declaring that explicitly is also what lets them be
// emitted as files by the static export target.
export const dynamic = "force-static";


/**
 * Built from the CMS at request time, so a service or project published in the
 * portal is in the sitemap without a redeploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, industries, projects, news] = await Promise.all([
    getServices(),
    getIndustries(),
    getProjects(),
    getNews(),
  ]);

  const now = new Date();

  const priorityFor = (route: string) => {
    if (route === "/") return 1;
    if (["/services", "/quote", "/contact", "/emergency"].includes(route)) return 0.9;
    return 0.7;
  };

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: priorityFor(route),
    })),
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industries.map((industry) => ({
      url: absoluteUrl(`/industries/${industry.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: project.completionDate ? new Date(project.completionDate) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...news.map((post) => ({
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
