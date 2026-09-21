import type { NextConfig } from "next";

/**
 * Two build targets from one codebase.
 *
 *  • Default — a full Next.js server: Server Actions, image optimisation,
 *    middleware, the CMS portal. This is what gets deployed for real.
 *
 *  • STATIC_EXPORT=1 — a flat set of HTML files for GitHub Pages, so the design
 *    can be reviewed on a public link before any hosting decision is made.
 *    Static hosting has no server, so enquiry forms are aliased to stubs that
 *    say so rather than failing silently, and images ship unoptimised.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

// GitHub Pages serves a project site from /<repo>, so every asset and link
// needs that prefix. Empty for the real deployment, which sits at the root.
const basePath = isStatic ? process.env.PAGES_BASE_PATH ?? "" : "";

/* ---------------------------------------------------------------------------
   CONTENT SECURITY POLICY

   Scope note, so the trade-off is deliberate rather than accidental: a strict
   nonce-based CSP needs a nonce minted per request, which means middleware on
   every route, which makes every page dynamic. This site is prerendered and
   that is most of why it is fast, so a nonce policy would cost more than it
   buys. `'unsafe-inline'` is therefore allowed for scripts, because Next's
   hydration bootstrap and the JSON-LD blocks are inline.

   Everything else is locked down, and that is where the real value is. No
   external script origin is permitted at all, so an injected <script src>
   cannot load. `connect-src` is limited to this origin plus Supabase, so an
   injected script has nowhere to send what it steals. `object-src`, `frame-src`
   and `frame-ancestors` are closed outright, and `base-uri` is pinned so a
   planted <base> tag cannot re-point every relative URL on the page.

   Supabase is added only when it is configured; an unset project must not
   widen the policy.
   -------------------------------------------------------------------------- */

const supabaseOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
})();

const connectSrc = ["'self'", supabaseOrigin, supabaseOrigin?.replace(/^https:/, "wss:")]
  .filter(Boolean)
  .join(" ");

const imgSrc = ["'self'", "data:", "blob:", supabaseOrigin].filter(Boolean).join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  // See the note above on why inline is permitted for scripts but no external
  // origin is. Nothing on this site loads a third-party script.
  "script-src 'self' 'unsafe-inline'",
  // Motion writes inline style attributes, which style-src governs.
  "style-src 'self' 'unsafe-inline'",
  // data: covers the generated LQIP placeholders; blob: covers file previews.
  `img-src ${imgSrc}`,
  // Typefaces are self-hosted by next/font, so no external font origin.
  "font-src 'self'",
  `connect-src ${connectSrc}`,
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, basePath, trailingSlash: true } : {}),

  // The route transition intercepts link clicks and hands the path to
  // router.push, which expects it WITHOUT the basePath. Anchor hrefs include
  // it, so the client needs to know what to strip; without this the static
  // build double-prefixes the path and every transition falls back to a full
  // page load. Empty on the server target, where there is no prefix.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  images: {
    /**
     * The export target has no Image Optimization API, but it does have the
     * renditions the media pipeline already wrote. A custom loader points
     * next/image at them so the export still emits a real srcset; with
     * `unoptimized` it emitted a bare src and every device downloaded the
     * largest file. See src/lib/image-loader.ts.
     */
    ...(isStatic
      ? { loader: "custom" as const, loaderFile: "./src/lib/image-loader.ts" }
      : {}),
    // Source renditions are already WebP; AVIF is offered first because it
    // typically lands 20–30% smaller again on this kind of photography.
    formats: ["image/avif", "image/webp"],
    // Matched to the breakpoints the layout actually uses, so the optimiser
    // never generates a width nothing requests.
    deviceSizes: [390, 640, 828, 1080, 1280, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [70, 75, 78, 82],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  ...(isStatic
    ? {
        turbopack: {
          resolveAlias: {
            // No server in a static export — see actions.static.ts.
            "@/lib/enquiries/actions": "./src/lib/enquiries/actions.static.ts",
          },
        },
      }
    : {}),

  trailingSlash: isStatic,
  poweredByHeader: false,

  // Headers are served by the host, so they only apply to the server target.
  ...(isStatic
    ? {}
    : {
        async headers() {
          return [
            {
              // Generated renditions are addressed by slug and width, so they can
              // be cached hard — a regenerated image always gets a new width or slug.
              source: "/media/:path*",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
              ],
            },
            {
              source: "/:path*",
              headers: [
                { key: "Content-Security-Policy", value: contentSecurityPolicy },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                // Superseded by frame-ancestors above, kept for older browsers.
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
                { key: "X-DNS-Prefetch-Control", value: "on" },
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                {
                  key: "Permissions-Policy",
                  value: [
                    "accelerometer=()",
                    "autoplay=()",
                    "camera=()",
                    "display-capture=()",
                    "encrypted-media=()",
                    "fullscreen=(self)",
                    "geolocation=()",
                    "gyroscope=()",
                    "magnetometer=()",
                    "microphone=()",
                    "payment=()",
                    "usb=()",
                    "interest-cohort=()",
                  ].join(", "),
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
