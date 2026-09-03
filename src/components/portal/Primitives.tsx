import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   PORTAL PRIMITIVES

   The portal shares the site's palette but not its theatricality — no reveal
   animations, no parallax. An admin screen should feel immediate.
   ========================================================================= */

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[92rem] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>;
}

export function PageTitle({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-steel-600/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link href={crumb.href} className="text-steel-400 transition-colors hover:text-gold-400">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-steel-300">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-steel-500/50">/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-paper-50 sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-steel-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("chamfer border border-steel-600/15 bg-ink-900", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-steel-600/15 px-6 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-paper-50">{title}</h2>}
            {description && <p className="mt-1 text-xs text-steel-500">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

const TONES = {
  neutral: "border-steel-600/30 text-steel-300",
  gold: "border-gold-500/45 text-gold-400",
  green: "border-signal-green/40 text-signal-green",
  red: "border-signal-red/45 text-signal-red",
  blue: "border-signal-blue/40 text-signal-blue",
} as const;

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "chamfer-sm inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: string }) {
  const tone =
    status === "published" || status === "won"
      ? "green"
      : status === "draft" || status === "new"
        ? "gold"
        : status === "lost"
          ? "red"
          : "neutral";
  return <Chip tone={tone}>{status}</Chip>;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      {icon && <span className="text-steel-500">{icon}</span>}
      <h2 className="text-lg font-semibold text-paper-50">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-steel-400">{description}</p>
      {action}
    </div>
  );
}

export function PortalButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button className={cn(buttonClass(variant, size), className)} {...props}>
      {children}
    </button>
  );
}

export function PortalLink({
  children,
  href,
  variant = "secondary",
  size = "md",
  className,
  target,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  target?: string;
}) {
  return (
    <Link href={href} target={target} className={cn(buttonClass(variant, size), className)}>
      {children}
    </Link>
  );
}

function buttonClass(variant: string, size: string) {
  return cn(
    "chamfer-sm inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-5 text-sm",
    variant === "primary" && "bg-gold-500 font-semibold text-ink-950 hover:bg-gold-400",
    variant === "secondary" &&
      "border border-steel-600/25 text-steel-200 hover:border-gold-500/50 hover:text-paper-50",
    variant === "ghost" && "text-steel-300 hover:bg-ink-800 hover:text-paper-50",
    variant === "danger" && "border border-signal-red/45 text-signal-red hover:bg-signal-red/10",
  );
}
