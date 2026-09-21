import type { Metadata } from "next";
import Link from "next/link";
import { LeikahMark } from "@/components/brand/Logo";
import { SurveyGrid, GoldBloom } from "@/components/graphics/Atmosphere";

/**
 * Without this the 404 inherited the root layout's title and description, so
 * the static export shipped three files (/404, /404/, /_not-found/) carrying
 * the home page's exact title and its 318-character description. That reads to
 * a crawler as four pages competing for the same terms.
 *
 * `noindex` is the substantive part: a 404 has nothing to rank for, and Google
 * treats a soft 404 that returns 200 as a quality problem. GitHub Pages serves
 * 404.html with a real 404 status, and this makes the intent explicit either
 * way.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not on this site. Everything the site holds is reachable from the homepage, the services index or the contact page.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center">
      <SurveyGrid opacity={0.5} />
      <GoldBloom className="left-1/2 top-1/4 -translate-x-1/2" size="44rem" />

      <div className="relative flex flex-col items-center gap-7">
        <LeikahMark className="h-14 w-14" />

        <p className="eyebrow text-gold-500">Error 404</p>

        <h1 className="max-w-2xl text-display-2 text-paper-50">
          That page is not on this site
        </h1>

        <p className="max-w-md text-base leading-relaxed text-steel-400">
          The link may be out of date, or the page may have moved. Everything the site holds is
          reachable from the pages below.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="chamfer-sm inline-flex h-13 items-center justify-center bg-gold-500 px-7 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
          >
            Back to the homepage
          </Link>
          <Link
            href="/contact"
            className="chamfer-sm inline-flex h-13 items-center justify-center border border-steel-600/25 px-7 font-medium text-steel-200 transition-colors hover:border-gold-500/50"
          >
            Contact us
          </Link>
        </div>

        <nav aria-label="Popular pages" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            ["Services", "/services"],
            ["Projects", "/projects"],
            ["Maintenance", "/maintenance"],
            ["Emergency", "/emergency"],
            ["Request a quote", "/quote"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-steel-400 transition-colors hover:text-gold-400"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
