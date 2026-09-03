import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { EquipmentIcon, resolveIcon } from "@/components/graphics/EquipmentIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CornerMarks } from "@/components/graphics/Atmosphere";
import type { Service } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   SERVICE EDITORIAL

   Replaces the 3 × 2 grid of identical cards.

   The problem with an even grid is that it says every service matters equally,
   which is never true. Here the lead service gets a full photographic plate and
   the rest run as a dense list — the hierarchy a print spread would use, and
   the reason the eye knows where to start.
   ========================================================================= */

export function ServiceEditorial({
  services,
  className,
}: {
  services: Service[];
  className?: string;
}) {
  if (!services.length) return null;
  const [lead, ...rest] = services;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-5", className)}>
      {/* --- Lead: full photographic plate ---------------------------------- */}
      <Reveal className="flex">
        <Link
          href={`/services/${lead.slug}`}
          className="group/lead chamfer relative isolate flex min-h-[30rem] w-full flex-col justify-end overflow-hidden border border-steel-600/25 transition-colors duration-500 hover:border-gold-500/50"
        >
          <Media
            media={lead.image}
            alt=""
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 size-full"
            imageClassName="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/lead:scale-[1.06]"
            ratio="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/62 to-ink-950/10" />
          <CornerMarks />

          <div className="relative z-10 flex flex-col gap-5 p-8 lg:p-10">
            <span className="chamfer-sm inline-flex size-16 items-center justify-center border border-gold-500/40 bg-ink-950/60 text-gold-400 backdrop-blur-sm">
              <EquipmentIcon name={resolveIcon(lead.icon, lead.slug)} className="size-9" />
            </span>

            <h3 className="text-display-3 text-paper-50">{lead.title}</h3>
            <p className="max-w-md text-sm leading-relaxed text-steel-200 sm:text-base">
              {lead.summary}
            </p>

            <div className="mt-2 flex items-center justify-between gap-4 border-t border-steel-100/15 pt-5">
              <span className="eyebrow text-gold-500/90">{lead.availability}</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-paper-50">
                Detail
                <ArrowUpRight className="size-4 transition-transform duration-400 group-hover/lead:-translate-y-0.5 group-hover/lead:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* --- The rest: a dense register, not more cards ---------------------- */}
      <RevealGroup className="flex flex-col divide-y divide-steel-600/25 border border-steel-600/25 bg-ink-900 chamfer" stagger={0.06}>
        {rest.map((service, i) => (
          <RevealItem key={service.id} className="flex-1">
            <Link
              href={`/services/${service.slug}`}
              className="group/row relative flex h-full items-center gap-5 overflow-hidden px-6 py-5 transition-colors duration-400 hover:bg-ink-850 lg:px-8"
            >
              {/* Rail that fills from the left on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-gold-500 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-y-100"
              />

              <span className="eyebrow w-6 shrink-0 text-steel-500 tabular">
                {String(i + 2).padStart(2, "0")}
              </span>

              <EquipmentIcon
                name={resolveIcon(service.icon, service.slug)}
                className="size-11 shrink-0 text-steel-400 transition-colors duration-400 group-hover/row:text-gold-400"
              />

              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] leading-snug font-bold text-paper-50">
                  {service.title}
                </span>
                <span className="mt-1 block line-clamp-2 text-[0.8125rem] leading-relaxed text-steel-400">
                  {service.summary}
                </span>
              </span>

              <ArrowUpRight className="size-4 shrink-0 text-steel-500 transition-all duration-400 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-gold-400" />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
