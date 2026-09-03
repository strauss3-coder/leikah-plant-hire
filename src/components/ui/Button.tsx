import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   ACTIONS

   Chamfered plates rather than pills — the same silhouette as the logo and the
   card system. The gold fill carries a slow specular sweep on hover, which is
   the one flourish allowed on a control.
   ========================================================================= */

type Variant = "primary" | "secondary" | "ghost" | "light" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-ink-950 hover:bg-gold-400 focus-visible:bg-gold-400 font-semibold",
  secondary:
    "bg-ink-800/80 text-paper-50 border border-steel-600/30 hover:border-gold-500/60 hover:bg-ink-700/80 backdrop-blur-sm",
  ghost:
    "bg-transparent text-steel-200 border border-steel-600/25 hover:text-paper-50 hover:border-gold-500/50",
  light:
    "bg-paper-50 text-ink-950 hover:bg-paper-200 font-semibold",
  danger:
    "bg-signal-red text-paper-50 hover:brightness-110 font-semibold",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.8125rem]",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden chamfer-sm " +
  "font-sans tracking-tight transition-[background-color,border-color,color,transform] duration-300 " +
  "ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

function Sweep({ variant }: { variant: Variant }) {
  if (variant !== "primary" && variant !== "light") return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/35 opacity-0 blur-md transition-opacity duration-200 group-hover/btn:animate-[leikah-sweep_0.9s_ease-out] group-hover/btn:opacity-100"
    />
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  withArrow = false,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
}) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      <Sweep variant={variant} />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {withArrow && (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        )}
      </span>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  withArrow = false,
  external = false,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  external?: boolean;
  children: ReactNode;
}) {
  const content = (
    <>
      <Sweep variant={variant} />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {withArrow && (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        )}
      </span>
    </>
  );

  const classes = cn(base, VARIANTS[variant], SIZES[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

/** Text link with a rule that draws in from the left on hover. */
export function TextLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-400 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:w-full" />
      </span>
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
    </>
  );

  const classes = cn(
    "group/link inline-flex items-center gap-2 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
