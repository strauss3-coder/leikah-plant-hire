# Search readiness checklist

Tick as you go. Anything marked **client** cannot be done by a developer.

---

## Already done in the codebase

- [x] Unique `<title>` on all 51 indexable pages
- [x] Unique meta description on all 51
- [x] Canonical URL on every page, matching the sitemap exactly
- [x] Open Graph title, description, image, url, type, locale, site name
- [x] Twitter card (`summary_large_image`) on every page
- [x] Favicon, apple-touch-icon, 512px PNG icon
- [x] `<html lang="en-ZA">`
- [x] Viewport meta with `viewport-fit=cover`
- [x] Exactly one `h1` per page, no skipped heading levels
- [x] Alt text on all 290 images (165 descriptive, 125 correctly decorative)
- [x] Descriptive image filenames (`coal-bench-excavator-working`, not `IMG_0789`)
- [x] JSON-LD: LocalBusiness, Organization, WebSite, WebPage, BreadcrumbList,
      Service, ContactPoint, plus FAQPage and Article where they apply
- [x] `sitemap.xml`, generated from content, 51 URLs, no duplicates
- [x] `robots.txt` referencing the sitemap absolutely
- [x] Client documents (`/overview/`, `/onboarding/`, `/checklist/`) excluded
      from search by their own robots meta
- [x] 404 page given its own title and `noindex`
- [x] HTTPS with a valid certificate
- [x] Mobile responsive, no horizontal overflow at 390px
- [x] Core Web Vitals good on mobile (LCP 1.59s, CLS 0)

## Needs doing, outside the codebase

### Google Search Console
- [ ] **client** Decide which Google account owns the property
- [ ] Add `leikahgroup.co.za` as a **Domain property**
- [ ] Add the DNS TXT record at xneelo (`verification.md`)
- [ ] Confirm verification
- [ ] Submit `https://leikahgroup.co.za/sitemap.xml`
- [ ] Request indexing for the homepage and the four division pages
- [ ] Check the Coverage report after 72 hours
- [ ] Check Core Web Vitals after 28 days of field data
- [ ] Check Mobile Usability
- [ ] Set up email alerts for coverage errors

### Bing Webmaster Tools
- [ ] Create the account
- [ ] Import from Search Console (fastest route, one click)
- [ ] Confirm the sitemap came across

### Google Business Profile
- [ ] **client** Decide which Google account owns it
- [ ] **client** Confirm whether the yard address may be published
- [ ] Claim or create the listing
- [ ] Complete verification (postcard, up to two weeks)
- [ ] Set the primary and secondary categories
- [ ] Add the website URL, phone, hours, service areas
- [ ] Upload photographs
- [ ] List services

### Analytics
- [ ] **client** Decide which Google account owns the GA4 property
- [ ] Create the property, get the `G-` measurement ID
- [ ] Wire the tag behind the existing cookie consent (`analytics-setup.md`)
- [ ] Link GA4 to Search Console

## Blocked on the client

These are in `client-information-required.md` with the reasoning. Short version:

- [ ] **client** Confirm the trading name (three are in circulation)
- [ ] **client** Confirm the address may be published
- [ ] **client** Company registration number and VAT number
- [ ] **client** The five mailboxes on `leikahgroup.co.za`
- [ ] **client** Confirm the founding year
- [ ] **client** Confirm the ISM relationship wording
- [ ] **client** Correct or replace the Facebook page link
- [ ] **client** Read the service, fleet and industry copy
