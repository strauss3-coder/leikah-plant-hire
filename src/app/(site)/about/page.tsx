import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading, Paragraphs } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media, MediaScrim } from "@/components/ui/Media";
import { StatsBand } from "@/components/site/StatsBand";
import { DivisionShowcase } from "@/components/site/DivisionShowcase";
import { CtaBanner } from "@/components/site/CtaBanner";
import { CornerMarks, Parallax } from "@/components/graphics/Atmosphere";
import { getAbout, getBusiness, getDivisions, getHome } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return buildMetadata({
    title: "About Leikah Plant Hire",
    description: about.lead,
    path: "/about",
    image: about.image,
    seo: about.seo,
  });
}

export default async function AboutPage() {
  const [about, business, divisions, home] = await Promise.all([
    getAbout(),
    getBusiness(),
    getDivisions(),
    getHome(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        blueprint="excavator"
        eyebrow={about.eyebrow}
        headline={about.headline}
        lead={about.lead}
        image={about.image}
        trail={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* --- The story ------------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <Paragraphs
              text={about.story}
              paragraphClassName="text-steel-300 text-base sm:text-lg"
            />
          </Reveal>

          <Reveal direction="left" className="flex flex-col gap-8">
            <div className="chamfer relative overflow-hidden border border-steel-600/18">
              <Parallax distance={22}>
                <Media
                  media="leikah-response-vehicle"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  ratio="4 / 3"
                  className="w-full scale-110"
                />
              </Parallax>
              <MediaScrim from="bottom" intensity="light" />
            </div>

            {/* Capability sheet — reads as a spec plate rather than a bullet list. */}
            <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed">
              <CornerMarks />
              <h2 className="eyebrow text-gold-500">Capability sheet</h2>
              <dl className="mt-5 flex flex-col divide-y divide-steel-600/15">
                {about.capabilities.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                    <dt className="shrink-0 text-xs text-steel-500 sm:w-40">{row.label}</dt>
                    <dd className="text-sm font-medium text-steel-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      <StatsBand stats={home.stats} />

      {/* --- Values ----------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="How we work"
            title="Four habits that decide whether a contract goes well"
            lead="None of these are unusual. What is unusual is doing them on the days when it would be easier not to."
            tone="light"
            size="xl"
          />

          <RevealGroup className="grid gap-px bg-ink-900/10 sm:grid-cols-2">
            {about.values.map((value, i) => (
              <RevealItem key={value.title} className="flex flex-col gap-3 bg-paper-100 p-7">
                <span className="eyebrow text-gold-700 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-ink-950">{value.title}</h3>
                <p className="text-sm leading-relaxed text-ink-500">{value.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- How the business grew --------------------------------------------- */}
      <Section tone="darker">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="How the business grew"
            title="From dozer hire to four operating divisions"
            lead="Each division was added because a client needed something the previous one could not finish on its own."
            tone="darker"
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-steel-600/12 md:grid-cols-5" stagger={0.07}>
            {about.timeline.map((entry, i) => (
              <RevealItem
                key={entry.title}
                className="relative flex flex-col gap-3 bg-ink-950 p-6 pt-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-0 h-0.5 w-8 bg-gold-500"
                  style={{ opacity: 1 - i * 0.14 }}
                />
                <span className="eyebrow text-gold-400">{entry.year}</span>
                <h3 className="text-base leading-snug font-bold text-paper-50">{entry.title}</h3>
                <p className="text-sm leading-relaxed text-steel-400">{entry.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Divisions ---------------------------------------------------------- */}
      <Section tone="dark">
        <div className="shell-wide flex flex-col gap-12">
          <SectionHeading
            eyebrow="Operating divisions"
            title="What each division actually does"
            className="max-w-3xl"
          />
          <Reveal>
            <DivisionShowcase divisions={divisions} />
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        headline="Want the vendor pack?"
        body="Company documents, insurance certificates and the compliance file are issued on request — send us your vendor form and we will complete yours."
        phone={business.phone}
        primaryLabel="Contact the accounts desk"
        primaryHref="/contact"
      />
    </>
  );
}
