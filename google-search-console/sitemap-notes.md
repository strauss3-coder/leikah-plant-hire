# Sitemap

**Live at:** <https://leikahgroup.co.za/sitemap.xml>
**Source:** `src/app/sitemap.ts`
**Current size:** 51 URLs

---

## It is generated, not maintained

The sitemap is a function of the content. It reads services, industries,
projects and news from the CMS layer at build time and emits a URL for each,
alongside the static routes listed in `src/lib/navigation.ts`.

Nobody edits an XML file. Publish a new service and it is in the sitemap on the
next deploy. This is the reason it cannot drift out of date, which is the usual
failure mode of a hand-maintained sitemap.

```ts
export const dynamic = "force-static";
```

That line is what allows a metadata route to be emitted as a real file by the
static export rather than needing a server.

## What is in it

| Group | Count | Priority | Change frequency |
|---|---|---|---|
| Static routes | see `staticRoutes` | 1.0 home, 0.9 key pages, 0.7 rest | monthly |
| Services | 14 | 0.8 | monthly |
| Industries | 8 | 0.7 | monthly |
| Projects | 6 | 0.6 | yearly |
| News | 3 | 0.5 | yearly |

Priority and change frequency are hints, and Google has said publicly that it
largely ignores both. They are set sensibly rather than uniformly because Bing
still pays some attention.

`lastModified` is real where a real date exists: projects use their completion
date, news uses its publication date. Everything else uses the build time.

## What is deliberately not in it

**The client documents.** `/overview/`, `/onboarding/` and `/checklist/` are
static HTML in `public/`. They are delivery documents for Leikah, not marketing
pages, and they carry `<meta name="robots" content="noindex, nofollow, noarchive">`.
They are not in the sitemap and should never be added to it.

**The CMS portal.** `/portal` and everything under it is disallowed in
`robots.txt` and is set aside entirely by the static build.

**The 404 page.** Carries its own `noindex`.

## The trailing slash problem, and why it is handled

The static export sets `trailingSlash: true`, so Next emits canonical tags
ending in a slash: `https://leikahgroup.co.za/about/`.

A sitemap built naively with `absoluteUrl()` would list `https://leikahgroup.co.za/about`
without one. Google would then see two spellings of the same page — one in the
sitemap, a different one declared canonical on the page — and have to guess.

`canonicalUrl()` in `src/lib/seo.tsx` exists solely to keep the two in step:

```ts
export function canonicalUrl(path = "/") {
  const url = absoluteUrl(path);
  if (process.env.STATIC_EXPORT !== "1") return url;
  return url.endsWith("/") ? url : `${url}/`;
}
```

`scripts/seo/validate.mjs` asserts this: every URL in the sitemap must be
declared as canonical by some page. If that check ever fails, this is why.

## Verifying it

```bash
npm run build:static
node scripts/seo/validate.mjs
```

Checks for duplicates, and that every sitemap URL matches a page's canonical.

Manually:

```bash
curl -s https://leikahgroup.co.za/sitemap.xml | grep -c "<loc>"
curl -s https://leikahgroup.co.za/sitemap.xml | grep "<loc>" | sort | uniq -d
```

The second command should print nothing. Anything it prints is a duplicate URL.

## Submitting it

Search Console → Sitemaps → enter `sitemap.xml` (relative, not the full URL).

It only needs submitting once. Google re-reads it on its own schedule and the
file is regenerated on every deploy.

## When to worry

- **Discovered URL count much lower than 51** — content is failing to load at
  build time. Check the build log.
- **"Couldn't fetch"** for more than a day — check the file is actually being
  served: `curl -I https://leikahgroup.co.za/sitemap.xml`
- **Indexed count far below submitted count** after a month — not a sitemap
  problem. See the coverage section of `search-console-setup.md`.
