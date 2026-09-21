# SEO audit

Run against the **built static export**, not the source and not the development
server. The export is byte-for-byte what GitHub Pages serves, so what the audit
sees is what Googlebot receives.

**Date:** 21 September 2026
**Scope:** 57 emitted pages — 51 indexable, 6 deliberately `noindex`

---

## Score

| | Before | After |
|---|---|---|
| **Score** | **89 / 100** | **100 / 100** |
| High severity | 5 | 0 |
| Medium severity | 13 | 0 |
| Low severity | 33 | 1 |

The score is computed by `scripts/seo/audit.mjs`: twelve points per indexable
page, less six for each high finding, two for each medium and half for each low.
It is an internal measure for comparing before and against after, not an
industry number.

---

## What was found, and what was done

### High: the 404 page carried the homepage's title and description

The static export emits the not-found page three times — `/404`, `/404/` and
`/_not-found/`. None of them defined metadata, so all three inherited the root
layout's title and its 318-character description. Four URLs shipped with
identical titles, one of them the homepage.

**Fixed.** `src/app/not-found.tsx` now exports its own metadata with
`robots: { index: false }`. A 404 has nothing to rank for.

### High: three pages had no canonical, no share image and no structured data

`/overview/`, `/onboarding/` and `/checklist/` — the client delivery documents in
`public/`.

**Not a fault.** They already carried `noindex, nofollow, noarchive`. The audit
was applying discoverability checks to pages that are deliberately undiscoverable.

**Fixed in the audit, not the site.** `scripts/seo/audit.mjs` now separates
indexable pages from excluded ones and only checks what applies. Alt text,
`lang` and viewport are still checked on every page, because those matter
whether or not a page is indexed.

### Medium: the site description was 318 characters

`business.summary` is written to be read on the About page. It was also being
used as the meta description and both share-card descriptions, where Google cuts
at about 160 and the social platforms at about 200.

**Fixed.** A purpose-written 152-character `SHARE_DESCRIPTION` in
`src/app/layout.tsx` covers the meta tag and both cards. `business.summary` is
untouched and still reads on the page.

### Low: 33 titles over 60 characters

Three causes, each fixed differently.

**Nine industry pages** carried `— Plant Hire & Maintenance` in front of a brand
suffix that already said "Plant Hire". *Fixed:* the redundant segment is gone,
`Mining & Open-Cast — Leikah Plant Hire` is 38 characters.

**Nine news and project pages** had editorial headlines written to be read, not
to fit a search result. *Fixed:* `NewsPost` gained the `seo` field every other
content type already had, and short SEO titles were written for all nine. The
headline on the page is unchanged.

**The homepage** was 75 characters and led with the brand.
*Fixed:* `Plant Hire & Earthmoving, Middelburg | Leikah Plant Hire`, 56
characters, leading with what people search for.

**Several were not over at all.** The audit was measuring raw HTML, where
`&amp;` is five characters and one on screen, so every title containing an
ampersand read four characters longer than it is. *Fixed in the audit.*

### Two page descriptions over 165 characters

`/industries/` and `/maintenance/` took their descriptions from the page lead,
which is written to be read.

**Fixed.** Both now carry an explicit `seo.description` at search length. The
visible lead is unchanged.

### The Article publisher was incomplete

News posts declared `author: { "@type": "Organization", name: "..." }` with no
`url`, which is an incomplete Organization and would be dropped from an Article
rich result.

**Fixed.** Author and publisher both resolve to the organisation node the layout
already emits, which carries the name, logo, address and telephone. `dateModified`
added.

### Structured data was missing ContactPoint and a logo

The brief called for `ContactPoint`; the graph had none, and no `logo`, which
Google reads for the knowledge panel.

**Fixed.** Three contact points — customer service, emergency and sales — plus
`logo` and `image` as absolute URLs. The emergency point declares
`hoursAvailable` across all seven days, which is what lets Google answer "open
now" against a breakdown query out of hours.

---

## The significant finding: every visitor downloaded the largest image

Not in the brief's checklist, found while measuring.

The static export set `images.unoptimized`, because the export has no Image
Optimization API behind it. The consequence was that `next/image` emitted a bare
`src` and **no `srcset` anywhere on the site**. Every visitor received the
largest rendition of every photograph regardless of their screen: a phone on a
mobile connection pulled the same file as a 4K desktop, and the `sizes`
attribute had nothing to choose between.

The renditions existed the whole time. `scripts/process-media.mjs` writes
640/1080/1600/2200 for every image. Nothing pointed at them. `buildSrcSet()` was
sitting in `src/lib/cms/media.ts`, exported, called from nowhere.

**Fixed** with a custom loader, `src/lib/image-loader.ts`, which maps a
requested width onto the nearest generated rendition. The export now emits 290
`srcset` entries.

Measured, against the real export:

| | Before | After |
|---|---|---|
| Image a 390px phone receives on `/about/` | 918 KB | **406 KB** |
| `/about/` desktop LCP | 3.94s poor | **2.79s** |
| `/services/bulk-earthworks/` desktop LCP | 3.22s poor | **2.16s good** |
| `/industries/mining/` desktop LCP | 3.56s poor | **1.93s good** |

Two supporting changes:

**A quality ladder.** Rendition quality now falls as the rendition grows — 82 at
640px down to 60 at 2200px — because a large rendition is only ever served to a
viewport that will scale it down. Checked at 1:1 against the originals before
and after: indistinguishable. The 2200px files came down about 28%.

**The page header no longer asks for 100vw.** It is a background band under a
58% scrim with the headline over it, and at `100vw` a 1920px screen pulled the
2200px rendition. Capped at 1600.

---

## What is still imperfect

**One title, one character over.** `/services/site-establishment/` renders at 61
characters. Not worth renaming a service for.

**`/about/` desktop LCP is 2.79s.** Above the 2.5s "good" threshold, inside
"needs improvement". The cause is structural rather than a mistake: the header
photograph is a portrait 12-megapixel image displayed as a wide band, so most of
the downloaded pixels are cropped away before anything is shown. Fixing it
properly means generating a separate wide crop for header use, which is a
feature rather than a tuning change. Mobile, which is where most traffic will
be, measures 1.59s.

These figures are from a lab test at 4G with the CPU throttled to a quarter
speed. Real visitors on fibre will be considerably faster. The field data in
Search Console is the number that counts, and it takes about 28 days to appear.

---

## What passes

| Check | Result |
|---|---|
| Missing metadata | None |
| Duplicate titles | None |
| Duplicate descriptions | None |
| Broken internal links | None, 56 links across 20 pages |
| Missing alt text | None, 290 images, 165 descriptive and 125 correctly decorative |
| Canonical errors | None; every sitemap URL matches a declared canonical |
| Schema errors | None; seven required types present and valid |
| Robots errors | None |
| Sitemap issues | None; 51 URLs, no duplicates |
| Accessibility affecting SEO | Zero axe issues across every route |
| Core Web Vitals | Mobile good; one desktop page needs improvement |

---

## Reproducing this

```bash
npm run build:static
node scripts/seo/audit.mjs       # metadata, headings, alt text
node scripts/seo/validate.mjs    # structured data, sitemap, robots
```

And for the honest performance number:

```bash
cd out && python3 -m http.server 4399 &
BASE=http://localhost:4399 node scripts/seo/vitals-desktop.mjs
```

`validate.mjs` exits non-zero on failure and is suitable for CI.
