import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Industry } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   INDUSTRY TILES

   Replaces the eight-cell text grid, which read as a spreadsheet: number,
   title, paragraph, arrow, eight times, with nothing to look at.

   Each sector now carries its own photograph, desaturated at rest and coming
   to colour on hover — so the grid has texture and the sectors are visually
   distinguishable at a glance rather than only by reading them.

   The first two tiles are double width. An 8-up grid of equal cells has no
   entry point; giving the two heaviest sectors more room creates one.
   ========================================================================= */

export function IndustryTiles({
  industries,
  className,
}: {
  industries: Industry[];
  className?: string;
}) {
  if (!industries.length) return null;

  return (
    <RevealGroup
      className={cn("grid gap-px bg-steel-600/25 sm:grid-cols-2 lg:grid-cols-4", className)}
      stagger={0.05}
    >
      {industries.map((industry, i) => {
        const wide = i < 2;
        return (
          <RevealItem key={industry.id} className={cn(wide && "lg:col-span-2")}>
            <Link
              href={`/industries/${industry.slug}`}
              className={cn(
                "group relative isolate flex h-full flex-col justify-end overflow-hidden bg-ink-950",
                wide ? "min-h-[19rem]" : "min-h-[16rem]",
              )}
            >
              <Media
                media={industry.image}
                alt=""
                sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="absolute inset-0 size-full"
                imageClassName="object-cover grayscale-[0.85] brightness-[0.55] transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105"
                ratio="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/15" />

              {/* Sector index, top-left, like a plan reference */}
              <span className="eyebrow absolute left-6 top-5 z-10 text-gold-500 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative z-10 flex flex-col gap-2.5 p-6">
                <h3
                  className={cn(
                    "leading-tight text-paper-50",
                    wide ? "text-display-4" : "text-lg font-bold",
                  )}
                >
                  {industry.name}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-steel-300",
                    wide ? "max-w-md" : "line-clamp-3",
                  )}
                >
                  {industry.summary}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-gold-400">
                  <span className="relative">
                    Sector detail
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                  </span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
