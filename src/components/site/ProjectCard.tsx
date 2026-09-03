import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Media } from "@/components/ui/Media";
import type { Project } from "@/lib/cms/types";
import { cn, formatMonth } from "@/lib/utils";

/* ============================================================================
   PROJECT CARD

   The status chip is load-bearing: an ongoing contract and a completed one are
   different claims, and conflating them is the kind of thing a procurement
   reviewer notices.
   ========================================================================= */

const STATUS: Record<Project["status"], { label: string; className: string }> = {
  complete: { label: "Complete", className: "text-signal-green border-signal-green/35" },
  ongoing: { label: "Ongoing", className: "text-gold-400 border-gold-500/40" },
  scheduled: { label: "Scheduled", className: "text-signal-blue border-signal-blue/40" },
};

export function ProjectCard({
  project,
  className,
  variant = "standard",
}: {
  project: Project;
  className?: string;
  variant?: "standard" | "wide";
}) {
  const status = STATUS[project.status];
  const dateLabel = project.completionDate
    ? formatMonth(project.completionDate)
    : `From ${formatMonth(project.startDate)}`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group/proj chamfer relative isolate flex flex-col overflow-hidden border border-steel-600/18 bg-ink-850 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold-500/45",
        variant === "wide" && "lg:flex-row",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", variant === "wide" ? "lg:w-1/2" : "")}>
        <Media
          media={project.heroImage}
          alt=""
          sizes={variant === "wide" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          ratio="16 / 10"
          className="w-full"
          imageClassName="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/proj:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
        <span
          className={cn(
            "chamfer-sm absolute left-4 top-4 border bg-ink-950/80 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide uppercase backdrop-blur",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-4 p-6 lg:p-7",
          variant === "wide" && "lg:justify-center",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-steel-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {project.location}
          </span>
          <span aria-hidden="true" className="size-1 rotate-45 bg-steel-600/50" />
          <span className="tabular">{dateLabel}</span>
        </div>

        <h3
          className={cn(
            "leading-snug text-paper-50",
            variant === "wide" ? "text-display-4" : "text-lg font-bold",
          )}
        >
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed text-steel-400">{project.summary}</p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-steel-600/15 pt-4">
          {/* `client` already holds whatever is permitted in public — a name
              when clientNamed is set in the portal, the sector otherwise. */}
          <span className="text-xs font-medium text-steel-300">{project.client}</span>
          <ArrowUpRight className="size-4 shrink-0 text-steel-500 transition-all duration-400 group-hover/proj:-translate-y-0.5 group-hover/proj:translate-x-0.5 group-hover/proj:text-gold-400" />
        </div>
      </div>
    </Link>
  );
}
