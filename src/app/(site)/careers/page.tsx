import type { Metadata } from "next";
import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { Media } from "@/components/ui/Media";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import { getBusiness, getCareers, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("careers");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/careers",
    image: page.image,
    seo: page.seo,
  });
}

const WHAT_WE_LOOK_FOR = [
  {
    title: "You stop the job when a control is missing",
    body: "Every person on a Leikah crew has that authority and is expected to use it. Nobody is ever penalised for it.",
  },
  {
    title: "You write down what you did",
    body: "Job cards, torque figures, fault reports. If it is not recorded, it did not happen — and the next person pays for that.",
  },
  {
    title: "You measure before you decide",
    body: "Gauge it, then act. Guessing costs the client money and costs us the contract.",
  },
  {
    title: "You are straight about problems",
    body: "A problem raised early is a schedule change. The same problem raised late is a breach. We would always rather hear it early.",
  },
];

export default async function CareersPage() {
  const [page, vacancies, business] = await Promise.all([
    getPageMeta("careers"),
    getCareers(),
    getBusiness(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />

      <PageHeader
        blueprint="engine"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      {/* --- What we look for --------------------------------------------------- */}
      <Section tone="darker">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="What we look for"
              title="Four things that matter more than years on a CV"
              tone="darker"
            />
            <RevealGroup className="flex flex-col divide-y divide-steel-600/15 border-y border-steel-600/15">
              {WHAT_WE_LOOK_FOR.map((item, i) => (
                <RevealItem key={item.title} className="flex gap-5 py-5">
                  <span className="eyebrow shrink-0 pt-1 text-gold-500/70 tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-paper-50">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{item.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal direction="left">
            <div className="chamfer overflow-hidden border border-steel-600/18">
              <Media
                media="fabrication-team-bowser"
                sizes="(min-width: 1024px) 50vw, 100vw"
                ratio="4 / 3"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Vacancies ----------------------------------------------------------- */}
      <Section tone="dark">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            eyebrow="Open positions"
            title={vacancies.length ? "Currently hiring" : "No advertised vacancies right now"}
            lead={
              vacancies.length
                ? "Apply directly below and reference the role you are after."
                : "We hire as contracts come in rather than to a published headcount plan, so roles open at short notice. A speculative application is genuinely worth sending — it is where we look first."
            }
            className="max-w-3xl"
          />

          {vacancies.length > 0 ? (
            <RevealGroup className="flex flex-col gap-4">
              {vacancies.map((role) => (
                <RevealItem key={role.id}>
                  <article className="chamfer border border-steel-600/18 bg-ink-900 p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-display-4 text-paper-50">{role.title}</h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-steel-400">
                          <span className="inline-flex items-center gap-1.5">
                            <BriefcaseBusiness className="size-3.5 text-gold-500" />
                            {role.department}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-gold-500" />
                            {role.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5 capitalize">
                            <Clock className="size-3.5 text-gold-500" />
                            {role.type}
                          </span>
                          {role.closingDate && (
                            <span className="text-steel-500">
                              Closes {formatDate(role.closingDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 max-w-3xl text-sm leading-relaxed text-steel-300">
                      {role.summary}
                    </p>

                    <Accordion
                      className="mt-6"
                      items={[
                        {
                          id: `${role.id}-resp`,
                          question: "Responsibilities",
                          answer: role.responsibilities.map((r) => `• ${r}`).join("\n\n"),
                        },
                        {
                          id: `${role.id}-req`,
                          question: "Requirements",
                          answer: role.requirements.map((r) => `• ${r}`).join("\n\n"),
                        },
                        ...(role.advantageous.length
                          ? [
                              {
                                id: `${role.id}-adv`,
                                question: "Advantageous",
                                answer: role.advantageous.map((r) => `• ${r}`).join("\n\n"),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal>
              <div className="chamfer relative border border-steel-600/18 bg-ink-850 p-8 brushed sm:p-10">
                <CornerMarks />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <BriefcaseBusiness className="size-6 shrink-0 text-gold-500" />
                  <div>
                    <h3 className="text-lg font-bold text-paper-50">
                      Send a speculative application anyway
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel-400">
                      Operators, diesel mechanics, fitters, boilermakers, auto-electricians and
                      field service technicians — we keep every application on file and go through
                      them first when a contract starts. Include your competencies and machine
                      experience and it will be read.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {/* --- Application ---------------------------------------------------------- */}
      <Section tone="darker" id="apply">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Apply"
            title="Send it through"
            lead={`Every application is read and kept on file. If you would rather email it, send it to ${business.email}.`}
            tone="darker"
          />
          <ApplicationForm />
        </div>
      </Section>
    </>
  );
}
