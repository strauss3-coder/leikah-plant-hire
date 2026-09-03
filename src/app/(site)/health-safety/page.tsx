import type { Metadata } from "next";
import {
  BookOpen,
  ClipboardList,
  Gauge,
  HardHat,
  Leaf,
  ShieldCheck,
  FileWarning,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { Accordion } from "@/components/ui/Accordion";
import { StatsBand } from "@/components/site/StatsBand";
import { CtaBanner } from "@/components/site/CtaBanner";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import { getBusiness, getPageMeta, getSafety } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import type { SafetyStandard } from "@/lib/cms/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("health-safety");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/health-safety",
    image: page.image,
    seo: page.seo,
  });
}

const STANDARD_ICONS: Record<SafetyStandard["icon"], React.ElementType> = {
  clipboard: ClipboardList,
  hardhat: HardHat,
  shield: ShieldCheck,
  leaf: Leaf,
  gauge: Gauge,
  book: BookOpen,
};

export default async function HealthSafetyPage() {
  const [page, safety, business] = await Promise.all([
    getPageMeta("health-safety"),
    getSafety(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Health & Safety", path: "/health-safety" },
        ])}
      />

      <PageHeader
        blueprint="dozer"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Health & Safety" }]}
      />

      {/* --- Commitment ------------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-7">
            <Reveal>
              <p className="text-lg leading-relaxed text-steel-200 sm:text-xl">{safety.intro}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border-l-2 border-gold-500 pl-6">
                <p className="text-base leading-relaxed text-steel-300">{safety.commitment}</p>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left">
            <div className="chamfer overflow-hidden border border-steel-600/18">
              <Media
                media={safety.image}
                sizes="(min-width: 1024px) 45vw, 100vw"
                ratio="4 / 3"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {safety.stats.length > 0 && <StatsBand stats={safety.stats} />}

      {/* --- Standards -------------------------------------------------------- */}
      <Section tone="dark">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="Standards"
            title="Six positions we do not negotiate on"
            lead="These are stated so that your SHE department can hold us to them, not so that they read well on a website."
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {safety.standards.map((standard) => {
              const Icon = STANDARD_ICONS[standard.icon] ?? ShieldCheck;
              return (
                <RevealItem key={standard.id} className="flex flex-col gap-4 bg-ink-900 p-7">
                  <span className="chamfer-sm inline-flex size-12 items-center justify-center border border-steel-600/25 text-gold-400">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-base leading-snug font-bold text-paper-50">
                    {standard.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-steel-400">{standard.description}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* --- Procedures -------------------------------------------------------- */}
      <Section tone="light">
        <div className="shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <SectionHeading
            eyebrow="Procedures"
            title="What happens, in order, on every job"
            lead="Four stages. Nothing in them is optional, and none of it depends on who is supervising that day."
            tone="light"
          />

          <Accordion
            tone="light"
            defaultOpen={0}
            items={safety.procedures.map((group, i) => ({
              id: `proc-${i}`,
              question: group.title,
              meta: `${group.items.length} controls`,
              answer: group.items.map((item) => `• ${item}`).join("\n\n"),
            }))}
          />
        </div>
      </Section>

      {/* --- Training ----------------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            eyebrow="Training"
            title="Competence is verified, not assumed"
            lead="Certificates are tracked to expiry and renewed before they lapse, because an expired competency is the same as no competency."
            tone="darker"
            className="max-w-3xl"
          />

          <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {safety.training.map((item) => (
              <RevealItem key={item.title} className="flex flex-col gap-3 bg-ink-950 p-7">
                <span className="eyebrow text-gold-500">{item.frequency}</span>
                <h3 className="text-base font-bold text-paper-50">{item.title}</h3>
                <p className="text-sm leading-relaxed text-steel-400">{item.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* --- PPE, environment, risk, quality -------------------------------------- */}
      <Section tone="dark">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <ControlList
            eyebrow="Personal protective equipment"
            title="Issued, recorded, replaced on condition"
            items={safety.ppe}
          />
          <ControlList
            eyebrow="Environmental"
            title="Containment before the work, not after the spill"
            items={safety.environmental}
          />
          <ControlList
            eyebrow="Risk management"
            title="Assessed before, reassessed when conditions change"
            items={safety.riskManagement}
          />
          <ControlList
            eyebrow="Quality assurance"
            title="Measured, recorded and handed over"
            items={safety.qualityAssurance}
          />
        </div>
      </Section>

      {/* --- Certifications ------------------------------------------------------- */}
      <Section tone="darker" tight>
        <div className="shell">
          {safety.certifications.length > 0 ? (
            <div className="flex flex-col gap-10">
              <SectionHeading
                eyebrow="Certification"
                title="Current accreditations and registrations"
                tone="darker"
                size="md"
              />
              <RevealGroup className="grid gap-px bg-steel-600/12 sm:grid-cols-2 lg:grid-cols-3">
                {safety.certifications.map((cert) => (
                  <RevealItem key={cert.id} className="flex flex-col gap-2 bg-ink-950 p-7">
                    <h3 className="text-base font-bold text-paper-50">{cert.name}</h3>
                    <p className="text-sm text-steel-400">{cert.issuer}</p>
                    {cert.reference && (
                      <p className="eyebrow text-steel-500">Ref {cert.reference}</p>
                    )}
                    {cert.validUntil && (
                      <p className="mt-auto pt-3 text-xs text-steel-500">
                        Valid until {cert.validUntil}
                      </p>
                    )}
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ) : (
            <Reveal>
              <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-8 brushed sm:p-10">
                <CornerMarks />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <FileWarning className="size-6 shrink-0 text-gold-500" />
                  <div>
                    <h2 className="text-display-4 text-paper-50">
                      Certificates and compliance documents on request
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel-400">
                      Company registration, tax clearance, banking confirmation, insurance
                      certificates, letters of good standing and B-BBEE documentation are held as a
                      current pack and issued directly to your procurement or SHE department. Send us
                      your vendor form and we complete yours rather than sending our own set.
                    </p>
                    <p className="mt-4 text-sm text-steel-300">
                      Request the pack from{" "}
                      <a
                        href={`mailto:${business.email}`}
                        className="text-gold-400 underline underline-offset-4 hover:text-gold-300"
                      >
                        {business.email}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      <CtaBanner
        headline="Need a safety file for your site?"
        body="Tell us the template your SHE department uses and the induction requirements, and we will complete yours before mobilisation rather than after."
        phone={business.phone}
        primaryLabel="Request a safety file"
        primaryHref="/contact"
      />
    </>
  );
}

function ControlList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <Reveal>
      <div className="chamfer flex h-full flex-col gap-5 border border-steel-600/18 bg-ink-850 p-7">
        <span className="eyebrow text-gold-500">{eyebrow}</span>
        <h3 className="text-lg leading-snug font-bold text-paper-50">{title}</h3>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-steel-300">
              <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
