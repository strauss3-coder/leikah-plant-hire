import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import {
  SurveyGrid,
  GoldBloom,
  CornerMarks,
  DustField,
  BrandWatermark,
  SteelSheen,
} from "@/components/graphics/Atmosphere";
import { Blueprint } from "@/components/graphics/Blueprint";
import { Reveal } from "@/components/ui/Reveal";
import { telHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ============================================================================
   CALL TO ACTION BAND

   The closing move on almost every page. Two actions only — send a request, or
   pick up the phone — because a band that offers six things converts on none.
   ========================================================================= */

export function CtaBanner({
  headline,
  body,
  phone,
  primaryLabel = "Request a quotation",
  primaryHref = "/quote",
  className,
}: {
  headline: string;
  body: string;
  phone: string;
  primaryLabel?: string;
  primaryHref?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-ink-900", className)}>
      <SurveyGrid opacity={0.75} />
      <GoldBloom className="-left-32 -top-40" size="46rem" />
      <DustField density={40} />
      <SteelSheen />
      <BrandWatermark className="-right-28 -bottom-20" size="34rem" opacity={0.05} />
      <Blueprint
        machine="hauler"
        intensity={0.16}
        stroke="var(--color-gold-400)"
        className="absolute -left-24 bottom-0 hidden h-auto w-[36rem] xl:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/45 to-transparent"
      />

      <div className="shell section relative">
        <div className="relative mx-auto max-w-4xl px-4 py-2 text-center sm:px-10">
          <CornerMarks />

          <Reveal>
            <h2 className="text-display-2 text-paper-50">{headline}</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg">
              {body}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="chamfer-sm group/btn relative inline-flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden bg-gold-500 px-8 font-semibold text-ink-950 transition-colors hover:bg-gold-400 sm:w-auto"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/35 opacity-0 blur-md group-hover/btn:animate-[leikah-sweep_0.9s_ease-out] group-hover/btn:opacity-100"
                />
                <span className="relative">{primaryLabel}</span>
                <ArrowRight className="relative size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              <a
                href={telHref(phone)}
                className="chamfer-sm inline-flex h-14 w-full items-center justify-center gap-3 border border-steel-600/30 px-7 font-medium text-paper-50 transition-colors hover:border-gold-500/60 sm:w-auto"
              >
                <Phone className="size-4 text-gold-400" />
                <span className="tabular">{phone}</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 text-xs text-steel-500">
              Breakdowns are answered 24 hours a day, every day of the year.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
