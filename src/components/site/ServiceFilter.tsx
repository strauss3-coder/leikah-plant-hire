"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ServiceCard } from "./ServiceCard";
import type { Division, Service } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   SERVICE CATALOGUE FILTER

   Filters by division. The initial division is read from the URL on the server
   and passed in, so a link like /services?division=earthmoving lands on the
   right filter without a client-side redirect.
   ========================================================================= */

const ALL = "all";

export function ServiceFilter({
  services,
  divisions,
}: {
  services: Service[];
  divisions: Division[];
}) {
  // The ?division= deep link is read on the client rather than from the page's
  // searchParams. Reading it server-side would force this route to be dynamic,
  // which the static export target cannot produce.
  //
  // Derived during render with a click override, rather than synced into state
  // by an effect — an effect would paint the unfiltered grid first and then
  // filter it a frame later.
  const params = useSearchParams();
  const requested = params.get("division");
  const fromUrl = requested && divisions.some((d) => d.key === requested) ? requested : ALL;

  const [override, setOverride] = useState<string | null>(null);
  const active = override ?? fromUrl;
  const setActive = setOverride;
  const reduced = useReducedMotion();

  const counts = useMemo(() => {
    const map: Record<string, number> = { [ALL]: services.length };
    for (const service of services) {
      map[service.division] = (map[service.division] ?? 0) + 1;
    }
    return map;
  }, [services]);

  const visible = useMemo(
    () => (active === ALL ? services : services.filter((s) => s.division === active)),
    [services, active],
  );

  const tabs = [{ key: ALL, name: "All services" }, ...divisions.map((d) => ({ key: d.key, name: d.name }))];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by division">
        {tabs.map((tab) => {
          const on = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-pressed={on}
              className={cn(
                "chamfer-sm border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                on
                  ? "border-gold-500 bg-gold-500 text-ink-950"
                  : "border-steel-600/25 text-steel-300 hover:border-gold-500/50 hover:text-paper-50",
              )}
            >
              {tab.name}
              <span className={cn("ml-2 text-xs tabular", on ? "text-ink-950/75" : "text-steel-500")}>
                {counts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((service, i) => (
            <motion.div
              key={service.id}
              layout={!reduced}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <ServiceCard service={service} index={i} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length && (
        <p className="py-16 text-center text-sm text-steel-400">
          No services are published in this division yet.
        </p>
      )}
    </div>
  );
}
