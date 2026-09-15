import Link from "next/link";
import { FileText, Cookie, Scale, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import type { LegalDocument as LegalDoc, BusinessInfo } from "@/lib/cms/types";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================================
   LEGAL DOCUMENT

   One renderer for the privacy, cookie and terms pages, so the three stay
   structurally identical and a clause added in the CMS needs no markup change.

   Two accessibility decisions worth keeping:
     • Section headings are <h2> under the page <h1> in the masthead, with no
       level skipped, and each carries a stable id so the contents list and any
       external citation can deep-link to a clause.
     • The contents list is a real <nav> with an accessible name, so a screen
       reader user can jump straight to a clause instead of reading to it.
   ========================================================================= */

const SIBLINGS = [
  { key: "privacy", href: "/privacy", label: "Privacy Policy", Icon: FileText },
  { key: "cookies", href: "/cookies", label: "Cookie Policy", Icon: Cookie },
  { key: "terms", href: "/terms", label: "Terms & Conditions", Icon: Scale },
] as const;

export function LegalDocument({
  doc,
  business,
  children,
}: {
  doc: LegalDoc;
  business: BusinessInfo;
  /** Extra content placed after the clauses, such as the cookie controls. */
  children?: React.ReactNode;
}) {
  const others = SIBLINGS.filter((s) => s.key !== doc.key);

  return (
    <>
      <PageHeader
        blueprint="engine"
        eyebrow={doc.eyebrow}
        headline={doc.headline}
        lead={doc.lead}
        trail={[{ label: "Home", href: "/" }, { label: doc.title }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          {/* --- Contents ------------------------------------------------- */}
          <nav
            aria-label={`${doc.title} contents`}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="eyebrow mb-4 text-steel-500">On this page</h2>
            <ol className="flex flex-col gap-1 border-l border-steel-600/25">
              {doc.sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-steel-400 transition-colors hover:border-gold-500 hover:text-paper-50 focus-visible:border-gold-500 focus-visible:text-paper-50"
                  >
                    <span className="font-mono text-[0.625rem] leading-6 text-steel-500 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-7 border-t border-steel-600/20 pt-5 text-xs text-steel-500">
              Last updated{" "}
              <time dateTime={doc.updated} className="text-steel-300">
                {formatDate(doc.updated)}
              </time>
            </p>
          </nav>

          {/* --- Clauses --------------------------------------------------- */}
          <div className="flex max-w-3xl flex-col gap-12">
            {doc.sections.map((section, i) => (
              <Reveal key={section.id}>
                {/* scroll-mt clears the fixed header when a contents link lands here. */}
                <section id={section.id} className="scroll-mt-28">
                  <div className="mb-4 flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="font-mono text-[0.625rem] text-gold-500 tabular"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-display-4 text-paper-50">{section.heading}</h2>
                  </div>

                  <div className="prose-industrial flex flex-col gap-4">
                    {section.body.map((paragraph, j) => (
                      <p key={j} className="text-sm leading-relaxed text-steel-300">
                        {paragraph}
                      </p>
                    ))}

                    {section.points && section.points.length > 0 && (
                      <ul className="mt-1 flex flex-col gap-3">
                        {section.points.map((point, j) => (
                          <li key={j} className="flex gap-3 text-sm leading-relaxed text-steel-300">
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 bg-gold-500"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </Reveal>
            ))}

            {children}

            {/* --- Contact ------------------------------------------------- */}
            <Reveal>
              <div className="chamfer relative border border-steel-600/18 bg-ink-900 p-7 brushed">
                <CornerMarks />
                <h2 className="text-display-4 text-paper-50">Questions about this page?</h2>
                <p className="mt-4 text-sm leading-relaxed text-steel-400">
                  Write to us and a person will answer. We would rather explain something here than
                  have you guess at it.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <a
                    href={`mailto:${business.email}`}
                    className="text-gold-400 underline underline-offset-4 transition-colors hover:text-gold-300"
                  >
                    {business.email}
                  </a>
                  <a
                    href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}
                    className="text-gold-400 underline underline-offset-4 transition-colors hover:text-gold-300 tabular"
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* --- The other two documents --------------------------------- */}
            <nav aria-label="Other legal documents" className="grid gap-4 sm:grid-cols-2">
              {others.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group chamfer-sm flex items-center gap-4 border border-steel-600/18 bg-ink-900 p-5",
                    "transition-colors hover:border-gold-500/45",
                  )}
                >
                  <Icon className="size-5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span className="text-sm font-semibold text-paper-50">{label}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-auto size-4 text-steel-500 transition-colors group-hover:text-gold-400"
                  />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Section>
    </>
  );
}
