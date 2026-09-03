import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { SurveyGrid, DustField, BrandWatermark } from "@/components/graphics/Atmosphere";
import { Blueprint, type BlueprintMachine } from "@/components/graphics/Blueprint";
import { LeikahMark } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";
import type { MediaRef } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   PAGE HEADER

   The masthead every interior route opens with. Photography sits under a heavy
   scrim rather than beside the type, which keeps the headline measure the same
   on every page and stops the header competing with the first real section.
   ========================================================================= */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {trail.map((crumb, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {crumb.href && !last ? (
              <Link
                href={crumb.href}
                className="text-xs text-steel-400 transition-colors hover:text-gold-400"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-xs text-steel-300" aria-current={last ? "page" : undefined}>
                {crumb.label}
              </span>
            )}
            {!last && <ChevronRight className="size-3 text-steel-500/60" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  headline,
  lead,
  image,
  trail,
  children,
  align = "left",
  size = "default",
  blueprint,
}: {
  eyebrow?: string;
  headline: string;
  lead?: string;
  image?: MediaRef;
  trail?: Crumb[];
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "default" | "compact";
  /** Technical drawing set into the right of the masthead. */
  blueprint?: BlueprintMachine;
}) {
  return (
    <header
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden bg-ink-950",
        size === "compact"
          ? "min-h-[24rem] pt-[calc(var(--header-h)+3rem)] pb-12"
          : "min-h-[30rem] pt-[calc(var(--header-h)+4rem)] pb-16 lg:min-h-[34rem]",
      )}
    >
      {image && (
        <div className="absolute inset-0 -z-10">
          <Media
            media={image}
            alt=""
            sizes="100vw"
            priority
            quality={70}
            className="size-full"
            imageClassName="object-cover"
            ratio="auto"
          />
          <div className="absolute inset-0 bg-ink-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/45" />
        </div>
      )}
      <SurveyGrid opacity={0.65} className="-z-10" />
      <DustField density={22} className="-z-10" />
      <BrandWatermark className="-right-20 -top-16 -z-10" size="30rem" opacity={0.05} />
      {blueprint && (
        <Blueprint
          machine={blueprint}
          intensity={0.22}
          stroke="var(--color-gold-400)"
          className="absolute -right-10 bottom-0 -z-10 hidden h-auto w-[34rem] lg:block"
        />
      )}

      <div className="shell relative">
        {trail && <Breadcrumbs trail={trail} className={cn("mb-7", align === "center" && "justify-center")} />}

        <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && (
            <Reveal duration={0.5}>
              <span
                className={cn(
                  "inline-flex items-center gap-3.5",
                  align === "center" && "justify-center",
                )}
              >
                <LeikahMark className="h-8 w-8 shrink-0" />
                <span className="eyebrow inline-flex items-center gap-2.5 text-gold-400">
                  <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
                  {eyebrow}
                </span>
              </span>
            </Reveal>
          )}

          <Reveal delay={0.06}>
            <h1 className={cn("mt-5", size === "compact" ? "text-display-3" : "text-display-2")}>
              {headline}
            </h1>
          </Reveal>

          {lead && (
            <Reveal delay={0.12}>
              <p
                className={cn(
                  "mt-6 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg",
                  align === "center" && "mx-auto",
                )}
              >
                {lead}
              </p>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.18}>
              <div className="mt-8">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
