/* ============================================================================
   CMS CONTENT MODEL

   Every editable value on the public site is described here. Pages read these
   types through `lib/cms`, never from literals, so a field added to the portal
   surfaces on the site without a component rewrite.

   Media is referenced by manifest slug (`MediaRef`) rather than by URL, so the
   image pipeline can change renditions without touching content.
   ========================================================================= */

export type MediaRef = string;

export interface MediaAsset {
  slug: string;
  title: string;
  alt: string;
  tags: string[];
  src: string;
  widths: number[];
  width: number;
  height: number;
  aspect: number;
  blurDataURL: string;
}

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

/* --- Business identity ---------------------------------------------------- */

export interface OperatingHours {
  /** 0 = Sunday. */
  day: number;
  label: string;
  /** Minutes from midnight; null/null means closed. */
  opens: number | null;
  closes: number | null;
  /** Overrides the window entirely — used for the 24/7 dispatch line. */
  alwaysOpen?: boolean;
}

export interface Department {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hours: string;
  order: number;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  image?: MediaRef;
  order: number;
}

export interface SocialProfile {
  platform: "facebook" | "linkedin" | "instagram" | "youtube" | "x";
  label: string;
  href: string;
}

export interface BusinessInfo {
  legalName: string;
  tradingName: string;
  shortName: string;
  tagline: string;
  descriptor: string;
  /** One paragraph; used for meta descriptions and the organisation schema. */
  summary: string;
  foundedYear: number;
  registration?: string;
  vat?: string;
  bbbee?: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
    /** What the driver should actually look for. */
    directions: string;
  };
  phone: string;
  emergencyPhone: string;
  whatsapp: string;
  email: string;
  quotesEmail: string;
  hours: OperatingHours[];
  emergencyNote: string;
  socials: SocialProfile[];
  serviceAreas: string[];
}

/* --- Reusable content blocks ---------------------------------------------- */

export interface Stat {
  id: string;
  value: number;
  /** Rendered after the counted value, e.g. "+", "%", "hr". */
  suffix?: string;
  prefix?: string;
  label: string;
  note?: string;
  order: number;
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  /** Present when the FAQ belongs to a single service page. */
  serviceSlug?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  industry?: string;
  rating: number;
  image?: MediaRef;
  videoUrl?: string;
  projectSlug?: string;
  featured: boolean;
  order: number;
}

export interface ClientLogo {
  id: string;
  name: string;
  sector: string;
  /** Optional — falls back to a typeset plate, which is honest when we have no artwork. */
  image?: MediaRef;
  order: number;
}

export interface DocumentAsset {
  id: string;
  title: string;
  description: string;
  category: "brochure" | "certificate" | "technical" | "policy" | "project";
  fileUrl: string;
  fileSize?: string;
  fileType: string;
  updatedAt: string;
  order: number;
}

/* --- Services -------------------------------------------------------------- */

export type DivisionKey = "earthmoving" | "mechanical" | "supply" | "emergency";

export interface Division {
  key: DivisionKey;
  name: string;
  strapline: string;
  description: string;
  image: MediaRef;
  href: string;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  division: DivisionKey;
  title: string;
  /** One line, used on cards and in nav. */
  summary: string;
  /** Two or three paragraphs of markdown-lite (paragraphs split on blank line). */
  overview: string;
  icon: ServiceIcon;
  image: MediaRef;
  gallery: MediaRef[];
  benefits: { title: string; description: string }[];
  /** Slugs into `industries`. */
  industries: string[];
  process: ProcessStep[];
  equipment: { name: string; detail: string }[];
  safety: string[];
  relatedSlugs: string[];
  /** Typical turnaround / availability line shown in the spec panel. */
  availability: string;
  featured: boolean;
  order: number;
  seo?: SeoFields;
}

export type ServiceIcon =
  | "excavation"
  | "haul-road"
  | "plant-hire"
  | "materials"
  | "field-service"
  | "engine"
  | "hydraulics"
  | "preventive"
  | "fabrication"
  | "supply"
  | "transport"
  | "site-services";

/* --- Fleet ------------------------------------------------------------------ */

export interface FleetItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  /** Key into the equipment icon family. */
  icon: string;
  strapline: string;
  description: string;
  image: MediaRef;
  secondaryImage?: MediaRef;
  specs: { label: string; value: string }[];
  applications: string[];
  /** Service page this class of machine belongs to. */
  serviceSlug?: string;
  order: number;
}

/* --- Industries ------------------------------------------------------------ */

export interface Industry {
  id: string;
  slug: string;
  name: string;
  summary: string;
  overview: string;
  image: MediaRef;
  /** The operational pressures this sector actually has. */
  challenges: { title: string; description: string }[];
  /** Slugs into `services`. */
  serviceSlugs: string[];
  compliance: string[];
  order: number;
  seo?: SeoFields;
}

/* --- Projects -------------------------------------------------------------- */

export interface ProjectMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  /** Set false where the client name is under NDA; the site shows the sector instead. */
  clientNamed: boolean;
  industrySlug: string;
  serviceSlugs: string[];
  location: string;
  province: string;
  startDate: string;
  completionDate: string | null;
  status: "complete" | "ongoing" | "scheduled";
  summary: string;
  brief: string;
  approach: string;
  outcome: string;
  heroImage: MediaRef;
  gallery: MediaRef[];
  beforeAfter?: { before: MediaRef; after: MediaRef; caption: string }[];
  videoUrl?: string;
  metrics: { label: string; value: string }[];
  milestones: ProjectMilestone[];
  testimonialId?: string;
  documentIds: string[];
  featured: boolean;
  order: number;
  seo?: SeoFields;
}

/* --- Health & safety ------------------------------------------------------- */

export interface SafetyStandard {
  id: string;
  title: string;
  description: string;
  icon: "clipboard" | "hardhat" | "shield" | "leaf" | "gauge" | "book";
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  reference?: string;
  validUntil?: string;
  documentId?: string;
  order: number;
}

export interface SafetyContent {
  intro: string;
  commitment: string;
  image: MediaRef;
  standards: SafetyStandard[];
  procedures: { title: string; items: string[] }[];
  training: { title: string; description: string; frequency: string }[];
  ppe: string[];
  environmental: string[];
  riskManagement: string[];
  qualityAssurance: string[];
  certifications: Certification[];
  stats: Stat[];
}

/* --- Editorial ------------------------------------------------------------- */

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  publishedAt: string;
  image: MediaRef;
  featured: boolean;
  status: "draft" | "published";
}

export interface CareerPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "permanent" | "contract" | "temporary" | "apprenticeship";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  advantageous: string[];
  closingDate: string | null;
  status: "open" | "closed";
  order: number;
}

export interface GalleryItem {
  id: string;
  media: MediaRef;
  caption: string;
  category: string;
  type: "image" | "video";
  videoUrl?: string;
  projectSlug?: string;
  /** Paired slug when this item is half of a before/after set. */
  pairedWith?: MediaRef;
  pairRole?: "before" | "after";
  featured: boolean;
  order: number;
}

/* --- Page composition ------------------------------------------------------ */

export interface SeoFields {
  title?: string;
  description?: string;
  image?: MediaRef;
  noIndex?: boolean;
}

/** A partner or associated mark shown quietly beneath the hero. */
export interface HeroPartner {
  /** e.g. "In association with". Wording is the client's to confirm. */
  label: string;
  name: string;
  /** Path under /public, not a media-manifest slug — this is a brand asset. */
  logo: string;
  href?: string;
}

/**
 * The hero carries the brand and nothing else. Everything that explains the
 * business lives in the section below it, which is why there is no headline,
 * body copy or call to action here.
 */
export interface HeroContent {
  brandName: string;
  /** Set under the wordmark, tracked out. */
  descriptor: string;
  /** One short line. Not a paragraph. */
  tagline: string;
  /** A single row of credentials — five items at most before it wraps badly. */
  trustIndicators: string[];
  partner?: HeroPartner;
  media: MediaRef[];
}

export interface WalkStageContent {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Key into the equipment icon family. */
  icon: string;
}

export interface HomeContent {
  hero: HeroContent;
  trustLine: string;
  /** The line set under the oversized wordmark. */
  brandStatement: string;
  brandFootnote: string;
  fleetEyebrow: string;
  fleetHeadline: string;
  fleetLead: string;
  processEyebrow: string;
  processHeadline: string;
  processLead: string;
  processStages: WalkStageContent[];
  introEyebrow: string;
  introHeadline: string;
  /** Opens the section. This is the copy the hero used to carry. */
  introLead: string;
  introBody: string;
  introImage: MediaRef;
  introPoints: { title: string; description: string }[];
  stats: Stat[];
  whyUs: { title: string; description: string; icon: ServiceIcon | "shield" | "clock" | "gauge" }[];
  safetyEyebrow: string;
  safetyHeadline: string;
  safetyBody: string;
  safetyPoints: string[];
  safetyImage: MediaRef;
  ctaHeadline: string;
  ctaBody: string;
  seo?: SeoFields;
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  lead: string;
  story: string;
  image: MediaRef;
  values: { title: string; description: string }[];
  timeline: { year: string; title: string; description: string }[];
  capabilities: { label: string; value: string }[];
  seo?: SeoFields;
}

export interface PageMeta {
  key: string;
  title: string;
  eyebrow: string;
  headline: string;
  lead: string;
  image: MediaRef;
  seo?: SeoFields;
}

/* --- Enquiries (write side) ------------------------------------------------ */

export type Urgency = "emergency" | "urgent" | "scheduled" | "planning";

export interface QuoteRequest {
  id?: string;
  reference?: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  role?: string;
  serviceSlugs: string[];
  industrySlug: string;
  siteLocation: string;
  province: string;
  urgency: Urgency;
  preferredStart?: string | null;
  duration?: string;
  budgetBand?: string;
  description: string;
  attachments: { name: string; path: string; size: number; type: string }[];
  consent: boolean;
  source?: string;
  status?: "new" | "reviewing" | "quoted" | "won" | "lost" | "archived";
  createdAt?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  department: string;
  subject: string;
  message: string;
  consent: boolean;
  createdAt?: string;
}

/* --- The full content graph ------------------------------------------------ */

export interface SiteContent {
  business: BusinessInfo;
  fleet: FleetItem[];
  departments: Department[];
  staff: StaffMember[];
  divisions: Division[];
  services: Service[];
  industries: Industry[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: Faq[];
  gallery: GalleryItem[];
  clients: ClientLogo[];
  documents: DocumentAsset[];
  news: NewsPost[];
  careers: CareerPosting[];
  safety: SafetyContent;
  home: HomeContent;
  about: AboutContent;
  pages: Record<string, PageMeta>;
}
