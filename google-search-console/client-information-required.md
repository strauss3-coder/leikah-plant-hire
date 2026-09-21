# Still required from Leikah

Everything below is blocked on the client, not on development. Ordered by what
it costs to leave undone.

---

## Blocking — search setup cannot proceed

### 1. The trading name

Three names are in circulation for one business:

| Name | Where it appears |
|---|---|
| **Leikah Plant Hire** | The entire website: every page title, the wordmark, the legal entity in the terms, the structured data |
| **Leikah Mining** | The client's own company profile document and their logo |
| **ISM Supply and Maintanance** | The Facebook page, which is also the only social profile in the structured data |

And the registered domain is `leikahgroup.co.za`, a fourth word.

**Why it blocks things.** The Google Business Profile name must match the
signage and the legal documents, and changing it after verification triggers
re-verification, which is another two weeks. The name is also in every page
title, the `Organization` schema, and the terms and privacy pages.

**Needed:** the exact legal name and the exact trading name, and whether Plant
Hire and Mining are divisions of a group.

### 2. Who owns the Google accounts

Three accounts are needed: Search Console, Google Business Profile, Analytics.

Ownership is painful to move afterwards and the data does not always come with
it. It should be an account Leikah controls permanently, not a personal account
belonging to whoever sets it up. The right answer is a shared
`admin@leikahgroup.co.za` mailbox, which brings us to the next item.

### 3. The five mailboxes on leikahgroup.co.za

Invoice #006 provides for `info@`, `accounts@`, `sales@`, `admin@` and
`director@`. None exist yet, so every email field on the site is deliberately
blank and the legal pages fall back to the phone number.

The company profile also publishes `jean.lombard@leikahmining.co.za`, which is a
different domain again and contradicts the standing instruction that
`leikahgroup.co.za` is the only one.

**Also needed:** where quotation requests should go. The quote form needs one
real destination.

---

## Important — affects how the business appears

### 4. May the address be published?

`7 July Street, New Industrial Area, Middelburg, 1055` is currently in the
`PostalAddress` schema and on the contact page.

A Google Business Profile can either show the address (storefront) or hide it
and show only the service areas. For a yard people collect equipment from,
showing it is the advantage. Confirm that is wanted.

### 5. Registration number and VAT number

Both fields exist in the business record and both are empty. They belong in the
footer and the legal pages, and corporate procurement departments look for them.

Also worth asking: is the business VAT registered at all? If not, the field
should be removed rather than left blank.

### 6. Founding year

The site says **2016**, which drives a counting figure on the homepage and
`foundingDate` in the structured data. It was taken from research, not from the
business. The company profile says "over 8 years", which points at 2017 or
earlier.

### 7. The ISM relationship

The homepage hero carries an ISM mark labelled "In association with", and the
ISM Facebook page is the only entry in `sameAs` in the structured data, which
tells Google the two are the same entity.

Nobody has ever confirmed what the relationship is. Division, sister company,
former trading name, shareholder, supplier? This is the riskiest unverified
claim on the site.

### 8. The Facebook page

Two problems. The name is misspelled — "Maintanance" — and it does not match the
website. It is currently published in the structured data as an official profile
of this business.

Either correct it at source or supply the right link. If there are LinkedIn,
Instagram or YouTube profiles, those belong in `sameAs` too: it is how Google
connects the website to the social presence.

### 9. Somebody needs to read the copy

**Thirteen of the fourteen services, six fleet classes, eight industries and the
About page history were written from research during the build.** Nobody at
Leikah has read them.

For SEO this matters more than it sounds. A wrong specification or an overstated
capability on an indexed page is quotable back at the business, and it is
exactly the sort of content Google's quality systems and AI assistants now
weight heavily.

Ten minutes with someone who knows the business is worth more than any other
item in this folder.

---

## Useful — improves ranking once supplied

### 10. Photographs for the Business Profile

The website has good material already. The profile needs the **originals**, not
the web renditions: workshop interiors, machines at work, the team in PPE, the
yard and its signage.

Listings with photographs get substantially more calls and direction requests.

### 11. Certifications and memberships

Nothing is currently published. COIDA letter of good standing, B-BBEE
certificate, ISO, SAPHRA, any industry body membership. These are trust signals
for corporate procurement and belong on the health and safety page.

### 12. Testimonials and client logos

The testimonials page is built and empty, and there are no client logos.
Reviews are the single biggest local ranking factor after proximity and
category.

**Written permission is required** before publishing a client name or logo.

### 13. Additional service locations

Ten towns are listed. If the business works further afield — Polokwane,
Rustenburg, Gauteng — adding them widens the `areaServed` schema and the Business
Profile service area.

### 14. Approval of the business description

A draft for the Google Business Profile is in `google-business-profile.md`. It
uses only facts already on the website. It should be read and approved before it
is published, because it will be one of the first things a searcher sees.

### 15. Live job postings

The careers page is built and empty. Google gives job postings a dedicated
surface with its own structured data type. Worth adding when there is something
to list.

---

## Summary

| # | Item | Blocks |
|---|---|---|
| 1 | Trading name | Business Profile, site branding |
| 2 | Google account ownership | Search Console, Profile, Analytics |
| 3 | Mailboxes | Account ownership, quote routing |
| 4 | Address publication | Business Profile setup |
| 5 | Registration and VAT | Footer, legal pages |
| 6 | Founding year | Homepage figure, structured data |
| 7 | ISM relationship | Homepage claim, `sameAs` |
| 8 | Facebook link | Structured data |
| 9 | Copy approval | Content quality |
| 10–15 | Photos, certs, testimonials, areas, description, jobs | Ranking improvements |
