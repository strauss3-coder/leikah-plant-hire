# Handover — Leikah Plant Hire

What was built, the judgement calls behind it, and what still needs the client
before launch.

---

## 1. The name

The project folder and the research report both say **ISM Supply and
Maintenance**. The brief said to reference the business only as **Leikah Plant
Hire**, and the client's own assets agree — the bakkie livery and the badge in
`IMG_0521` both read *LEIKAH · DOZER & PLANT HIRE*.

So the site says Leikah Plant Hire, everywhere, with no exceptions. The research
report was used only for operational substance: the July Street address, the
coordinates, the Middelburg heavy-engineering corridor, the two-division
structure, the continuous dispatch capability, and the phone number.

**One asset to be aware of:** `IMG_0529.JPG` — the team welding a diesel bowser
— shows *ISM* printed on the workwear. It is genuinely good photography of real
people doing real work, so it is used on the health and safety, careers and
fabrication sections. It is kept out of hero positions. Replace it when
re-branded workwear photography exists.

---

## 2. What is on the site

**22 public routes**, all statically rendered except `/quote` and `/services`
(both read search params):

Home · About · Services (index + 13 detail pages) · Fleet · Industries (index +
8 sectors) · Projects (index + 6 case studies) · Maintenance · Supply ·
Emergency · Health & Safety · Gallery · Careers · News (index + 3 articles) ·
Testimonials · FAQ · Contact · Request a Quote · 404.

**31 portal screens** under `/portal`: dashboard, three enquiry inboxes,
customers, invoices (scoped, see §7), four page editors, eleven content
collections, media library, SEO, appearance, settings, users and permissions,
audit log, analytics.

---

## 3. The visual language — "Cut & Section"

The first build was competently designed and anonymously branded: a dark
corporate template with a gold accent. Cover the logo and nothing identified
the company. The redesign fixes that with a graphic system taken from how an
open-cast mine is actually read — in sections and strata.

Seven elements, all derived from the terraced L in the logo:

| Element | Where it appears |
| --- | --- |
| **Bench** — the terraced step | Section dividers, the process walkthrough, card corners |
| **Strata** — layered bands with level annotations | Between every major section |
| **Blueprint machines** — full technical drawings that draw themselves in | Hero, every page masthead, CTA band, loading screen |
| **Terrain contours** | Stats band, process walkthrough |
| **Dust** — canvas particle field | Hero, fleet plates, CTA, mastheads |
| **Brand watermark** — the mark, embossed | Stats band, mastheads, CTA, section grounds |
| **Oversized wordmark** | The brand band, the fleet section, the footer sign-off |

### The hero

The hero is deliberately the quietest part of the design system, not the
loudest. Its only job is the first five seconds.

The name **is** the headline — a large mark, the LEIKAH wordmark assembled
letter by letter, the descriptor under a hairline, one short tagline. There is
no long heading, no body paragraph and no call to action, because each of those
was competing with the photography and with the brand.

Everything removed from it went somewhere useful: the descriptive paragraph now
opens the section below (`introLead`), and quotation prompts appear naturally
further down the page.

Two supporting decisions:

- The header **softens over the hero**. At the top of the homepage the corner
  shows the mark alone, not the full lockup, and the quote button is an outline
  rather than solid gold. Both revert on scroll. Repeating the wordmark in the
  corner while a full-size one sits in the middle of the same viewport is the
  same brand twice, and a solid gold button was the loudest thing in frame.
- The overlay is much lighter than a text-heavy hero can afford — a 38% darken,
  a soft radial behind the lockup for legibility, and a bottom ramp. The
  machinery is legible edge to edge.

### The ISM mark

Introduced beneath the hero as an associated mark, quietly, under the label
**"In association with"**.

The source was a photograph of a brushed-metal badge on a dark speckled surface.
Dropped in as-is it would have read as a photo of a sign, and its own black
background would have sat as a visible rectangle over the hero. So
`npm run brand:partner` lifts the letterforms out using luminance as an alpha
channel: the metal becomes opaque, the ground becomes fully transparent. The
result tints and scales like any other logo.

**Confirm the wording before launch.** "In association with" states a
relationship, and only the client knows the right one — division, sister
company, former trading name, or partner. The label, name, logo path and link
are all editable under Homepage → Hero partner.

### What changed, concretely

**The name is now unmissable.** A full-width `LEIKAH` band sits directly under
the hero, set in brushed steel and cropped at both edges, with the positioning
line hung off a rule beneath it. The footer signs off on the same wordmark. The
mark also appears at 44–56px beside the hero eyebrow and on every page masthead,
not only in the header.

**A real equipment icon family.** The previous set was 24 abstract glyphs on a
32-unit grid — illegible at card size, and two services shared one icon without
anyone noticing. There are now 24 icons drawn as machines on a 48-unit grid with
a shared ground datum: excavator, dozer, articulated hauler, grader, loader,
lowbed, water bowser, engine, transmission, hydraulic cylinder, hose assembly,
pump, hard hat, weld, pallet, bench profile, haul road, stockpile. Service slugs
map to icons through a registry, so a duplicate is now visible as a mapping
rather than buried in a data file.

**Signature sections that are not rectangles.**

- **Fleet showcase** — a machine selector rail, a full-bleed plate of the actual
  machine, and a specification strip laid out like an equipment data sheet.
  Plate numbering, machine designation, the lot. Also a full `/fleet` page.
- **Process walkthrough** — the five stages of a job as a descending bench
  profile, each stage sitting one step lower than the last, with a gold datum
  rail that fills as you scroll through it.
- **Service editorial** — replaces the 3 × 2 grid of identical cards with a
  photographic lead plate plus a dense register. A grid says every service
  matters equally, which is never true.
- **Industry tiles** — replaces the eight-cell text spreadsheet. Each sector
  carries its own photograph, desaturated at rest, coming to colour on hover,
  with the two heaviest sectors at double width so the grid has an entry point.
- **Stats band** — rebuilt as a survey readout on a datum rule with tick marks,
  contours underneath and the mark embossed behind.

**A fleet content type.** Six machine classes, each with specifications,
applications and photography — fully CMS-managed, with its own portal module,
database table and RLS policies.

---

## 4. The identity

The existing badge is a stock-style illustration that does not survive being
scaled down or printed in one colour, so a new mark was drawn.

**The mark** is a chamfered steel plate with a terraced *L* cut out of it. The
four steps are the profile of a cut face — which is what the earthmoving
division actually builds — and the chamfer is the same corner treatment used by
the `chamfer` utility on every card, button and panel in the interface. The
identity and the UI share one silhouette rather than merely coexisting.

An earlier version carried a diagonal blade slice. It was dropped because at
32px it read as a tick.

**The wordmark** is drawn as paths, not set in a webfont, so it is identical in
the browser, in the favicon, in print and on vehicle vinyl. Every letter in
LEIKAH is straight-sided, which is why the angular treatment fits the name so
naturally.

Delivered in `public/brand/`:

```
mark-gold.svg  mark-light.svg  mark-dark.svg
wordmark-gold.svg  wordmark-light.svg  wordmark-dark.svg
logo-horizontal-gold.svg  -light.svg  -dark.svg  -mono.svg
favicon.svg  icon-512.png  social-avatar.png
```

Plus `src/app/icon.svg` and `public/apple-icon.png` wired into the app, and
`src/components/brand/Logo.tsx` for inline use, where the gold gradient picks up
the live theme tokens.

The palette keeps the gold-on-black equity the fleet already carries, and adds
the steel and ink range the brief asked for. It is documented in the portal
under Appearance.

---

## 5. Content that was deliberately left empty

Four collections ship with **zero rows**, and this was a decision rather than an
oversight.

| Collection | Why |
| --- | --- |
| Testimonials | Every quote is a claim about a named third party. Inventing one puts a false statement on a site that bids for mine and municipal work. |
| Client logos | Same. A client mark implies a relationship and permission to display it. |
| Compliance documents | These are matters of record — certificates either exist or they do not. |
| Vacancies | A fabricated job posting is something a real person can apply to. |

Every consuming component handles the empty state properly rather than showing a
gap:

- The homepage testimonial section does not render at all until a real one is
  published.
- `/testimonials` explains that feedback is published only with permission, and
  offers to put the reader in touch with a reference directly.
- `/health-safety` offers the compliance pack on request instead of showing an
  empty certifications grid.
- `/careers` runs on speculative applications, which is honest for a business
  that hires when contracts start rather than to a published headcount plan.

The portal dashboard lists all of it as outstanding, and the list clears itself
as the gaps are filled.

### Facts that need confirming

Two seeded values are best guesses and are flagged on the dashboard:

- **`foundedYear: 2016`** drives the "Years on the coalfields" counter. One
  field in `/portal/pages/business` corrects the counter everywhere.
- **`info@` and `quotes@leikahplanthire.co.za`** are brand-consistent addresses
  that may not exist yet. The verified inbox on record is a Gmail address
  carrying the old ISM name, which would contradict the naming instruction, so
  it was not used. Create the mailboxes or change the fields.

The rest — address, coordinates, phone number, 24/7 dispatch, division
structure, sector coverage — comes from the research report.

Project client names are withheld by default (`clientNamed: false`) with the
sector shown instead, which is standard where mine contracts carry
confidentiality terms. A toggle in the portal reveals a name once permission is
in writing.

---

## 6. QA results

All measured against a production build.

| Check | Result |
| --- | --- |
| Build | 51 routes, no errors, no warnings |
| TypeScript | Clean, strict |
| Interaction suite | **20/20** — forms, filters, lightbox, mobile nav, validation, submission |
| Accessibility (axe-core, WCAG 2.1 AA) | **0 violations** across all 22 public routes |
| Console errors | **None**, desktop and mobile |
| Largest Contentful Paint | **1.86 s worst case** (4G, 4× CPU throttle, 390px) |
| Cumulative Layout Shift | **0** on every route measured |
| Horizontal overflow | None at 390px on any route |

Six systemic bugs were found and fixed during QA. They are documented in the
README because each one is invisible until it bites:

1. `tailwind-merge` was silently dropping `text-display-*` sizes wherever a text
   colour was applied to the same element.
2. Base element styles were unlayered, so they outranked every Tailwind utility
   — headings on light sections rendered white-on-white.
3. Horizontal reveal offsets widened the document and produced a horizontal
   scrollbar on phones.
4. Two components branched on `useReducedMotion()` in ways that guaranteed
   hydration mismatches — and the redesign introduced two more of the same
   class, which is why the rule is now written down: nothing may branch on that
   hook structurally, and nothing may render a value derived from it.
5. `motion.create()` was being called during render, creating a new component
   identity every pass and remounting whole subtrees.
6. The fleet specification strip put `<dt>`/`<dd>` outside a `<dl>`.

---

## 7. What is not built

Stated plainly rather than left to be discovered.

**Invoicing.** Scoped, not built. The `customers` table exists and quote
requests already link to it — the part that is expensive to retrofit is done.
What remains is an invoices table with line items and a number series, PDF
generation, payment tracking and a bookkeeper export. Worth deciding first
whether invoicing belongs here at all, or whether the portal should hand
qualified work to the accounting package the business already uses. Two places
where money is recorded is usually a mistake. `/portal/invoices` says all of
this on screen.

**Email notifications.** Enquiries are stored and appear in the portal, but
nothing is emailed. `site_settings.notifications` already holds the recipient
lists; wiring Resend or Postmark into `src/lib/enquiries/actions.ts` is a small
job.

**Video.** The gallery and testimonial models both carry `videoUrl` fields and
the UI renders a play affordance when one is present. No video was supplied.

**An embedded map.** `/contact` uses a coordinate plate with directions and
deep links to Google Maps rather than an embed. That avoids a third-party
script, a consent banner and a Maps API key, and it still gets a driver to the
gate. Say the word if an embed is wanted.

**Analytics.** `/portal/analytics` reports first-party enquiry data — volume,
status, win rate, most-requested services. Page views belong in a dedicated
tool; none is installed.

---

## 8. Preview mode

`/portal` opens read-only against the seed content when Supabase is not
configured, so the CMS can be walked through before the database exists.

This is safe by construction, not by policy: with no database there are no
enquiries, no customers and no users to expose, and every write action fails at
the point it asks for a client. It is not a bypass flag — the moment credentials
exist, real authentication is required and preview mode becomes unreachable.

---

## 9. Where things are

```
leikah/
├── src/
│   ├── app/
│   │   ├── (site)/          22 public routes
│   │   └── portal/          30 CMS screens
│   ├── components/
│   │   ├── brand/           logo and wordmark
│   │   ├── graphics/        equipment icons, blueprints, atmosphere
│   │   ├── layout/          header, footer, preloader, transitions
│   │   ├── portal/          CMS interface
│   │   ├── site/            page sections
│   │   └── ui/              primitives
│   ├── content/seed/        ← all site content lives here
│   └── lib/
│       ├── cms/             content resolution + types
│       ├── enquiries/       validation + server actions
│       ├── portal/          field schema, auth, actions
│       └── supabase/        clients
├── supabase/migrations/     4 SQL files, run in order
├── scripts/
│   ├── process-media.mjs    photography pipeline
│   ├── generate-seed-sql.ts seed → SQL
│   └── qa/                  4 QA scripts
└── public/
    ├── brand/               14 logo files
    └── media/               47 image renditions
```

Three files carry the visual identity:

- `components/graphics/EquipmentIcon.tsx` — the 24-icon machine family, plus
  the slug → icon registry that prevents duplicates.
- `components/graphics/Blueprint.tsx` — four full technical drawings
  (excavator, dozer, hauler, engine) with per-stroke draw ordering, so the
  undercarriage lands before the boom and the bucket arrives last.
- `components/graphics/Atmosphere.tsx` — survey grid, terrain contours, dust
  field, brand watermark, oversized wordmark, strata divider, steel sheen.

Two QA scripts render the graphics as contact sheets so they can be judged
rather than assumed: `node scripts/qa/icon-sheet.mjs` and
`node scripts/qa/blueprint-sheet.mjs`.
