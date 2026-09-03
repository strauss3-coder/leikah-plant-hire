import type { BusinessInfo, Department, StaffMember, Division } from "@/lib/cms/types";

/* ============================================================================
   BUSINESS RECORD

   Address, coordinates and the operating schedule come from the verified
   corporate record. Fields the client alone can confirm — registration number,
   VAT, B-BBEE level, branded mailboxes — are left empty rather than invented;
   the portal dashboard lists them as outstanding before launch.
   ========================================================================= */

export const business: BusinessInfo = {
  legalName: "Leikah Plant Hire",
  tradingName: "Leikah Plant Hire",
  shortName: "Leikah",
  tagline: "Plant, earthmoving and heavy mechanical support that keeps production running.",
  descriptor: "PLANT HIRE",
  summary:
    "Leikah Plant Hire is a Middelburg-based plant hire, earthmoving and heavy mechanical contractor serving the Mpumalanga coalfields and the industrial corridor around them. We move bulk material, build and hold haul roads, and keep heavy fleets in production through scheduled maintenance and 24-hour breakdown response.",
  foundedYear: 2016,
  registration: "",
  vat: "",
  bbbee: "",
  address: {
    street: "7 July Street",
    suburb: "New Industrial Area",
    city: "Middelburg",
    province: "Mpumalanga",
    postalCode: "1055",
    country: "South Africa",
    lat: -25.788143,
    lng: 29.495417,
    directions:
      "Off Cowen Ntuli Street in the New Industrial Area, in the yard shared with the July Street commercial precinct. Ten minutes from the N4 and inside the heavy-engineering corridor, which is why parts land the same day.",
  },
  phone: "+27 60 976 3429",
  emergencyPhone: "+27 60 976 3429",
  whatsapp: "+27 60 976 3429",
  email: "info@leikahplanthire.co.za",
  quotesEmail: "quotes@leikahplanthire.co.za",
  hours: [
    { day: 1, label: "Monday", opens: 420, closes: 1020 },
    { day: 2, label: "Tuesday", opens: 420, closes: 1020 },
    { day: 3, label: "Wednesday", opens: 420, closes: 1020 },
    { day: 4, label: "Thursday", opens: 420, closes: 1020 },
    { day: 5, label: "Friday", opens: 420, closes: 1020 },
    { day: 6, label: "Saturday", opens: 420, closes: 780 },
    { day: 0, label: "Sunday", opens: null, closes: null },
  ],
  emergencyNote:
    "The workshop keeps office hours. Breakdown dispatch does not — the emergency line is answered around the clock, every day of the year, including public holidays.",
  socials: [
    {
      platform: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/",
    },
  ],
  serviceAreas: [
    "Middelburg",
    "Witbank / eMalahleni",
    "Hendrina",
    "Belfast",
    "Steelpoort",
    "Delmas",
    "Ogies",
    "Kriel",
    "Secunda",
    "Lydenburg / Mashishing",
  ],
};

export const departments: Department[] = [
  {
    id: "dep-dispatch",
    name: "Breakdown Dispatch",
    role: "Emergency call-outs, mobile field service, standby crews",
    email: "dispatch@leikahplanthire.co.za",
    phone: "+27 60 976 3429",
    hours: "24 hours, 365 days",
    order: 1,
  },
  {
    id: "dep-hire",
    name: "Plant Hire Desk",
    role: "Machine availability, rates, wet and dry hire, mobilisation",
    email: "hire@leikahplanthire.co.za",
    phone: "+27 60 976 3429",
    hours: "Mon–Fri 07:00–17:00, Sat 07:00–13:00",
    order: 2,
  },
  {
    id: "dep-workshop",
    name: "Workshop & Component Rebuild",
    role: "Engine, transmission, final drive and hydraulic overhauls",
    email: "workshop@leikahplanthire.co.za",
    phone: "+27 60 976 3429",
    hours: "Mon–Fri 07:00–17:00",
    order: 3,
  },
  {
    id: "dep-supply",
    name: "Supply & Procurement",
    role: "Parts, filtration, lubricants, hydraulic hose, consumables",
    email: "supply@leikahplanthire.co.za",
    phone: "+27 60 976 3429",
    hours: "Mon–Fri 07:00–17:00",
    order: 4,
  },
  {
    id: "dep-accounts",
    name: "Accounts & Vendor Onboarding",
    role: "Purchase orders, invoicing, vendor packs, compliance documents",
    email: "accounts@leikahplanthire.co.za",
    phone: "+27 60 976 3429",
    hours: "Mon–Fri 08:00–16:00",
    order: 5,
  },
];

export const staff: StaffMember[] = [];

export const divisions: Division[] = [
  {
    key: "earthmoving",
    name: "Earthmoving & Plant Hire",
    strapline: "Machines, operators and production on the bench",
    description:
      "Dozers, excavators, haulers and graders supplied wet or dry, with operators who have worked a coal face before. Bulk cut, overburden, haul roads, rehabilitation and stockpile handling.",
    image: "dozer-d10t-refurbished",
    href: "/services?division=earthmoving",
    order: 1,
  },
  {
    key: "mechanical",
    name: "Heavy Mechanical",
    strapline: "Component rebuilds and planned maintenance",
    description:
      "Diesel engines, powershift transmissions, final drives and hydraulics stripped, measured, rebuilt to OEM specification and returned under warranty. Planned maintenance contracts that stop failures before they cost a shift.",
    image: "engine-flywheel-housing",
    href: "/maintenance",
    order: 2,
  },
  {
    key: "supply",
    name: "Supply Division",
    strapline: "Parts on site before the shift changes",
    description:
      "Filtration, lubricants, hydraulic hose assemblies, undercarriage, ground-engaging tools and workshop consumables, sourced through the OEM corridor on our doorstep and delivered to site.",
    image: "parts-dispatch-pallet",
    href: "/supply",
    order: 3,
  },
  {
    key: "emergency",
    name: "24-Hour Breakdown",
    strapline: "Mobile workshops, answered day or night",
    description:
      "Fully equipped field service units carrying diagnostics, welding, crimping and fluid transfer, dispatched to your site the moment a machine stops.",
    image: "field-service-excavator-repair",
    href: "/emergency",
    order: 4,
  },
];
