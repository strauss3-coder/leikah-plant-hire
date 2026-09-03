import type { SiteContent } from "@/lib/cms/types";
import { business, departments, staff, divisions } from "./business";
import { services } from "./services";
import { fleet } from "./fleet";
import { industries } from "./industries";
import { projects } from "./projects";
import { testimonials, clients, documents, faqs, news, careers } from "./editorial";
import { safety } from "./safety";
import { gallery } from "./gallery";
import { home, about, pages } from "./pages";

/**
 * The complete content graph as shipped. Supabase overrides this table by table
 * once it is connected; until then, and whenever a table is empty, this is what
 * the site renders. See `lib/cms/index.ts` for the resolution order.
 */
export const seedContent: SiteContent = {
  business,
  fleet,
  departments,
  staff,
  divisions,
  services,
  industries,
  projects,
  testimonials,
  faqs,
  gallery,
  clients,
  documents,
  news,
  careers,
  safety,
  home,
  about,
  pages,
};

export {
  business,
  fleet,
  departments,
  staff,
  divisions,
  services,
  industries,
  projects,
  testimonials,
  clients,
  documents,
  faqs,
  news,
  careers,
  safety,
  gallery,
  home,
  about,
  pages,
};
