import { Counter } from "@/components/ui/Counter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TerrainContours, SteelSheen, BrandWatermark } from "@/components/graphics/Atmosphere";
import type { Stat } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   STATS BAND

   Rebuilt as a survey readout rather than four boxes.

   The figures now sit on a datum rule with tick marks and reference numbers,
   the mark is embossed behind them, and contour lines run underneath — so the
   band reads as an instrument panel rather than a row of statistics that could
   belong to any company.

   The provenance note under each figure stays. This audience reads procurement
   documents; a number without a source is worth nothing to them.
   ========================================================================= */

export function StatsBand({ stats, className }: { stats: Stat[]; className?: string }) {
  if (!stats.length) return null;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-y border-steel-600/25 bg-ink-900",
        className,
      )}
    >
      <TerrainContours intensity={0.9} />
      <BrandWatermark className="-right-24 top-1/2 -translate-y-1/2" size="34rem" opacity={0.04} />
      <SteelSheen />

      <div className="shell relative">
        {/* Datum rule with survey ticks */}
        <div className="relative h-8" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 h-px bg-steel-600/40" />
          <span className="absolute inset-x-0 top-1/2 flex justify-between">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className={cn("w-px bg-steel-600/50", i % 7 === 0 ? "h-2.5" : "h-1.5")}
              />
            ))}
          </span>
        </div>

        <RevealGroup className="grid gap-px bg-steel-600/22 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <RevealItem key={stat.id} className="relative bg-ink-900 px-2 py-9 sm:px-7 lg:py-12">
              {/* Reference number, the way a drawing labels a dimension */}
              <span className="eyebrow absolute right-4 top-4 text-[0.5625rem] text-steel-600 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col gap-2.5">
                <span className="font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.9] font-black tracking-tight text-gold-gradient">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </span>
                <span className="text-sm font-semibold tracking-tight text-paper-50">
                  {stat.label}
                </span>
                {stat.note && (
                  <span className="max-w-[32ch] text-xs leading-relaxed text-steel-500">
                    {stat.note}
                  </span>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="h-8" aria-hidden="true">
          <span className="block h-px w-full bg-steel-600/40" />
        </div>
      </div>
    </section>
  );
}
