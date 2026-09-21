# Structured data

JSON-LD, emitted into `<script type="application/ld+json">` on every page.
Source: `src/lib/seo.tsx`, plus per-page graphs in the route files.

Structured data is how a search engine reads the site as *facts* rather than
prose. It is what puts the map panel, the opening hours, the breadcrumb trail
and the FAQ accordion into a search result, and it is increasingly what an AI
assistant quotes when someone asks a question this business could answer.

---

## Types emitted

| Type | Where | Built by |
|---|---|---|
| `LocalBusiness` + `Organization` | Every page, via the site layout | `organisationSchema()` |
| `WebSite` | Every page | site layout |
| `WebPage` | Every page | site layout |
| `BreadcrumbList` | Every page below the root | `breadcrumbSchema()` |
| `Service` | Each of the 14 service pages | `serviceSchema()` |
| `ContactPoint` | Inside the organisation graph | `organisationSchema()` |
| `FAQPage` | FAQ page and service pages with FAQs | `faqSchema()` |
| `Article` | Each of the 3 news posts | `news/[slug]/page.tsx` |
| `CreativeWork` | Legal pages | `legalDocumentSchema()` |

Supporting types nested inside those: `PostalAddress`, `GeoCoordinates`,
`OpeningHoursSpecification`, `City`, `ImageObject`, `ListItem`, `Question`,
`Answer`, `Place`.

---

## The organisation graph

This is the important one. It carries the facts that decide whether Leikah shows
up for "plant hire near me".

```jsonc
{
  "@type": ["LocalBusiness", "Organization"],
  "@id": "https://leikahgroup.co.za#organisation",
  "name": "Leikah Plant Hire",
  "telephone": ["+27 60 976 3429", "+27 82 435 7961"],
  "address":  { "@type": "PostalAddress", ... },
  "geo":      { "@type": "GeoCoordinates", "latitude": -25.788143, "longitude": 29.495417 },
  "logo":     { "@type": "ImageObject", "url": "https://leikahgroup.co.za/brand/icon-512.png" },
  "contactPoint": [ ... ],
  "areaServed": [ { "@type": "City", "name": "Middelburg" }, ... ],
  "openingHoursSpecification": [ ... ],
  "sameAs": [ "https://www.facebook.com/..." ]
}
```

A few decisions worth knowing about:

**Declared as both `LocalBusiness` and `Organization`.** A business with a yard
people visit is a LocalBusiness; a company that publishes articles and employs
people is an Organization. Declaring both is valid and means each consumer finds
what it expects.

**The `@id` is stable.** `https://leikahgroup.co.za#organisation`. Other graphs
reference it rather than repeating the company details — the Article publisher,
for example, is `{ "@id": "...#organisation" }`. One definition, referenced
everywhere, which is what stops the facts drifting apart.

**Three separate contact points.** Customer service, emergency and sales, rather
than one number repeated. The emergency point declares `hoursAvailable` covering
all seven days, which is what lets Google answer "open now" against a breakdown
query at two in the morning. WhatsApp is a contact point rather than a second
`telephone` value, because the secondary line takes calls only and advertising
messaging on it would be wrong.

**Empty fields are omitted, not emitted blank.** There is no email address yet,
so no `email` key appears. `""` would be worse than absent.

---

## Testing it

Three tools. Use all three; they disagree.

**Google Rich Results Test** — <https://search.google.com/test/rich-results>
The authority on what Google will actually show. Test a live URL.

**Schema.org validator** — <https://validator.schema.org/>
Stricter, and catches vocabulary mistakes Google tolerates.

**Search Console → Enhancements**
Reports what Google found across the whole site, after crawling. Slower, but it
is the only one that tells you about pages you forgot to test.

Locally, before deploying:

```bash
npm run build:static
node scripts/seo/validate.mjs
```

That checks every JSON-LD block parses, that the seven required types are
present somewhere, that required properties exist on each, and that no `url`,
`logo`, `image` or `@id` is a relative path. Relative URLs in JSON-LD are a
silent failure: Google will not resolve them and the property is simply dropped.

Worth testing by hand at least once each:

- the homepage — organisation, website, webpage
- a service page — `Service` plus `FAQPage`
- a news post — `Article`
- the contact page — `LocalBusiness` with address and hours

---

## What is not emitted, and why

**`Review` and `AggregateRating`.** Review markup is the single biggest rich
result win available, and it cannot be added until there are real, attributable
reviews. Fabricating them is both against Google's guidelines and dishonest.
When Leikah has reviews on the Google Business Profile, those appear in the map
panel without any markup here.

**`Product` and `Offer`.** Plant hire is quoted, not priced on a page. Marking
up a price that does not exist would be wrong.

**`JobPosting`.** The careers page currently has no live postings. When it does,
this is worth adding: job postings get a dedicated Google surface.

**`priceRange` on LocalBusiness.** Google suggests it. Leaving it out is better
than inventing one.

---

## When the facts change

Everything above derives from `src/content/seed/business.ts`. Change the phone
number there and it changes in the schema, the footer, the contact page and the
structured data together. There is no second place to update.

The fields still empty, which will fill the graph out when the client supplies
them: `registration`, `vat`, `bbbee`, `email`, `quotesEmail`. See
`client-information-required.md`.
