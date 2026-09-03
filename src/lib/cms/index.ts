import "server-only";
import { cache } from "react";
import { seedContent } from "@/content/seed";
import { getPublicSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  SiteContent,
  Service,
  FleetItem,
  Industry,
  Project,
  Testimonial,
  Faq,
  GalleryItem,
  NewsPost,
  CareerPosting,
} from "./types";

/* ============================================================================
   CONTENT RESOLUTION

   Order of precedence, per collection:
     1. Supabase, when configured AND the table returns rows
     2. The seed graph in src/content/seed

   Resolution is per collection rather than all-or-nothing, so a half-migrated
   database still renders a complete site. Every failure degrades to seed and
   logs once — a CMS outage must never take the marketing site down with it.

   Content tables store identity and ordering in columns and the typed payload
   in `data` (jsonb). That keeps one stable schema behind an evolving content
   model, and lets the portal edit any collection through the same code path.
   ========================================================================= */

const COLLECTION_TABLES = {
  services: "content_services",
  fleet: "content_fleet",
  industries: "content_industries",
  projects: "content_projects",
  testimonials: "content_testimonials",
  faqs: "content_faqs",
  gallery: "content_gallery",
  clients: "content_clients",
  documents: "content_documents",
  news: "content_news",
  careers: "content_careers",
  departments: "content_departments",
  staff: "content_staff",
  divisions: "content_divisions",
} as const;

const SINGLETON_KEYS = ["business", "home", "about", "safety", "pages"] as const;

type CollectionKey = keyof typeof COLLECTION_TABLES;

interface ContentRow {
  id: string;
  slug: string | null;
  sort: number | null;
  status: string | null;
  data: Record<string, unknown>;
}

let warned = false;
function warnOnce(scope: string, error: unknown) {
  if (warned) return;
  warned = true;
  console.warn(
    `[cms] ${scope} unavailable — falling back to seed content. ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
}

/** Row -> typed entity. Columns win over `data` so ordering stays authoritative. */
function hydrate<T>(row: ContentRow): T {
  const base = row.data ?? {};
  return {
    ...base,
    id: row.id,
    ...(row.slug ? { slug: row.slug } : {}),
    ...(row.sort !== null ? { order: row.sort } : {}),
  } as T;
}

async function fetchCollection<K extends CollectionKey>(
  key: K,
): Promise<SiteContent[K] | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from(COLLECTION_TABLES[key])
      .select("id, slug, sort, status, data")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("sort", { ascending: true });

    if (error) throw error;
    if (!data?.length) return null;
    return data.map((row) => hydrate(row as ContentRow)) as SiteContent[K];
  } catch (error) {
    warnOnce(`collection "${key}"`, error);
    return null;
  }
}

async function fetchSingletons(): Promise<Partial<
  Pick<SiteContent, "business" | "home" | "about" | "safety" | "pages">
> | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("content_singletons")
      .select("key, data")
      .in("key", SINGLETON_KEYS as unknown as string[]);

    if (error) throw error;
    if (!data?.length) return null;

    const out: Record<string, unknown> = {};
    for (const row of data as { key: string; data: unknown }[]) {
      if (row.data) out[row.key] = row.data;
    }
    return out as Partial<SiteContent>;
  } catch (error) {
    warnOnce("singletons", error);
    return null;
  }
}

/**
 * The whole content graph for one request. `cache` dedupes it across every
 * component in the tree, so a page with twelve sections issues one round trip.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!isSupabaseConfigured) return seedContent;

  const keys = Object.keys(COLLECTION_TABLES) as CollectionKey[];
  const [singletons, ...collections] = await Promise.all([
    fetchSingletons(),
    ...keys.map((key) => fetchCollection(key)),
  ]);

  const resolved: SiteContent = { ...seedContent, ...(singletons ?? {}) };
  keys.forEach((key, i) => {
    const value = collections[i];
    if (value) {
      (resolved as unknown as Record<string, unknown>)[key] = value;
    }
  });

  return resolved;
});

/* --- Accessors -------------------------------------------------------------
   Pages use these rather than reaching into the graph, so filtering rules
   (published only, featured ordering, soft-deleted rows) live in one place.
   -------------------------------------------------------------------------- */

const bySort = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getBusiness() {
  return (await getSiteContent()).business;
}

export async function getHome() {
  return (await getSiteContent()).home;
}

export async function getAbout() {
  return (await getSiteContent()).about;
}

export async function getSafety() {
  return (await getSiteContent()).safety;
}

export async function getPageMeta(key: string) {
  const { pages } = await getSiteContent();
  return pages[key];
}

export async function getDivisions() {
  return [...(await getSiteContent()).divisions].sort(bySort);
}

export async function getDepartments() {
  return [...(await getSiteContent()).departments].sort(bySort);
}

export async function getFleet(): Promise<FleetItem[]> {
  return [...(await getSiteContent()).fleet].sort(bySort);
}

export async function getFleetBySlug(slug: string): Promise<FleetItem | undefined> {
  return (await getFleet()).find((f) => f.slug === slug);
}

export async function getServices(): Promise<Service[]> {
  return [...(await getSiteContent()).services].sort(bySort);
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  const all = await getServices();
  const featured = all.filter((s) => s.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getServicesByDivision(division: string): Promise<Service[]> {
  return (await getServices()).filter((s) => s.division === division);
}

export async function getIndustries(): Promise<Industry[]> {
  return [...(await getSiteContent()).industries].sort(bySort);
}

export async function getIndustryBySlug(slug: string): Promise<Industry | undefined> {
  return (await getIndustries()).find((i) => i.slug === slug);
}

export async function getProjects(): Promise<Project[]> {
  return [...(await getSiteContent()).projects].sort(bySort);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return [...(await getSiteContent()).testimonials].sort(bySort);
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const all = await getTestimonials();
  const featured = all.filter((t) => t.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getFaqs(): Promise<Faq[]> {
  return [...(await getSiteContent()).faqs].sort(bySort);
}

export async function getFaqsForService(slug: string): Promise<Faq[]> {
  return (await getFaqs()).filter((f) => f.serviceSlug === slug);
}

export async function getGallery(): Promise<GalleryItem[]> {
  return [...(await getSiteContent()).gallery].sort(bySort);
}

export async function getNews(): Promise<NewsPost[]> {
  const { news } = await getSiteContent();
  return news
    .filter((n) => n.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | undefined> {
  return (await getNews()).find((n) => n.slug === slug);
}

export async function getCareers(): Promise<CareerPosting[]> {
  const { careers } = await getSiteContent();
  return careers.filter((c) => c.status === "open").sort(bySort);
}

export async function getClients() {
  return [...(await getSiteContent()).clients].sort(bySort);
}

export async function getDocuments() {
  return [...(await getSiteContent()).documents].sort(bySort);
}

export type { SiteContent };
