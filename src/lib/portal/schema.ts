import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Briefcase,
  Building2,
  CalendarClock,
  FileText,
  FolderKanban,
  Gauge,
  HardHat,
  Home,
  Image as ImageIcon,
  Inbox,
  Info,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareQuote,
  Newspaper,
  Package,
  Quote,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Truck,
  Users,
  UsersRound,
  ScrollText,
  Wrench,
  Receipt,
} from "lucide-react";

/* ============================================================================
   PORTAL SCHEMA

   One registry describes every editable thing on the site. The list screen, the
   editor, validation and the audit trail are all generated from it, which is
   why adding a field to a service is a change here and nowhere else.

   Field types map to the controls in components/portal/Fields.tsx.
   ========================================================================= */

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "media"
  | "medialist"
  | "stringlist"
  | "objectlist"
  | "date"
  | "url"
  | "email"
  | "tel"
  | "slug";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  placeholder?: string;
  /** For select / multiselect. A string means "resolve from this collection". */
  options?: { value: string; label: string }[] | { from: CollectionKey | "icons" };
  /** For objectlist. */
  fields?: FieldDef[];
  /** Groups fields into a titled panel in the editor. */
  group?: string;
  /** Rendered full width rather than in the two-column grid. */
  wide?: boolean;
  min?: number;
  max?: number;
}

export type CollectionKey =
  | "services"
  | "fleet"
  | "industries"
  | "projects"
  | "testimonials"
  | "faqs"
  | "gallery"
  | "clients"
  | "documents"
  | "news"
  | "careers"
  | "departments"
  | "staff"
  | "divisions";

export interface CollectionDef {
  key: CollectionKey;
  table: string;
  label: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  group: "Website" | "Operations" | "People";
  /** Which payload field is shown as the row title in the list. */
  titleField: string;
  subtitleField?: string;
  /** Field promoted to the `slug` column. */
  slugField?: string;
  imageField?: string;
  fields: FieldDef[];
}

const SERVICE_ICONS = [
  "excavation",
  "haul-road",
  "plant-hire",
  "materials",
  "field-service",
  "engine",
  "hydraulics",
  "preventive",
  "fabrication",
  "supply",
  "transport",
  "site-services",
].map((value) => ({ value, label: value.replace(/-/g, " ") }));

const EQUIPMENT_ICONS = [
  "excavator", "dozer", "hauler", "grader", "loader", "lowbed", "bowser",
  "engine", "transmission", "hydraulic", "hose", "pump", "hardhat", "weld",
  "pallet", "bench", "haulroad", "stockpile", "clock", "shield", "gauge",
].map((value) => ({ value, label: value }));

const DIVISION_OPTIONS = [
  { value: "earthmoving", label: "Earthmoving & Plant Hire" },
  { value: "mechanical", label: "Heavy Mechanical" },
  { value: "supply", label: "Supply Division" },
  { value: "emergency", label: "24-Hour Breakdown" },
];

const seo: FieldDef[] = [
  { key: "seo.title", label: "SEO title", type: "text", group: "Search", help: "Leave empty to use the page title." },
  { key: "seo.description", label: "SEO description", type: "textarea", group: "Search", help: "Around 150 characters. Leave empty to use the summary." },
  { key: "seo.image", label: "Social share image", type: "media", group: "Search" },
  { key: "seo.noIndex", label: "Hide from search engines", type: "boolean", group: "Search" },
];

export const COLLECTIONS: Record<CollectionKey, CollectionDef> = {
  services: {
    key: "services",
    table: "content_services",
    label: "Services",
    singular: "Service",
    description: "Everything the business sells, with the full detail each service page renders.",
    icon: Wrench,
    group: "Website",
    titleField: "title",
    subtitleField: "summary",
    slugField: "slug",
    imageField: "image",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics", help: "Appears as /services/your-slug. Changing it breaks existing links." },
      { key: "division", label: "Division", type: "select", required: true, group: "Basics", options: DIVISION_OPTIONS },
      { key: "icon", label: "Icon", type: "select", required: true, group: "Basics", options: SERVICE_ICONS },
      { key: "summary", label: "One-line summary", type: "textarea", required: true, wide: true, group: "Basics", help: "Shown on cards and in the navigation." },
      { key: "availability", label: "Availability", type: "text", group: "Basics", placeholder: "e.g. 24 hours, 365 days" },
      { key: "featured", label: "Feature on the homepage", type: "boolean", group: "Basics" },

      { key: "overview", label: "Overview", type: "longtext", wide: true, required: true, group: "Content", help: "Two or three paragraphs. Separate them with a blank line." },
      { key: "image", label: "Header image", type: "media", group: "Content" },
      { key: "gallery", label: "Gallery", type: "medialist", group: "Content" },

      {
        key: "benefits",
        label: "Benefits",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "title", label: "Benefit", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
        ],
      },
      {
        key: "process",
        label: "Method steps",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "step", label: "Step number", type: "number", required: true },
          { key: "title", label: "Step title", type: "text", required: true },
          { key: "description", label: "What happens", type: "textarea", required: true },
          { key: "duration", label: "Typical duration", type: "text" },
        ],
      },
      {
        key: "equipment",
        label: "Plant & equipment",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "name", label: "Item", type: "text", required: true },
          { key: "detail", label: "Detail", type: "text", required: true },
        ],
      },
      { key: "safety", label: "Safety controls", type: "stringlist", wide: true, group: "Detail" },

      { key: "industries", label: "Sectors served", type: "multiselect", wide: true, group: "Links", options: { from: "industries" } },
      { key: "relatedSlugs", label: "Related services", type: "multiselect", wide: true, group: "Links", options: { from: "services" } },

      ...seo,
    ],
  },

  fleet: {
    key: "fleet",
    table: "content_fleet",
    label: "Fleet",
    singular: "Machine class",
    description:
      "The plant showcase on the homepage. Described by class and duty rather than by unit count — a fleet list is out of date the week it is published.",
    icon: Truck,
    group: "Website",
    titleField: "name",
    subtitleField: "strapline",
    slugField: "slug",
    imageField: "image",
    fields: [
      { key: "name", label: "Machine class", type: "text", required: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics" },
      { key: "category", label: "Category", type: "text", required: true, group: "Basics", placeholder: "Earthmoving" },
      { key: "icon", label: "Icon", type: "select", required: true, group: "Basics", options: EQUIPMENT_ICONS },
      { key: "strapline", label: "Strapline", type: "text", required: true, wide: true, group: "Basics" },
      { key: "description", label: "Description", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "image", label: "Primary image", type: "media", required: true, group: "Media" },
      { key: "secondaryImage", label: "Secondary image", type: "media", group: "Media" },
      {
        key: "specs",
        label: "Specifications",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "value", label: "Value", type: "text", required: true },
        ],
      },
      { key: "applications", label: "Applications", type: "stringlist", wide: true, group: "Detail" },
      { key: "serviceSlug", label: "Related service", type: "select", group: "Links", options: { from: "services" } },
    ],
  },

  industries: {
    key: "industries",
    table: "content_industries",
    label: "Industries",
    singular: "Industry",
    description: "The sectors the business serves and the constraints each one carries.",
    icon: Landmark,
    group: "Website",
    titleField: "name",
    subtitleField: "summary",
    slugField: "slug",
    imageField: "image",
    fields: [
      { key: "name", label: "Sector name", type: "text", required: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics" },
      { key: "summary", label: "One-line summary", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "image", label: "Header image", type: "media", group: "Basics" },
      { key: "overview", label: "Overview", type: "longtext", wide: true, required: true, group: "Content" },
      {
        key: "challenges",
        label: "Real constraints",
        type: "objectlist",
        wide: true,
        group: "Content",
        fields: [
          { key: "title", label: "Constraint", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
        ],
      },
      { key: "compliance", label: "Compliance requirements", type: "stringlist", wide: true, group: "Content" },
      { key: "serviceSlugs", label: "Services offered", type: "multiselect", wide: true, group: "Links", options: { from: "services" } },
      ...seo,
    ],
  },

  projects: {
    key: "projects",
    table: "content_projects",
    label: "Projects",
    singular: "Project",
    description: "Completed and ongoing contracts, with method, programme and outcome.",
    icon: FolderKanban,
    group: "Website",
    titleField: "title",
    subtitleField: "client",
    slugField: "slug",
    imageField: "heroImage",
    fields: [
      { key: "title", label: "Project title", type: "text", required: true, wide: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics" },
      { key: "status", label: "Status", type: "select", required: true, group: "Basics", options: [
        { value: "complete", label: "Complete" },
        { value: "ongoing", label: "Ongoing" },
        { value: "scheduled", label: "Scheduled" },
      ] },
      { key: "client", label: "Client (as shown publicly)", type: "text", required: true, group: "Basics", help: "Use the sector where the contract does not permit naming, e.g. \"Coal producer, Mpumalanga\"." },
      { key: "clientNamed", label: "Client has given written permission to be named", type: "boolean", group: "Basics" },
      { key: "location", label: "Location", type: "text", required: true, group: "Basics" },
      { key: "province", label: "Province", type: "text", required: true, group: "Basics" },
      { key: "startDate", label: "Start date", type: "date", required: true, group: "Basics" },
      { key: "completionDate", label: "Completion date", type: "date", group: "Basics", help: "Leave empty while the contract is running." },
      { key: "featured", label: "Feature on the homepage", type: "boolean", group: "Basics" },

      { key: "summary", label: "Summary", type: "textarea", required: true, wide: true, group: "Content" },
      { key: "brief", label: "The brief", type: "longtext", wide: true, required: true, group: "Content" },
      { key: "approach", label: "Approach", type: "longtext", wide: true, required: true, group: "Content" },
      { key: "outcome", label: "Outcome", type: "longtext", wide: true, required: true, group: "Content" },

      { key: "heroImage", label: "Header image", type: "media", group: "Media" },
      { key: "gallery", label: "Gallery", type: "medialist", group: "Media" },
      { key: "videoUrl", label: "Video URL", type: "url", group: "Media" },
      {
        key: "beforeAfter",
        label: "Before & after pairs",
        type: "objectlist",
        wide: true,
        group: "Media",
        fields: [
          { key: "before", label: "Before image", type: "media", required: true },
          { key: "after", label: "After image", type: "media", required: true },
          { key: "caption", label: "Caption", type: "textarea", required: true },
        ],
      },

      {
        key: "metrics",
        label: "Headline figures",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "value", label: "Figure", type: "text", required: true },
          { key: "label", label: "What it measures", type: "text", required: true },
        ],
      },
      {
        key: "milestones",
        label: "Programme milestones",
        type: "objectlist",
        wide: true,
        group: "Detail",
        fields: [
          { key: "date", label: "Date", type: "date", required: true },
          { key: "title", label: "Milestone", type: "text", required: true },
          { key: "description", label: "What happened", type: "textarea", required: true },
        ],
      },

      { key: "industrySlug", label: "Sector", type: "select", required: true, group: "Links", options: { from: "industries" } },
      { key: "serviceSlugs", label: "Services used", type: "multiselect", wide: true, group: "Links", options: { from: "services" } },
      { key: "testimonialId", label: "Client testimonial", type: "select", group: "Links", options: { from: "testimonials" } },
      ...seo,
    ],
  },

  testimonials: {
    key: "testimonials",
    table: "content_testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client feedback. Publish only what the client has agreed to in writing.",
    icon: MessageSquareQuote,
    group: "Website",
    titleField: "author",
    subtitleField: "company",
    imageField: "image",
    fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true, wide: true, group: "Basics", help: "Use the client's own words. Do not edit for polish beyond removing filler." },
      { key: "author", label: "Name", type: "text", required: true, group: "Basics" },
      { key: "position", label: "Position", type: "text", required: true, group: "Basics" },
      { key: "company", label: "Company", type: "text", required: true, group: "Basics" },
      { key: "industry", label: "Sector", type: "select", group: "Basics", options: { from: "industries" } },
      { key: "rating", label: "Rating out of 5", type: "number", required: true, min: 1, max: 5, group: "Basics" },
      { key: "featured", label: "Show on the homepage", type: "boolean", group: "Basics" },
      { key: "image", label: "Photograph", type: "media", group: "Media" },
      { key: "videoUrl", label: "Video testimonial URL", type: "url", group: "Media" },
      { key: "projectSlug", label: "Related project", type: "select", group: "Links", options: { from: "projects" } },
    ],
  },

  faqs: {
    key: "faqs",
    table: "content_faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions and answers, shown on the FAQ page and on individual service pages.",
    icon: LifeBuoy,
    group: "Website",
    titleField: "question",
    subtitleField: "category",
    fields: [
      { key: "question", label: "Question", type: "text", required: true, wide: true, group: "Basics" },
      { key: "answer", label: "Answer", type: "longtext", required: true, wide: true, group: "Basics" },
      { key: "category", label: "Category", type: "text", required: true, group: "Basics", help: "Groups the question in the FAQ rail, e.g. \"Plant Hire\"." },
      { key: "serviceSlug", label: "Attach to a service page", type: "select", group: "Links", options: { from: "services" }, help: "Optional. The question then also appears on that service page." },
    ],
  },

  gallery: {
    key: "gallery",
    table: "content_gallery",
    label: "Gallery",
    singular: "Gallery item",
    description: "Site and workshop photography, with categories and before/after pairing.",
    icon: ImageIcon,
    group: "Website",
    titleField: "caption",
    subtitleField: "category",
    imageField: "media",
    fields: [
      { key: "media", label: "Image", type: "media", required: true, group: "Basics" },
      { key: "caption", label: "Caption", type: "textarea", required: true, wide: true, group: "Basics", help: "Explains what is happening. The alt text on the media record describes it." },
      { key: "category", label: "Category", type: "text", required: true, group: "Basics" },
      { key: "type", label: "Type", type: "select", required: true, group: "Basics", options: [
        { value: "image", label: "Image" },
        { value: "video", label: "Video" },
      ] },
      { key: "videoUrl", label: "Video URL", type: "url", group: "Basics" },
      { key: "featured", label: "Featured", type: "boolean", group: "Basics" },
      { key: "pairedWith", label: "Paired image", type: "media", group: "Before & after", help: "Set on both halves of a pair." },
      { key: "pairRole", label: "This image is the", type: "select", group: "Before & after", options: [
        { value: "before", label: "Before" },
        { value: "after", label: "After" },
      ] },
      { key: "projectSlug", label: "Related project", type: "select", group: "Links", options: { from: "projects" } },
    ],
  },

  clients: {
    key: "clients",
    table: "content_clients",
    label: "Client logos",
    singular: "Client",
    description: "Client marks shown on the homepage. Only add clients who have agreed in writing.",
    icon: Building2,
    group: "Website",
    titleField: "name",
    subtitleField: "sector",
    imageField: "image",
    fields: [
      { key: "name", label: "Client name", type: "text", required: true, group: "Basics" },
      { key: "sector", label: "Sector", type: "text", required: true, group: "Basics" },
      { key: "image", label: "Logo", type: "media", group: "Basics" },
    ],
  },

  documents: {
    key: "documents",
    table: "content_documents",
    label: "Documents",
    singular: "Document",
    description: "Brochures, certificates, technical sheets and policies offered for download.",
    icon: FileText,
    group: "Website",
    titleField: "title",
    subtitleField: "category",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, group: "Basics" },
      { key: "description", label: "Description", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "category", label: "Category", type: "select", required: true, group: "Basics", options: [
        { value: "brochure", label: "Brochure" },
        { value: "certificate", label: "Certificate" },
        { value: "technical", label: "Technical sheet" },
        { value: "policy", label: "Policy" },
        { value: "project", label: "Project document" },
      ] },
      { key: "fileUrl", label: "File URL", type: "url", required: true, group: "File", help: "Upload to the documents bucket, then paste the public URL here." },
      { key: "fileType", label: "File type", type: "text", group: "File", placeholder: "PDF" },
      { key: "fileSize", label: "File size", type: "text", group: "File", placeholder: "2.4 MB" },
      { key: "updatedAt", label: "Document date", type: "date", group: "File" },
    ],
  },

  news: {
    key: "news",
    table: "content_news",
    label: "News & insight",
    singular: "Article",
    description: "Articles published under the company's name.",
    icon: Newspaper,
    group: "Website",
    titleField: "title",
    subtitleField: "category",
    slugField: "slug",
    imageField: "image",
    fields: [
      { key: "title", label: "Headline", type: "text", required: true, wide: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics" },
      { key: "category", label: "Category", type: "text", required: true, group: "Basics" },
      { key: "author", label: "Author", type: "text", required: true, group: "Basics" },
      { key: "publishedAt", label: "Publication date", type: "date", required: true, group: "Basics" },
      { key: "featured", label: "Featured", type: "boolean", group: "Basics" },
      { key: "excerpt", label: "Standfirst", type: "textarea", required: true, wide: true, group: "Content" },
      { key: "body", label: "Article body", type: "longtext", required: true, wide: true, group: "Content", help: "Blank line between paragraphs. \"## \" for a heading, \"- \" for a bullet, **bold** for emphasis." },
      { key: "image", label: "Header image", type: "media", group: "Content" },
    ],
  },

  careers: {
    key: "careers",
    table: "content_careers",
    label: "Vacancies",
    singular: "Vacancy",
    description: "Open positions. Set the status to draft to take a role down.",
    icon: Briefcase,
    group: "People",
    titleField: "title",
    subtitleField: "department",
    slugField: "slug",
    fields: [
      { key: "title", label: "Job title", type: "text", required: true, group: "Basics" },
      { key: "slug", label: "URL slug", type: "slug", required: true, group: "Basics" },
      { key: "department", label: "Department", type: "text", required: true, group: "Basics" },
      { key: "location", label: "Location", type: "text", required: true, group: "Basics" },
      { key: "type", label: "Employment type", type: "select", required: true, group: "Basics", options: [
        { value: "permanent", label: "Permanent" },
        { value: "contract", label: "Contract" },
        { value: "temporary", label: "Temporary" },
        { value: "apprenticeship", label: "Apprenticeship" },
      ] },
      { key: "closingDate", label: "Closing date", type: "date", group: "Basics" },
      { key: "summary", label: "Summary", type: "textarea", required: true, wide: true, group: "Content" },
      { key: "responsibilities", label: "Responsibilities", type: "stringlist", wide: true, group: "Content" },
      { key: "requirements", label: "Requirements", type: "stringlist", wide: true, group: "Content" },
      { key: "advantageous", label: "Advantageous", type: "stringlist", wide: true, group: "Content" },
    ],
  },

  departments: {
    key: "departments",
    table: "content_departments",
    label: "Departments",
    singular: "Department",
    description: "The desks listed on the contact page and in the contact form.",
    icon: Inbox,
    group: "Operations",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { key: "name", label: "Department", type: "text", required: true, group: "Basics" },
      { key: "role", label: "What it handles", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "email", label: "Email", type: "email", required: true, group: "Contact" },
      { key: "phone", label: "Telephone", type: "tel", required: true, group: "Contact" },
      { key: "hours", label: "Hours", type: "text", required: true, group: "Contact" },
    ],
  },

  staff: {
    key: "staff",
    table: "content_staff",
    label: "Team",
    singular: "Team member",
    description: "Named staff, if and when the business wants them on the site.",
    icon: UsersRound,
    group: "People",
    titleField: "name",
    subtitleField: "title",
    imageField: "image",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, group: "Basics" },
      { key: "title", label: "Job title", type: "text", required: true, group: "Basics" },
      { key: "department", label: "Department", type: "text", required: true, group: "Basics" },
      { key: "bio", label: "Biography", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "image", label: "Photograph", type: "media", group: "Basics" },
    ],
  },

  divisions: {
    key: "divisions",
    table: "content_divisions",
    label: "Divisions",
    singular: "Division",
    description: "The four operating divisions shown on the homepage and about page.",
    icon: Boxes,
    group: "Website",
    titleField: "name",
    subtitleField: "strapline",
    slugField: "key",
    imageField: "image",
    fields: [
      { key: "key", label: "Key", type: "slug", required: true, group: "Basics", help: "Used to link services to this division. Changing it will orphan those services." },
      { key: "name", label: "Name", type: "text", required: true, group: "Basics" },
      { key: "strapline", label: "Strapline", type: "text", required: true, wide: true, group: "Basics" },
      { key: "description", label: "Description", type: "textarea", required: true, wide: true, group: "Basics" },
      { key: "image", label: "Image", type: "media", group: "Basics" },
      { key: "href", label: "Links to", type: "text", required: true, group: "Basics" },
    ],
  },
};

/* ============================================================================
   SINGLETONS
   ========================================================================= */

export interface SingletonDef {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Website" | "Operations";
  fields: FieldDef[];
}

export const SINGLETONS: Record<string, SingletonDef> = {
  business: {
    key: "business",
    label: "Business information",
    description: "Name, address, contact channels, hours and service footprint. Used across the whole site and in the search-engine record.",
    icon: Info,
    group: "Operations",
    fields: [
      { key: "tradingName", label: "Trading name", type: "text", required: true, group: "Identity" },
      { key: "legalName", label: "Legal name", type: "text", required: true, group: "Identity" },
      { key: "shortName", label: "Short name", type: "text", required: true, group: "Identity" },
      { key: "descriptor", label: "Logo descriptor", type: "text", required: true, group: "Identity", help: "The small text under the wordmark." },
      { key: "tagline", label: "Tagline", type: "text", wide: true, group: "Identity" },
      { key: "summary", label: "Company summary", type: "textarea", required: true, wide: true, group: "Identity", help: "Used as the default meta description and in the organisation record search engines read." },
      { key: "foundedYear", label: "Year founded", type: "number", group: "Identity", help: "Drives the \"years on the coalfields\" counter on the homepage." },
      { key: "registration", label: "Company registration number", type: "text", group: "Identity" },
      { key: "vat", label: "VAT number", type: "text", group: "Identity" },
      { key: "bbbee", label: "B-BBEE level", type: "text", group: "Identity" },

      { key: "phone", label: "Main telephone", type: "tel", required: true, group: "Contact" },
      { key: "emergencyPhone", label: "24-hour breakdown line", type: "tel", required: true, group: "Contact" },
      { key: "whatsapp", label: "WhatsApp number", type: "tel", required: true, group: "Contact" },
      { key: "email", label: "General email", type: "email", required: true, group: "Contact" },
      { key: "quotesEmail", label: "Quotations email", type: "email", required: true, group: "Contact" },
      { key: "emergencyNote", label: "Emergency note", type: "textarea", wide: true, group: "Contact" },

      { key: "address.street", label: "Street", type: "text", required: true, group: "Address" },
      { key: "address.suburb", label: "Suburb", type: "text", required: true, group: "Address" },
      { key: "address.city", label: "Town or city", type: "text", required: true, group: "Address" },
      { key: "address.province", label: "Province", type: "text", required: true, group: "Address" },
      { key: "address.postalCode", label: "Postal code", type: "text", required: true, group: "Address" },
      { key: "address.country", label: "Country", type: "text", required: true, group: "Address" },
      { key: "address.lat", label: "Latitude", type: "number", required: true, group: "Address" },
      { key: "address.lng", label: "Longitude", type: "number", required: true, group: "Address" },
      { key: "address.directions", label: "Directions", type: "textarea", wide: true, group: "Address" },

      { key: "serviceAreas", label: "Service footprint", type: "stringlist", wide: true, group: "Coverage", help: "Towns listed in the footer and in the search-engine record." },

      {
        key: "hours",
        label: "Operating hours",
        type: "objectlist",
        wide: true,
        group: "Hours",
        fields: [
          { key: "day", label: "Day (0 = Sunday)", type: "number", required: true },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "opens", label: "Opens (minutes from midnight)", type: "number" },
          { key: "closes", label: "Closes (minutes from midnight)", type: "number" },
          { key: "alwaysOpen", label: "Open 24 hours", type: "boolean" },
        ],
      },

      {
        key: "socials",
        label: "Social profiles",
        type: "objectlist",
        wide: true,
        group: "Social",
        fields: [
          { key: "platform", label: "Platform", type: "select", required: true, options: [
            { value: "facebook", label: "Facebook" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "instagram", label: "Instagram" },
            { value: "youtube", label: "YouTube" },
            { value: "x", label: "X" },
          ] },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "href", label: "URL", type: "url", required: true },
        ],
      },
    ],
  },

  home: {
    key: "home",
    label: "Homepage",
    description: "Hero, statistics, introduction, reasons to choose us and the safety band.",
    icon: Home,
    group: "Website",
    fields: [
      { key: "hero.eyebrow", label: "Hero eyebrow", type: "text", required: true, group: "Hero" },
      { key: "hero.headline", label: "Hero headline", type: "textarea", required: true, wide: true, group: "Hero" },
      { key: "hero.highlight", label: "Highlighted words", type: "text", wide: true, group: "Hero", help: "Must appear exactly in the headline. That fragment is rendered in gold." },
      { key: "hero.subhead", label: "Hero subheading", type: "textarea", required: true, wide: true, group: "Hero" },
      { key: "hero.primaryCta.label", label: "Primary button text", type: "text", required: true, group: "Hero" },
      { key: "hero.primaryCta.href", label: "Primary button link", type: "text", required: true, group: "Hero" },
      { key: "hero.secondaryCta.label", label: "Secondary button text", type: "text", group: "Hero" },
      { key: "hero.secondaryCta.href", label: "Secondary button link", type: "text", group: "Hero" },
      { key: "hero.media", label: "Hero images", type: "medialist", wide: true, group: "Hero", help: "Cross-faded in order. The first one is the image search engines and social cards use." },
      { key: "hero.assurances", label: "Assurance strip", type: "stringlist", wide: true, group: "Hero", help: "Four short proof points under the hero." },

      { key: "trustLine", label: "Footprint band text", type: "text", wide: true, group: "Introduction" },
      { key: "introEyebrow", label: "Eyebrow", type: "text", required: true, group: "Introduction" },
      { key: "introHeadline", label: "Headline", type: "text", required: true, wide: true, group: "Introduction" },
      { key: "introBody", label: "Body", type: "longtext", required: true, wide: true, group: "Introduction" },
      { key: "introImage", label: "Image", type: "media", group: "Introduction" },
      {
        key: "introPoints",
        label: "Supporting points",
        type: "objectlist",
        wide: true,
        group: "Introduction",
        fields: [
          { key: "title", label: "Point", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
        ],
      },

      {
        key: "stats",
        label: "Statistics",
        type: "objectlist",
        wide: true,
        group: "Statistics",
        fields: [
          { key: "value", label: "Number", type: "number", required: true },
          { key: "prefix", label: "Prefix", type: "text" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "note", label: "Provenance note", type: "textarea", help: "Says where the figure comes from. Do not publish a number you cannot support." },
        ],
      },

      {
        key: "whyUs",
        label: "Why choose us",
        type: "objectlist",
        wide: true,
        group: "Why us",
        fields: [
          { key: "title", label: "Reason", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
          { key: "icon", label: "Icon", type: "select", required: true, options: [...SERVICE_ICONS, { value: "shield", label: "shield" }, { value: "clock", label: "clock" }, { value: "gauge", label: "gauge" }] },
        ],
      },

      { key: "safetyEyebrow", label: "Eyebrow", type: "text", required: true, group: "Safety band" },
      { key: "safetyHeadline", label: "Headline", type: "text", required: true, wide: true, group: "Safety band" },
      { key: "safetyBody", label: "Body", type: "textarea", required: true, wide: true, group: "Safety band" },
      { key: "safetyPoints", label: "Points", type: "stringlist", wide: true, group: "Safety band" },
      { key: "safetyImage", label: "Background image", type: "media", group: "Safety band" },

      { key: "ctaHeadline", label: "Headline", type: "text", required: true, wide: true, group: "Closing call to action" },
      { key: "ctaBody", label: "Body", type: "textarea", required: true, wide: true, group: "Closing call to action" },
    ],
  },

  about: {
    key: "about",
    label: "About page",
    description: "Company story, values, growth timeline and capability sheet.",
    icon: Info,
    group: "Website",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", required: true, group: "Header" },
      { key: "headline", label: "Headline", type: "text", required: true, wide: true, group: "Header" },
      { key: "lead", label: "Lead paragraph", type: "textarea", required: true, wide: true, group: "Header" },
      { key: "image", label: "Header image", type: "media", group: "Header" },
      { key: "story", label: "The story", type: "longtext", required: true, wide: true, group: "Story" },
      {
        key: "values",
        label: "Values",
        type: "objectlist",
        wide: true,
        group: "Values",
        fields: [
          { key: "title", label: "Value", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
        ],
      },
      {
        key: "timeline",
        label: "Growth timeline",
        type: "objectlist",
        wide: true,
        group: "Timeline",
        fields: [
          { key: "year", label: "Marker", type: "text", required: true },
          { key: "title", label: "Title", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
        ],
      },
      {
        key: "capabilities",
        label: "Capability sheet",
        type: "objectlist",
        wide: true,
        group: "Capability",
        fields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "value", label: "Value", type: "text", required: true },
        ],
      },
    ],
  },

  safety: {
    key: "safety",
    label: "Health & safety",
    description: "HSEQ standards, procedures, training, PPE, environmental controls and certifications.",
    icon: ShieldCheck,
    group: "Website",
    fields: [
      { key: "intro", label: "Introduction", type: "textarea", required: true, wide: true, group: "Opening" },
      { key: "commitment", label: "Commitment statement", type: "textarea", required: true, wide: true, group: "Opening" },
      { key: "image", label: "Image", type: "media", group: "Opening" },
      {
        key: "standards",
        label: "Standards",
        type: "objectlist",
        wide: true,
        group: "Standards",
        fields: [
          { key: "title", label: "Standard", type: "text", required: true },
          { key: "description", label: "Explanation", type: "textarea", required: true },
          { key: "icon", label: "Icon", type: "select", required: true, options: [
            { value: "clipboard", label: "clipboard" },
            { value: "hardhat", label: "hard hat" },
            { value: "shield", label: "shield" },
            { value: "leaf", label: "leaf" },
            { value: "gauge", label: "gauge" },
            { value: "book", label: "book" },
          ] },
        ],
      },
      {
        key: "procedures",
        label: "Procedures",
        type: "objectlist",
        wide: true,
        group: "Procedures",
        fields: [
          { key: "title", label: "Stage", type: "text", required: true },
          { key: "items", label: "Controls", type: "stringlist", required: true },
        ],
      },
      {
        key: "training",
        label: "Training",
        type: "objectlist",
        wide: true,
        group: "Training",
        fields: [
          { key: "title", label: "Training", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "frequency", label: "Frequency", type: "text", required: true },
        ],
      },
      { key: "ppe", label: "PPE", type: "stringlist", wide: true, group: "Controls" },
      { key: "environmental", label: "Environmental", type: "stringlist", wide: true, group: "Controls" },
      { key: "riskManagement", label: "Risk management", type: "stringlist", wide: true, group: "Controls" },
      { key: "qualityAssurance", label: "Quality assurance", type: "stringlist", wide: true, group: "Controls" },
      {
        key: "certifications",
        label: "Certifications",
        type: "objectlist",
        wide: true,
        group: "Certifications",
        fields: [
          { key: "name", label: "Certification", type: "text", required: true },
          { key: "issuer", label: "Issued by", type: "text", required: true },
          { key: "reference", label: "Reference number", type: "text" },
          { key: "validUntil", label: "Valid until", type: "date" },
        ],
      },
      {
        key: "stats",
        label: "Safety statistics",
        type: "objectlist",
        wide: true,
        group: "Statistics",
        fields: [
          { key: "value", label: "Number", type: "number", required: true },
          { key: "prefix", label: "Prefix", type: "text" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "note", label: "Provenance note", type: "textarea" },
        ],
      },
    ],
  },
};

/* ============================================================================
   NAVIGATION
   ========================================================================= */

export interface NavEntry {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Minimum role required to see the entry. */
  role?: "viewer" | "editor" | "admin";
  badge?: "quotes" | "messages" | "applications";
}

export interface NavSection {
  title: string;
  entries: NavEntry[];
}

export const PORTAL_NAV: NavSection[] = [
  {
    title: "Overview",
    entries: [{ label: "Dashboard", href: "/portal", icon: LayoutDashboard }],
  },
  {
    title: "Enquiries",
    entries: [
      { label: "Quote requests", href: "/portal/enquiries/quotes", icon: Quote, badge: "quotes" },
      { label: "Messages", href: "/portal/enquiries/messages", icon: Inbox, badge: "messages" },
      { label: "Applications", href: "/portal/enquiries/applications", icon: Briefcase, badge: "applications" },
      { label: "Customers", href: "/portal/customers", icon: Building2 },
      { label: "Invoices", href: "/portal/invoices", icon: Receipt },
    ],
  },
  {
    title: "Pages",
    entries: [
      { label: "Homepage", href: "/portal/pages/home", icon: Home },
      { label: "About", href: "/portal/pages/about", icon: Info },
      { label: "Health & safety", href: "/portal/pages/safety", icon: ShieldCheck },
      { label: "Page headers", href: "/portal/pages/headers", icon: ScrollText },
    ],
  },
  {
    title: "Content",
    entries: [
      { label: "Services", href: "/portal/content/services", icon: Wrench },
      { label: "Fleet", href: "/portal/content/fleet", icon: Truck },
      { label: "Divisions", href: "/portal/content/divisions", icon: Boxes },
      { label: "Industries", href: "/portal/content/industries", icon: Landmark },
      { label: "Projects", href: "/portal/content/projects", icon: FolderKanban },
      { label: "Gallery", href: "/portal/content/gallery", icon: ImageIcon },
      { label: "Testimonials", href: "/portal/content/testimonials", icon: MessageSquareQuote },
      { label: "FAQs", href: "/portal/content/faqs", icon: LifeBuoy },
      { label: "News & insight", href: "/portal/content/news", icon: Newspaper },
      { label: "Client logos", href: "/portal/content/clients", icon: Building2 },
      { label: "Documents", href: "/portal/content/documents", icon: FileText },
    ],
  },
  {
    title: "Operations",
    entries: [
      { label: "Business information", href: "/portal/pages/business", icon: Info },
      { label: "Departments", href: "/portal/content/departments", icon: Inbox },
      { label: "Team", href: "/portal/content/staff", icon: UsersRound },
      { label: "Vacancies", href: "/portal/content/careers", icon: Briefcase },
      { label: "Media library", href: "/portal/media", icon: Package },
    ],
  },
  {
    title: "System",
    entries: [
      { label: "SEO", href: "/portal/settings/seo", icon: Search, role: "admin" },
      { label: "Appearance", href: "/portal/settings/appearance", icon: Sliders, role: "admin" },
      { label: "Settings", href: "/portal/settings", icon: Settings, role: "admin" },
      { label: "Users & permissions", href: "/portal/users", icon: Users, role: "admin" },
      { label: "Audit log", href: "/portal/audit", icon: ScrollText, role: "admin" },
      { label: "Analytics", href: "/portal/analytics", icon: Gauge, role: "admin" },
    ],
  },
];

/* --- Helpers ---------------------------------------------------------------- */

/** Reads "address.lat" style paths out of a record. */
export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

/** Writes "address.lat" style paths, creating intermediate objects. */
export function setPath<T extends Record<string, unknown>>(
  target: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const next = { ...target } as Record<string, unknown>;
  let cursor = next;

  keys.slice(0, -1).forEach((key) => {
    const existing = cursor[key];
    cursor[key] = existing && typeof existing === "object" ? { ...(existing as object) } : {};
    cursor = cursor[key] as Record<string, unknown>;
  });

  cursor[keys[keys.length - 1]] = value;
  return next as T;
}

/** Groups a field list into the panels the editor renders. */
export function groupFields(fields: FieldDef[]) {
  const groups = new Map<string, FieldDef[]>();
  for (const field of fields) {
    const key = field.group ?? "Details";
    const list = groups.get(key) ?? [];
    list.push(field);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([title, items]) => ({ title, fields: items }));
}

export const HARD_HAT_ICON = HardHat;
export const CALENDAR_ICON = CalendarClock;
