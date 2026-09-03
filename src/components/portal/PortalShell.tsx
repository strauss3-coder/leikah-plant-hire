"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { LeikahMark, LeikahWordmark } from "@/components/brand/Logo";
import { PORTAL_NAV } from "@/lib/portal/schema";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { PortalRole } from "@/lib/portal/auth";
import { cn } from "@/lib/utils";

/* ============================================================================
   PORTAL SHELL

   Fixed rail on desktop, off-canvas sheet below `lg`. Navigation is filtered by
   role on the client for presentation only — the routes guard themselves and
   the database policies are the real boundary.
   ========================================================================= */

const RANK: Record<PortalRole, number> = { viewer: 0, editor: 1, admin: 2, owner: 3 };

export interface Badges {
  quotes: number;
  messages: number;
  applications: number;
}

export function PortalShell({
  children,
  user,
  badges,
  preview,
}: {
  children: React.ReactNode;
  user: { email: string; fullName: string | null; role: PortalRole };
  badges: Badges;
  /** No database connected: everything is the seed content, read-only. */
  preview?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Closing the rail on navigation is a render-time adjustment, not an effect —
  // an effect would paint the open rail over the new screen for a frame first.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const signOut = async () => {
    setSigningOut(true);
    await getBrowserSupabase()?.auth.signOut();
    router.replace(preview ? "/portal/setup" : "/portal/login");
    router.refresh();
  };

  const visible = PORTAL_NAV.map((section) => ({
    ...section,
    entries: section.entries.filter(
      (entry) => !entry.role || RANK[user.role] >= RANK[entry.role as PortalRole],
    ),
  })).filter((section) => section.entries.length > 0);

  return (
    <div className="flex min-h-svh bg-ink-950">
      {/* --- Rail ------------------------------------------------------------ */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-steel-600/15 bg-ink-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-steel-600/15 px-5">
          <Link href="/portal" className="flex items-center gap-2.5">
            <LeikahMark className="h-7 w-7" />
            <span className="flex flex-col">
              <LeikahWordmark className="h-3 w-auto text-paper-50" />
              <span className="eyebrow mt-1 text-[0.5625rem] text-steel-500">Portal</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="text-steel-400 transition-colors hover:text-paper-50 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Portal" className="flex-1 overflow-y-auto px-3 py-5">
          {visible.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="eyebrow mb-2 px-2 text-steel-500">{section.title}</h2>
              <ul className="flex flex-col gap-0.5">
                {section.entries.map((entry) => {
                  const active =
                    pathname === entry.href ||
                    (entry.href !== "/portal" && pathname.startsWith(entry.href));
                  const count = entry.badge ? badges[entry.badge] : 0;

                  return (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-2.5 text-sm transition-colors chamfer-sm",
                          active
                            ? "bg-gold-500/12 font-medium text-gold-400"
                            : "text-steel-300 hover:bg-ink-800 hover:text-paper-50",
                        )}
                      >
                        <entry.icon
                          className={cn(
                            "size-4 shrink-0",
                            active ? "text-gold-400" : "text-steel-500 group-hover:text-steel-300",
                          )}
                        />
                        <span className="flex-1 truncate">{entry.label}</span>
                        {count > 0 && (
                          <span className="chamfer-sm inline-flex min-w-5 items-center justify-center bg-gold-500 px-1.5 py-0.5 text-[0.625rem] font-bold text-ink-950 tabular">
                            {count}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-steel-600/15 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-3 flex items-center gap-2 px-2 text-xs text-steel-400 transition-colors hover:text-gold-400"
          >
            <ExternalLink className="size-3.5" />
            View the live site
          </Link>

          <div className="flex items-center gap-3 px-2">
            <span className="chamfer-sm flex size-9 shrink-0 items-center justify-center border border-steel-600/25 font-mono text-xs font-semibold text-gold-400">
              {(user.fullName ?? user.email).slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-paper-50">
                {user.fullName ?? user.email}
              </p>
              <p className="text-xs capitalize text-steel-500">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              aria-label="Sign out"
              className="text-steel-500 transition-colors hover:text-signal-red disabled:opacity-50"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* --- Content ---------------------------------------------------------- */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-steel-600/15 bg-ink-950/92 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="text-steel-300 transition-colors hover:text-paper-50"
          >
            <Menu className="size-5" />
          </button>
          <LeikahMark className="h-6 w-6" />
          <span className="text-sm font-medium text-paper-50">Leikah Portal</span>
        </header>

        {preview && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-xs sm:px-6 lg:px-10">
            <span className="font-semibold text-gold-400">Preview mode</span>
            <span className="text-steel-300">
              No database is connected, so this is the content shipped with the site and nothing can
              be saved.
            </span>
            <Link href="/portal/setup" className="ml-auto font-medium text-gold-400 underline underline-offset-4">
              Connect Supabase
            </Link>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
