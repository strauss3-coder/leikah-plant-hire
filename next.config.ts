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

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, basePath, trailingSlash: true } : {}),

  images: {
    // The export target has no Image Optimization API behind it.
    unoptimized: isStatic,
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
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
