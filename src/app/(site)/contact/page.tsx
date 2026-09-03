import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Navigation } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { OpeningStatus } from "@/components/layout/OpeningStatus";
import { CornerMarks, SurveyGrid } from "@/components/graphics/Atmosphere";
import { getBusiness, getDepartments, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("contact");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/contact",
    image: page.image,
    seo: page.seo,
  });
}

function timeLabel(mins: number | null) {
  if (mins === null) return "Closed";
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export default async function ContactPage() {
  const [page, business, departments] = await Promise.all([
    getPageMeta("contact"),
    getBusiness(),
    getDepartments(),
  ]);

  const { address } = business;
  const mapQuery = `${address.lat},${address.lng}`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        blueprint="hauler"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        size="compact"
      />

      {/* --- Primary channels --------------------------------------------------- */}
      <div className="border-b border-steel-600/15 bg-ink-900">
        <RevealGroup className="shell grid gap-px bg-steel-600/12 sm:grid-cols-3">
          <RevealItem>
            <a
              href={telHref(business.emergencyPhone)}
              className="group flex h-full flex-col gap-3 bg-ink-900 p-7 transition-colors hover:bg-ink-850"
            >
              <span className="chamfer-sm inline-flex size-11 items-center justify-center border border-gold-500/35 text-gold-400">
                <Phone className="size-4" />
              </span>
              <span className="eyebrow text-steel-500">24-hour breakdown line</span>
              <span className="text-lg font-bold text-paper-50 tabular transition-colors group-hover:text-gold-400">
                {business.emergencyPhone}
              </span>
            </a>
          </RevealItem>

          <RevealItem>
            <a
              href={whatsappHref(business.whatsapp, "Good day, I would like to enquire about plant hire.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 bg-ink-900 p-7 transition-colors hover:bg-ink-850"
            >
              <span className="chamfer-sm inline-flex size-11 items-center justify-center border border-steel-600/25 text-gold-400">
                <MessageCircle className="size-4" />
              </span>
              <span className="eyebrow text-steel-500">WhatsApp</span>
              <span className="text-lg font-bold text-paper-50 tabular transition-colors group-hover:text-gold-400">
                {business.whatsapp}
              </span>
            </a>
          </RevealItem>

          <RevealItem>
            <a
              href={`mailto:${business.email}`}
              className="group flex h-full flex-col gap-3 bg-ink-900 p-7 transition-colors hover:bg-ink-850"
            >
              <span className="chamfer-sm inline-flex size-11 items-center justify-center border border-steel-600/25 text-gold-400">
                <Mail className="size-4" />
              </span>
              <span className="eyebrow text-steel-500">General enquiries</span>
              <span className="break-all text-lg font-bold text-paper-50 transition-colors group-hover:text-gold-400">
                {business.email}
              </span>
            </a>
          </RevealItem>
        </RevealGroup>
      </div>

      {/* --- Form + location ------------------------------------------------------ */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Send a message"
              title="Tell us what you need and who should see it"
              lead="For anything that needs a scope, a site and a date, the quotation workflow gathers the right detail and will get you a closer first number."
              tone="darker"
            />
            <ContactForm departments={departments} />
          </div>

          <aside className="flex flex-col gap-6">
            {/* --- Location plate --------------------------------------------- */}
            <Reveal direction="left">
              <div className="chamfer relative overflow-hidden border border-steel-600/18 bg-ink-900">
                <CornerMarks />
                {/* A static coordinate plate rather than an embedded map: no
                    third-party script, no consent banner, and it still gets the
                    driver where they need to go. */}
                <div className="relative border-b border-steel-600/15 bg-ink-950 p-7">
                  <SurveyGrid opacity={0.6} />
                  <div className="relative flex items-start gap-4">
                    <MapPin className="mt-1 size-5 shrink-0 text-gold-500" />
                    <address className="not-italic">
                      <p className="font-display text-lg font-bold text-paper-50">
                        {address.street}
                      </p>
                      <p className="mt-1 text-sm text-steel-300">
                        {address.suburb}
                        <br />
                        {address.city}, {address.province} {address.postalCode}
                        <br />
                        {address.country}
                      </p>
                    </address>
                  </div>
                  <p className="relative mt-5 font-mono text-xs text-steel-500 tabular">
                    {address.lat.toFixed(6)}° S&nbsp;&nbsp;{address.lng.toFixed(6)}° E
                  </p>
                </div>

                <div className="p-7">
                  <p className="text-sm leading-relaxed text-steel-400">{address.directions}</p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={directionsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chamfer-sm inline-flex h-11 flex-1 items-center justify-center gap-2 bg-gold-500 px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400"
                    >
                      <Navigation className="size-4" />
                      Directions
                    </a>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chamfer-sm inline-flex h-11 flex-1 items-center justify-center border border-steel-600/25 px-4 text-sm font-medium text-steel-200 transition-colors hover:border-gold-500/50"
                    >
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* --- Hours ------------------------------------------------------- */}
            <Reveal direction="left" delay={0.06}>
              <div className="chamfer border border-steel-600/18 bg-ink-900 p-7">
                <h2 className="eyebrow text-gold-500">Yard & office hours</h2>
                <dl className="mt-5 flex flex-col divide-y divide-steel-600/12">
                  {business.hours.map((day) => (
                    <div key={day.day} className="flex justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-steel-400">{day.label}</dt>
                      <dd className="font-medium text-steel-100 tabular">
                        {day.alwaysOpen
                          ? "24 hours"
                          : day.opens === null
                            ? "Closed"
                            : `${timeLabel(day.opens)} – ${timeLabel(day.closes)}`}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 border-t border-steel-600/15 pt-5">
                  <OpeningStatus hours={business.hours} />
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* --- Departments ------------------------------------------------------------ */}
      <Section tone="dark">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="Departments"
            title="Go straight to the right desk"
            lead="One number reaches all of them, but if you already know who you need, this saves a transfer."
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {departments.map((department) => (
              <RevealItem key={department.id} className="flex flex-col gap-4 bg-ink-900 p-7">
                <div>
                  <h3 className="text-base font-bold text-paper-50">{department.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{department.role}</p>
                </div>
                <dl className="mt-auto flex flex-col gap-2 border-t border-steel-600/15 pt-4 text-sm">
                  <div className="flex items-center gap-2.5">
                    <dt className="sr-only">Email</dt>
                    <Mail className="size-3.5 shrink-0 text-gold-500" />
                    <dd>
                      <a
                        href={`mailto:${department.email}`}
                        className="break-all text-steel-300 transition-colors hover:text-gold-400"
                      >
                        {department.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <dt className="sr-only">Telephone</dt>
                    <Phone className="size-3.5 shrink-0 text-gold-500" />
                    <dd>
                      <a
                        href={telHref(department.phone)}
                        className="text-steel-300 tabular transition-colors hover:text-gold-400"
                      >
                        {department.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <dt className="sr-only">Hours</dt>
                    <dd className="text-xs text-steel-500">{department.hours}</dd>
                  </div>
                </dl>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>
    </>
  );
}
