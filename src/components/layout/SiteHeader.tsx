"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { LeikahLogo, LeikahMark } from "@/components/brand/Logo";
import { primaryNav, type NavItem } from "@/lib/navigation";
import { cn, telHref } from "@/lib/utils";

/* ============================================================================
   SITE HEADER

   Transparent over the hero, then condenses onto a solid plate once the page
   scrolls — so the logo sits on photography at rest but never loses contrast in
   use. Desktop gets hover-intent mega panels; mobile gets a full-screen sheet
   with accordions and the call action pinned where a thumb reaches.
   ========================================================================= */

export interface HeaderLink {
  label: string;
  href: string;
  description?: string;
}

export function SiteHeader({
  phone,
  serviceLinks,
  industryLinks,
}: {
  phone: string;
  serviceLinks: HeaderLink[];
  industryLinks: HeaderLink[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigation must close the sheet and any open panel. Done during render
  // rather than in an effect so the menu is never painted over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenPanel(null);
  }

  // Scroll lock while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenPanel(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Small close delay so the pointer can cross the gap to the panel. */
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPanel(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const panelLinks = (item: NavItem): HeaderLink[] => {
    if (item.dynamic === "services") return [...(item.children ?? []), ...serviceLinks];
    if (item.dynamic === "industries") return industryLinks;
    return item.children ?? [];
  };

  const solid = scrolled || !isHome || mobileOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          solid
            ? "border-b border-steel-600/18 bg-ink-950/88 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell-wide flex h-[var(--header-h)] items-center justify-between gap-6">
          {/* Over the homepage hero the corner shows the mark alone. The
              wordmark is already set at full size in the middle of that
              viewport, and repeating it in the corner is the same brand twice.
              Scrolling past the hero expands it to the full lockup.
              Both are always mounted and cross-faded, so the header never
              reflows as it changes. */}
          <Link
            href="/"
            aria-label="Leikah Plant Hire — home"
            className="relative flex h-10 items-center"
          >
            <LeikahLogo
              className={cn(
                "hidden h-9 w-auto text-paper-50 transition-opacity duration-500 sm:block lg:h-10",
                isHome && !scrolled && "opacity-0",
              )}
            />
            <LeikahMark
              className={cn(
                "h-9 w-9 transition-opacity duration-500 sm:absolute sm:left-0",
                isHome && !scrolled ? "sm:opacity-100" : "sm:opacity-0",
              )}
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const links = panelLinks(item);
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href)) ||
                links.some((l) => pathname === l.href.split("?")[0]);

              if (!links.length) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-gold-400" : "text-steel-200 hover:text-paper-50",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenPanel(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={openPanel === item.label}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenPanel((cur) => (cur === item.label ? null : item.label))
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors",
                      active || openPanel === item.label
                        ? "text-gold-400"
                        : "text-steel-200 hover:text-paper-50",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        openPanel === item.label && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {openPanel === item.label && (
                      <motion.div
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full w-[min(46rem,88vw)] -translate-x-1/2 pt-3"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <div className="chamfer border border-steel-600/22 bg-ink-900/97 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                          <div className="grid gap-0.5 sm:grid-cols-2">
                            {links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="group/panel flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-ink-800/80"
                              >
                                <span className="flex items-center gap-2 text-sm font-semibold text-paper-50">
                                  <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover/panel:w-3" />
                                  {link.label}
                                </span>
                                {link.description && (
                                  <span className="text-xs leading-snug text-steel-400">
                                    {link.description}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2.5 border border-steel-600/25 px-3.5 py-2 text-sm text-steel-200 transition-colors hover:border-gold-500/50 hover:text-paper-50 xl:flex chamfer-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-signal-green opacity-70 motion-safe:animate-[leikah-pulse-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-signal-green" />
              </span>
              <span className="tabular">{phone}</span>
            </a>

            <Link
              href="/quote"
              className={cn(
                "chamfer-sm hidden h-11 items-center px-5 text-sm transition-all duration-500 sm:inline-flex",
                isHome && !scrolled
                  ? "border border-steel-100/30 font-medium text-paper-50 hover:border-gold-500/70 hover:text-gold-400"
                  : "bg-gold-500 font-semibold text-ink-950 hover:bg-gold-400",
              )}
            >
              Request a quote
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="chamfer-sm inline-flex size-11 items-center justify-center border border-steel-600/25 text-paper-50 transition-colors hover:border-gold-500/50 lg:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Scroll-progress hairline — the only always-on motion in the header. */}
        <ScrollRule active={solid} />
      </header>

      <MobileSheet
        open={mobileOpen}
        phone={phone}
        panelLinks={panelLinks}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

function ScrollRule({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 bottom-0 h-px origin-left bg-gold-500 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-0",
      )}
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

function MobileSheet({
  open,
  phone,
  panelLinks,
  onClose,
}: {
  open: boolean;
  phone: string;
  panelLinks: (item: NavItem) => HeaderLink[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex flex-col bg-ink-950/98 pt-[var(--header-h)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-[var(--spacing-gutter)] py-6">
            <ul className="flex flex-col">
              {primaryNav.map((item, i) => {
                const links = panelLinks(item);
                const isOpen = expanded === item.label;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-steel-600/15"
                  >
                    {links.length ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.label)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between py-4 text-left font-display text-2xl font-bold text-paper-50"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "size-5 text-gold-400 transition-transform duration-300",
                              isOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              {links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="block border-l border-gold-500/30 py-2.5 pl-4 text-[0.9375rem] text-steel-300 transition-colors hover:text-gold-400"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                              <li className="h-3" />
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-4 font-display text-2xl font-bold text-paper-50"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-2 border-t border-steel-600/18 bg-ink-900/70 p-[var(--spacing-gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <a
              href={telHref(phone)}
              className="chamfer-sm inline-flex h-13 items-center justify-center gap-2 border border-steel-600/30 py-3.5 text-sm font-medium text-paper-50"
            >
              <Phone className="size-4 text-gold-400" />
              Call 24/7
            </a>
            <Link
              href="/quote"
              onClick={onClose}
              className="chamfer-sm inline-flex h-13 items-center justify-center bg-gold-500 py-3.5 text-sm font-semibold text-ink-950"
            >
              Request a quote
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
