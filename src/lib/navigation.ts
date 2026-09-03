export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Rendered as a mega-menu panel on desktop, an accordion on mobile. */
  children?: NavChild[];
  /** Panels that also list the service or sector catalogue at render time. */
  dynamic?: "services" | "industries";
}

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    dynamic: "services",
    children: [
      { label: "All services", href: "/services", description: "The full capability across four divisions" },
      { label: "Maintenance solutions", href: "/maintenance", description: "Planned maintenance and component rebuilds" },
      { label: "Supply division", href: "/supply", description: "Parts, filtration and consumables to site" },
      { label: "Emergency response", href: "/emergency", description: "24-hour breakdown dispatch" },
    ],
  },
  { label: "Fleet", href: "/fleet" },
  { label: "Industries", href: "/industries", dynamic: "industries" },
  { label: "Projects", href: "/projects" },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "Health & safety", href: "/health-safety", description: "HSEQ standards, procedures and controls" },
      { label: "Gallery", href: "/gallery", description: "Site and workshop photography" },
      { label: "News & insight", href: "/news", description: "Notes from the yard" },
      { label: "Testimonials", href: "/testimonials", description: "What our clients say" },
      { label: "Careers", href: "/careers", description: "Operators, technicians and fitters" },
      { label: "FAQ", href: "/faq", description: "Straight answers to the usual questions" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: "Divisions",
    links: [
      { label: "Earthmoving & plant hire", href: "/services?division=earthmoving" },
      { label: "Our fleet", href: "/fleet" },
      { label: "Heavy mechanical", href: "/maintenance" },
      { label: "Supply division", href: "/supply" },
      { label: "24-hour breakdown", href: "/emergency" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Leikah", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Industries we serve", href: "/industries" },
      { label: "Health & safety", href: "/health-safety" },
      { label: "Careers", href: "/careers" },
      { label: "News & insight", href: "/news" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "Request a quotation", href: "/quote" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Routes that appear in the XML sitemap without needing a dynamic lookup. */
export const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/fleet",
  "/industries",
  "/projects",
  "/maintenance",
  "/supply",
  "/emergency",
  "/health-safety",
  "/gallery",
  "/careers",
  "/news",
  "/testimonials",
  "/faq",
  "/contact",
  "/quote",
];
