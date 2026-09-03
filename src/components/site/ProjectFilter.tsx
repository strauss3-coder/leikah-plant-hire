"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "./ProjectCard";
import type { Industry, Project } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   PROJECT FILTER

   Two independent axes — sector and status — because "show me everything you
   have done in mining" and "show me what you are running right now" are
   different questions and buyers ask both.
   ========================================================================= */

const ALL = "all";

const STATUS_TABS = [
  { key: ALL, label: "All" },
  { key: "complete", label: "Complete" },
  { key: "ongoing", label: "Ongoing" },
] as const;

export function ProjectFilter({
  projects,
  industries,
}: {
  projects: Project[];
  industries: Industry[];
}) {
  const [sector, setSector] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const reduced = useReducedMotion();

  const usedSectors = useMemo(() => {
    const slugs = new Set(projects.map((p) => p.industrySlug));
    return industries.filter((i) => slugs.has(i.slug));
  }, [projects, industries]);

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (sector === ALL || p.industrySlug === sector) &&
          (status === ALL || p.status === status),
      ),
    [projects, sector, status],
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-steel-600/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by sector">
          <span className="eyebrow mr-1 text-steel-500">Sector</span>
          <FilterChip active={sector === ALL} onClick={() => setSector(ALL)}>
            All
          </FilterChip>
          {usedSectors.map((industry) => (
            <FilterChip
              key={industry.slug}
              active={sector === industry.slug}
              onClick={() => setSector(industry.slug)}
            >
              {industry.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
          <span className="eyebrow mr-1 text-steel-500">Status</span>
          {STATUS_TABS.map((tab) => (
            <FilterChip
              key={tab.key}
              active={status === tab.key}
              onClick={() => setStatus(tab.key)}
            >
              {tab.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.div
              key={project.id}
              layout={!reduced}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <ProjectCard project={project} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length && (
        <p className="py-16 text-center text-sm text-steel-400">
          No projects match that combination. Clear a filter to see the rest.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "chamfer-sm border px-3.5 py-2 text-sm font-medium transition-all duration-300",
        active
          ? "border-gold-500 bg-gold-500 text-ink-950"
          : "border-steel-600/25 text-steel-300 hover:border-gold-500/50 hover:text-paper-50",
      )}
    >
      {children}
    </button>
  );
}
