# Google Search Console — setup

Ten steps, in order. Steps 1 to 5 take about twenty minutes plus DNS
propagation. Steps 6 to 10 are ongoing and start returning data after a few days.

Search Console is free, and it is the only place Google tells you what it thinks
of the site: which pages it has indexed, which it has refused and why, what
people searched for before clicking, and what it measured for real visitors.
Without it you are guessing.

---

## Step 1 — Verify domain ownership

Go to <https://search.google.com/search-console> and sign in with the Google
account that should own this. **Decide that first**: whoever owns the property
controls access to the data permanently, and moving it later means
re-verifying. It should be an account Leikah controls, not a personal account
belonging to whoever happens to set it up. A shared `admin@leikahgroup.co.za`
mailbox is the right answer once those mailboxes exist.

Choose **Domain property**, not URL prefix.

The difference matters. A Domain property covers `http` and `https`, `www` and
bare, and every subdomain, in one property. A URL prefix property covers exactly
one spelling, so `https://leikahgroup.co.za` and `https://www.leikahgroup.co.za`
would be two separate properties with two separate sets of data. Domain
properties can only be verified by DNS, which is why the next step exists.

Enter: `leikahgroup.co.za` — no protocol, no `www`, no trailing slash.

## Step 2 — DNS TXT verification

Google shows a TXT record that looks like:

```
google-site-verification=AbCdEf1234567890_exampleValueGoesHere
```

The domain is registered at **xneelo**. Add the record there:

1. Sign in to the xneelo control panel (konsoleH).
2. Find `leikahgroup.co.za`, then **DNS** or **Manage DNS**.
3. Add a record:
   - **Type**: TXT
   - **Host / Name**: `@` (or leave blank — xneelo's field for the root)
   - **Value**: the full `google-site-verification=...` string
   - **TTL**: leave the default
4. Save.

Do **not** remove any existing records, particularly the `A` records pointing at
GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
`185.199.111.153`) or any `MX` records for email. Adding a TXT record does not
affect them; deleting one would take the site or the mail offline.

Wait, then press **Verify** in Search Console. xneelo usually propagates within
minutes, but allow up to 48 hours before concluding something is wrong.

Check propagation yourself rather than waiting blind:

```bash
dig +short TXT leikahgroup.co.za
```

The verification string should appear in the output.

If verification fails, the usual causes are: the record was added to a subdomain
instead of the root; the value was pasted with quotes that xneelo added a second
set to; or it simply has not propagated.

**Leave the TXT record in place permanently.** Google re-checks periodically and
removing it un-verifies the property.

## Step 3 — Alternative: HTML verification

Only if DNS access is genuinely unavailable. This verifies a **URL prefix**
property, not a Domain property, so you lose the coverage described in step 1.

Two forms:

**HTML meta tag.** The placeholder is already in `.env.example`:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Set it, then add to the `metadata` export in `src/app/layout.tsx`:

```ts
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
},
```

Next renders `<meta name="google-site-verification" content="...">` into every
page. Rebuild and deploy before pressing Verify.

**HTML file.** Google gives a file named like `google1234abcd.html`. Put it in
`public/` and it is served at `https://leikahgroup.co.za/google1234abcd.html`.
Nothing else is needed; `public/` is copied verbatim into the export.

Either way, keep it in place afterwards.

## Step 4 — Submit the sitemap

Search Console left menu → **Sitemaps**. Enter:

```
sitemap.xml
```

The field is relative to the property root, so `sitemap.xml` is correct, not the
full URL.

Status will read "Couldn't fetch" for a short while immediately after
submission; that is normal and resolves itself. It should settle on "Success"
with **51 discovered URLs**. If the number is very different, something has
changed in the content — see `sitemap-notes.md`.

The sitemap is regenerated on every deploy, so it never needs resubmitting.
Google re-reads it on its own schedule.

## Step 5 — Request indexing

Submitting a sitemap tells Google the pages exist. Requesting indexing asks it
to look now. Use it for the pages that matter and let the rest arrive naturally.

**URL inspection** at the top of Search Console. Paste a full URL, wait for the
check, then **Request indexing**.

Worth doing by hand, in this order:

1. `https://leikahgroup.co.za/`
2. `https://leikahgroup.co.za/services/`
3. `https://leikahgroup.co.za/contact/`
4. `https://leikahgroup.co.za/emergency/`
5. `https://leikahgroup.co.za/quote/`

There is a daily quota of roughly ten to twelve requests. Do not work through
all 51 pages; it achieves nothing the sitemap does not.

Indexing takes anywhere from a few hours to a couple of weeks. A new domain with
no inbound links is at the slow end of that. This is normal and is not a fault
in the site.

## Step 6 — Monitor coverage

**Indexing → Pages.** This is the report that tells you whether Google has
actually accepted the site.

Expect, once settled:

- Roughly 51 pages indexed
- Three pages "Excluded by 'noindex' tag" — `/overview/`, `/onboarding/`,
  `/checklist/`. **That is correct.** They are client delivery documents, not
  marketing pages, and they are deliberately kept out of search.
- The 404 page excluded, also correct

Things that would be genuinely wrong:

| Report says | Means | Do |
|---|---|---|
| Crawled, currently not indexed | Google looked and chose not to index | Usually thin or duplicate content. Wait 2–4 weeks before acting. |
| Discovered, currently not indexed | Google knows about it, has not crawled | Almost always just queue time on a new domain. Wait. |
| Duplicate, Google chose different canonical | Google disagrees with the canonical tag | Check the page's canonical matches the sitemap. Ours do; report it if it appears. |
| Server error (5xx) | The host returned an error | GitHub Pages is static, so this should not happen. Check the Actions tab for a failed deploy. |
| Soft 404 | A page returns 200 but looks empty | Should not happen; every page has substantial content. |

## Step 7 — Fix crawl issues

Coverage errors are listed with example URLs. The workflow:

1. Open the error, copy an example URL.
2. Run it through **URL inspection** → **Test live URL**. This fetches the page
   as Googlebot right now, rather than showing you a cached verdict.
3. Look at the rendered HTML Google received. If content is missing there but
   present in a browser, something is failing for the crawler.
4. Fix, deploy, then **Validate fix** on the error. Google re-crawls the
   affected set and reports back, usually within a week.

For this site specifically: everything is prerendered to static HTML, so the
"JavaScript did not run for the crawler" class of problem cannot occur. Content
is in the HTML source. You can confirm with `curl`:

```bash
curl -s https://leikahgroup.co.za/services/line-boring/ | grep -c "Line Boring"
```

## Step 8 — Monitor Core Web Vitals

**Experience → Core Web Vitals.** Split into mobile and desktop.

This report uses **field data** from real Chrome users, not a lab test. It needs
enough traffic to populate, so a new site shows "not enough data" for the first
weeks. That is expected and is not a problem to solve.

The three metrics and their good thresholds:

- **LCP** (largest contentful paint) — under 2.5s. When the biggest thing on
  screen finishes rendering.
- **INP** (interaction to next paint) — under 200ms. How fast the page responds
  to a tap or click.
- **CLS** (cumulative layout shift) — under 0.1. How much the layout jumps
  while loading.

Measured in the lab before launch (4G, CPU throttled 4x):

| | Mobile | Desktop |
|---|---|---|
| LCP | 1.59s good | 1.78s–2.79s, one page needs improvement |
| CLS | 0 good | 0 good |

The desktop outlier is `/about/`, at 2.79s. It is explained in `seo-audit.md`.

## Step 9 — Monitor Mobile Usability

Google now folds this into the Page Experience signals rather than a standalone
report, but check it if it appears.

The classic failures are text under 12px, tap targets closer than 48px, and
content wider than the screen. All three were tested before launch: no
horizontal overflow at 390px, and the accessibility audit passes with zero
issues across every route, which covers tap target size and contrast.

## Step 10 — Monitor Search Performance

**Performance → Search results.** The report that answers "is this working".

Four metrics:

- **Impressions** — how often a page appeared in results
- **Clicks** — how often someone clicked
- **CTR** — clicks divided by impressions
- **Average position** — where the page ranked

What to actually do with it, once there are a few weeks of data:

1. **Queries tab.** Sort by impressions. Terms with many impressions and few
   clicks mean the page ranks but the title and description are not persuading
   anyone. Those are the cheapest wins on the whole site: rewrite the meta
   description and the CTR moves without touching a ranking.
2. **Pages tab.** Which pages earn impressions. If a service page you expect to
   perform has none, Google does not consider it relevant to those terms yet.
3. **Position 5–15.** Pages ranking just off the first page are where effort
   pays. Position 30 needs a different strategy; position 8 needs a nudge.
4. **Compare periods.** Month on month, not day on day. Search data is noisy.

Set up email alerts: **Settings → Users and permissions** controls who is
notified. Google emails automatically on new coverage errors and manual actions.
