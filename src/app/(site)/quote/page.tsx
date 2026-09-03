import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, FileText, Phone, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/site/QuoteForm";
import { getBusiness, getIndustries, getPageMeta, getServices } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("quote");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/quote",
    image: page.image,
    seo: page.seo,
  });
}

const ASSURANCES = [
  {
    icon: Clock,
    title: "Response times we actually keep",
    body: "Plant hire rates and parts quotations are usually back within 24 hours. Earthworks needs a site visit, and we give you the date of that visit when you submit.",
  },
  {
    icon: FileText,
    title: "Written, itemised, no verbal rates",
    body: "Every quotation states the basis — wet or dry, minimum hours, fuel, mobilisation and standing time — so there is nothing to discover later.",
  },
  {
    icon: ShieldCheck,
    title: "Your details stay with us",
    body: "Enquiry data is used to answer your enquiry and nothing else. We do not sell it, share it, or add you to a mailing list.",
  },
];

export default async function QuotePage() {
  const [page, services, industries, business] = await Promise.all([
    getPageMeta("quote"),
    getServices(),
    getIndustries(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Request a Quote", path: "/quote" },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Request a quote" }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            {/* useSearchParams needs a boundary during prerender. */}
            <Suspense fallback={null}>
              <QuoteForm
                services={services}
                industries={industries}
                phone={business.emergencyPhone}
              />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Reveal direction="left">
              <div className="chamfer border border-gold-500/30 bg-ink-900 p-7">
                <span className="eyebrow flex items-center gap-2.5 text-gold-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-signal-green opacity-70 motion-safe:animate-[leikah-pulse-ring_2.4s_ease-out_infinite]" />
                    <span className="relative inline-flex size-2 rounded-full bg-signal-green" />
                  </span>
                  Machine down right now?
                </span>
                <p className="mt-4 text-sm leading-relaxed text-steel-300">
                  Do not fill in a form. The breakdown line is answered every hour of every day and
                  it will always be faster.
                </p>
                <a
                  href={telHref(business.emergencyPhone)}
                  className="chamfer-sm mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 bg-gold-500 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
                >
                  <Phone className="size-4" />
                  <span className="tabular">{business.emergencyPhone}</span>
                </a>
                <a
                  href={whatsappHref(business.whatsapp, "Good day, I would like to request a quotation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-xs text-steel-400 underline underline-offset-4 transition-colors hover:text-gold-400"
                >
                  Or send it on WhatsApp
                </a>
              </div>
            </Reveal>

            {ASSURANCES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} direction="left" delay={0.06 * (i + 1)}>
                <div className="flex gap-4">
                  <span className="chamfer-sm inline-flex size-10 shrink-0 items-center justify-center border border-steel-600/25 text-gold-500">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-paper-50">{title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </aside>
        </div>
      </Section>
    </>
  );
}
