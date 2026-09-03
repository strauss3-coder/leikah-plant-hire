import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/* ============================================================================
   SECTION FURNITURE

   Eyebrow, heading and lead in one place, so every section on the site shares a
   measure, a rhythm and an entrance. Sections declare a tone — the site
   alternates dark and light bands, and the tone token drives every colour
   inside the block rather than each component guessing.
   ========================================================================= */

export type Tone = "dark" | "darker" | "light" | "muted";

export const TONE_CLASS: Record<Tone, string> = {
  dark: "bg-ink-900 text-steel-200",
  darker: "bg-ink-950 text-steel-200",
  light: "bg-paper-100 text-ink-700",
  muted: "bg-paper-200 text-ink-700",
};

const HEADING_CLASS: Record<Tone, string> = {
  dark: "text-paper-50",
  darker: "text-paper-50",
  light: "text-ink-950",
  muted: "text-ink-950",
};

const LEAD_CLASS: Record<Tone, string> = {
  dark: "text-steel-300",
  darker: "text-steel-300",
  light: "text-ink-500",
  muted: "text-ink-500",
};

const EYEBROW_CLASS: Record<Tone, string> = {
  dark: "text-gold-400",
  darker: "text-gold-400",
  light: "text-gold-700",
  muted: "text-gold-700",
};

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2.5", EYEBROW_CLASS[tone], className)}>
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  size = "lg",
  className,
  children,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
  className?: string;
  children?: ReactNode;
  id?: string;
}) {
  const sizeClass = {
    md: "text-display-4",
    lg: "text-display-3",
    xl: "text-display-2",
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="up" duration={0.5}>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal direction="up" delay={0.06}>
        <h2 id={id} className={cn(sizeClass, HEADING_CLASS[tone], "max-w-[22ch]", align === "center" && "mx-auto")}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal direction="up" delay={0.12}>
          <div className={cn("max-w-[60ch] text-base leading-relaxed sm:text-lg", LEAD_CLASS[tone], align === "center" && "mx-auto")}>
            {lead}
          </div>
        </Reveal>
      )}
      {children}
    </div>
  );
}

export function Section({
  children,
  tone = "dark",
  className,
  id,
  tight = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative", tight ? "section-tight" : "section", TONE_CLASS[tone], className)}
    >
      {children}
    </section>
  );
}

/**
 * The gold word inside a headline. Takes a full string and the fragment to
 * highlight so the copy stays one editable field in the CMS rather than three.
 */
export function Highlighted({
  text,
  highlight,
  className,
}: {
  text: string;
  highlight?: string;
  className?: string;
}) {
  if (!highlight || !text.includes(highlight)) return <span className={className}>{text}</span>;
  const [before, ...rest] = text.split(highlight);
  const after = rest.join(highlight);
  return (
    <span className={className}>
      {before}
      <span className="text-gold-gradient">{highlight}</span>
      {after}
    </span>
  );
}

/** Splits a seeded paragraph field on blank lines. */
export function Paragraphs({
  text,
  className,
  paragraphClassName,
}: {
  text: string;
  className?: string;
  paragraphClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i} className={cn("leading-relaxed", paragraphClassName)}>
          {para}
        </p>
      ))}
    </div>
  );
}
