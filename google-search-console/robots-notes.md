# robots.txt

**Live at:** <https://leikahgroup.co.za/robots.txt>
**Source:** `src/app/robots.ts`

---

## What it currently says

```
User-Agent: *
Allow: /
Disallow: /portal
Disallow: /portal/
Disallow: /api/

Host: https://leikahgroup.co.za
Sitemap: https://leikahgroup.co.za/sitemap.xml
```

## Line by line

**`User-Agent: *`** — applies to every crawler. No crawler is singled out, and
none needs to be.

**`Allow: /`** — the whole site is open. This is a marketing website; every
public page should be indexed.

**`Disallow: /portal`, `/portal/`, `/api/`** — the CMS portal is behind
authentication and has nothing to index. The API routes return JSON. Both
spellings of the portal path are listed because a crawler matches the prefix
literally, and `/portal` alone would not match a request for `/portal/` on
every crawler.

**`Sitemap:`** — absolute URL, which the specification requires. A relative
path here is a common mistake and is silently ignored.

**`Host:`** — a non-standard directive that Yandex reads and others ignore.
Harmless.

## What is deliberately not disallowed

**The client documents.** `/overview/`, `/onboarding/` and `/checklist/` are
Leikah's delivery documents. They should not appear in search results, but they
are **not** blocked here, and that is intentional.

A `Disallow` stops a crawler fetching a page. It does **not** stop the URL being
indexed: Google can still list a URL it has never fetched, if it finds a link to
it, and it will show it with no description because it was not allowed to look.

A `noindex` meta tag is the stronger instruction, and Google has to be allowed
to fetch the page to see it. So those three pages are crawlable and carry:

```html
<meta name="robots" content="noindex, nofollow, noarchive">
```

Blocking them in `robots.txt` as well would prevent Google reading the very
instruction that keeps them out. **Do not add them to the disallow list.**

## Changing it

Edit `src/app/robots.ts`. It is a Next metadata route returning a typed object:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/portal", "/portal/", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
```

Never add `Disallow: /`. It would remove the entire site from every search
engine, and it takes weeks to recover.

## Verifying

```bash
curl -s https://leikahgroup.co.za/robots.txt
```

`node scripts/seo/validate.mjs` also asserts that the sitemap line is absolute,
that a wildcard rule exists, and that the site is not disallowed wholesale.

Search Console has a robots.txt report under **Settings → robots.txt** showing
what Google last fetched and when.

## AI crawlers

Nothing is blocked. ChatGPT's `GPTBot`, Anthropic's `ClaudeBot`, Perplexity and
Google's `Google-Extended` can all read the site.

That is the right default for this business. Being quotable by an assistant
answering "who does plant hire in Middelburg" is worth more than withholding the
content. If Leikah ever wants to opt out, the block goes here:

```ts
{ userAgent: "GPTBot", disallow: "/" },
{ userAgent: "Google-Extended", disallow: "/" },
{ userAgent: "ClaudeBot", disallow: "/" },
```

`Google-Extended` controls AI training only; it does not affect Search ranking.
