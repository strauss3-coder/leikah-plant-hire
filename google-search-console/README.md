# Leikah Plant Hire — Search Documentation

Everything relating to search engine visibility for **leikahgroup.co.za**, kept
in one folder so it is not scattered through the codebase.

Prepared by Sirius Ascent. Written so that a developer who has never seen this
project can finish the setup without asking anyone a question.

---

## What state the site is in

The website itself is **finished and verified** for search. Every page carries a
unique title and description, a canonical URL, Open Graph and Twitter tags, a
single `h1`, structured data and alt text on every image. The sitemap and
`robots.txt` are generated from the content, not maintained by hand.

What is **not** done is everything that happens outside the codebase: nobody has
verified the domain in Google Search Console, nobody has claimed the Google
Business Profile, and there is no analytics property. Those need accounts and
access this project does not have. They are the subject of most of this folder.

| Area | State |
|---|---|
| On-page SEO | Done, audited, 100/100 on the internal audit |
| Structured data | Done, seven schema types, validates |
| Sitemap and robots | Done, generated at build time |
| Core Web Vitals | Good on mobile; one desktop page needs improvement (see `seo-audit.md`) |
| Search Console | **Not started** — needs DNS access, see `search-console-setup.md` |
| Google Business Profile | **Not started** — needs client decision, see `google-business-profile.md` |
| Analytics | **Deliberately not installed** — see `analytics-setup.md` |

---

## The files

| File | What it is for |
|---|---|
| `CHECKLIST.md` | The running list. Start here. Tick things off as they are done. |
| `search-console-setup.md` | The ten-step Search Console process, in detail. |
| `verification.md` | Domain ownership verification, DNS and HTML methods. |
| `sitemap-notes.md` | How the sitemap is generated and what is deliberately excluded. |
| `robots-notes.md` | What `robots.txt` says and why. |
| `structured-data.md` | Every schema type emitted, where it comes from, how to test it. |
| `google-business-profile.md` | Claiming and completing the profile. The highest-value item here. |
| `analytics-setup.md` | Where GA4 goes when it is switched on, and the consent obligation. |
| `seo-audit.md` | The audit: what was found, what was fixed, what remains. |
| `client-information-required.md` | What is still needed from Leikah before this is finished. |

---

## Running the audits yourself

Two scripts live in `scripts/seo/`. Both read the built site, not the source, so
what they check is what a crawler would receive.

```bash
npm run build:static     # writes out/
node scripts/seo/audit.mjs        # titles, descriptions, canonicals, headings, alt text
node scripts/seo/validate.mjs     # structured data, sitemap, robots.txt
```

`validate.mjs` exits non-zero on failure, so it can be put in CI.

A third script measures desktop LCP against the real export, which is the only
honest way to measure it — the development server optimises images and the
static export does not:

```bash
cd out && python3 -m http.server 4399 &
BASE=http://localhost:4399 node scripts/seo/vitals-desktop.mjs
```

---

## The one thing to do first

**Claim the Google Business Profile.** Verification is by posted card and takes
up to two weeks, and for a plant hire business in Middelburg it will drive more
enquiries than anything else in this folder. Everything else here can be done in
an afternoon once access exists. See `google-business-profile.md`.
