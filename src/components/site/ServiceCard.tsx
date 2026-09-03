import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { EquipmentIcon, resolveIcon } from "@/components/graphics/EquipmentIcon";
import type { Service } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   SERVICE CARD

   Three treatments off one data shape:

   • `feature` — photographic, for the top of a grid
   • `standard` — a chamfered plate with an icon and the availability readout
   • `compact`  — a dense row, used in related-service rails and sector pages

   The hover state is a single coordinated move — rule extends, icon shifts to
   gold, plate lifts — rather than four unrelated transitions firing at once.
   ========================================================================= */

export function ServiceCard({
  service,
  variant = "standard",
  className,
  index,
}: {
  service: Service;
  variant?: "feature" | "standard" | "compact";
  className?: string;
  index?: number;
}) {
  const href = `/services/${service.slug}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group/card chamfer-sm flex items-center gap-4 border border-steel-600/18 bg-ink-850 px-5 py-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold-500/45 hover:bg-ink-800",
          className,
        )}
      >
        <EquipmentIcon
          name={resolveIcon(service.icon, service.slug)}
          className="size-10 shrink-0 text-steel-400 transition-colors duration-400 group-hover/card:text-gold-400"
        />
        <span className="flex-1">
          <span className="block text-sm font-semibold text-paper-50">{service.title}</span>
          <span className="mt-0.5 block line-clamp-1 text-xs text-steel-400">{service.summary}</span>
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-steel-500 transition-all duration-400 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-gold-400" />
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={href}
        className={cn(
          "group/card chamfer relative flex min-h-[26rem] flex-col justify-end overflow-hidden border border-steel-600/18 transition-colors duration-500 hover:border-gold-500/40",
          className,
        )}
      >
        <div className="absolute inset-0">
          <Media
            media={service.image}
            alt=""
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="size-full"
            imageClassName="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105"
            ratio="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/15" />
        </div>

        <div className="relative flex flex-col gap-4 p-7 lg:p-9">
          <div className="flex items-center gap-4">
            <span className="chamfer-sm inline-flex size-14 items-center justify-center border border-gold-500/35 bg-ink-950/70 text-gold-400 backdrop-blur">
              <EquipmentIcon name={resolveIcon(service.icon, service.slug)} className="size-8" />
            </span>
            {typeof index === "number" && (
              <span className="eyebrow text-steel-500 tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>

          <h3 className="text-display-4 text-paper-50">{service.title}</h3>
          <p className="max-w-md text-sm leading-relaxed text-steel-300">{service.summary}</p>

          <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-gold-400">
            <span className="relative">
              View the detail
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:w-full" />
            </span>
            <ArrowUpRight className="size-4 transition-transform duration-400 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group/card chamfer relative flex flex-col gap-5 overflow-hidden border border-steel-600/18 bg-ink-850 p-7 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold-500/45 hover:bg-ink-800",
        className,
      )}
    >
      {/* Gold wash that fills from the bottom edge on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-gold-500/8 to-transparent transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:h-full"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="chamfer-sm inline-flex size-14 items-center justify-center border border-steel-600/25 bg-ink-900 text-steel-300 transition-colors duration-500 group-hover/card:border-gold-500/45 group-hover/card:text-gold-400">
          <EquipmentIcon name={resolveIcon(service.icon, service.slug)} className="size-9" />
        </span>
        {typeof index === "number" && (
          <span className="eyebrow text-steel-500 tabular">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-3">
        <h3 className="text-lg leading-snug font-bold text-paper-50">{service.title}</h3>
        <p className="text-sm leading-relaxed text-steel-400">{service.summary}</p>
      </div>

      <div className="relative flex items-center justify-between gap-4 border-t border-steel-600/15 pt-4">
        <span className="eyebrow text-steel-500">{service.availability}</span>
        <ArrowUpRight className="size-4 shrink-0 text-steel-500 transition-all duration-400 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-gold-400" />
      </div>
    </Link>
  );
}
