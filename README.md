# Leikah Plant Hire

Corporate website and content management portal for a Middelburg-based plant
hire, earthmoving and heavy mechanical contractor.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase ·
Motion.

---

## Quick start

```bash
npm install
npm run media      # process the client photography (once, or whenever photos change)
npm run dev        # http://localhost:3000
```

The site runs completely with **no environment variables at all**. It renders
from the content in `src/content/seed`, and `/portal` opens in a read-only
preview so the CMS can be evaluated before the database exists.

---

## How the content layer works

There is one rule the whole build follows: **nothing a client might reasonably
want to change is written into a component.**

```
src/content/seed/*.ts   the content, as typed TypeScript
        │
        ├──────────────► npm run seed:sql ──► supabase/migrations/0004_seed.sql
        │                                            │
        │                                            ▼
        │                                     Supabase (editable in /portal)
        │                                            │
        ▼                                            ▼
                        src/lib/cms/index.ts  ◄───────
                                 │
                                 ▼
                          every page on the site
```

`getSiteContent()` resolves **per collection**, not all-or-nothing:

1. Supabase, when it is configured *and* the table returns rows
2. The seed graph, otherwise

So a half-migrated database still renders a complete site, and a CMS outage
never takes the marketing site down — it falls back quietly and logs once.

Pages never reach into the graph directly. They call accessors
(`getServices()`, `getProjectBySlug()`, …) so the filtering rules — published
only, soft-deleted excluded, featured ordering — live in exactly one place.

### Changing content

| What you want to change | Where |
| --- | --- |
| Anything, once Supabase is connected | `/portal` |
| Content before Supabase exists | `src/content/seed/*.ts`, then `npm run seed:sql` |
| Which fields the portal offers | `src/lib/portal/schema.ts` |
| The photography | drop files in `../assest`, extend `scripts/process-media.mjs`, `npm run media` |

Adding a field to a content type is a change to `src/lib/portal/schema.ts` and
nowhere else. The list screen, the editor, validation and the audit trail are
all generated from that registry.

---

## Connecting Supabase

1. **Create the project** at supabase.com. A European region (eu-west-1 or
   eu-central-1) performs well from Mpumalanga.

2. **Run the migrations, in order**, from the SQL editor or `supabase db push`:

   | File | What it does |
   | --- | --- |
   | `0001_schema.sql` | Tables, enums, indexes, timestamp triggers, audit log |
   | `0002_rls.sql` | Row-level security for every table |
   | `0003_storage.sql` | Storage buckets and their policies |
   | `0004_seed.sql` | The seed content — generated, idempotent, safe to re-run |

3. **Set the environment variables.** Copy `.env.example` to `.env.local`:

   ```
   NEXT_PUBLIC_SITE_URL=https://leikahplanthire.co.za
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

   The service-role key is server-only. It must never carry a `NEXT_PUBLIC_`
   prefix and must never be committed.

4. **Create the first portal user.** Invite yourself from Supabase
   Authentication → Users, then insert the matching row:

   ```sql
   insert into portal_users (id, email, full_name, role)
   values ('<auth-user-uuid>', 'you@leikahplanthire.co.za', 'Your Name', 'owner');
   ```

   Access is granted by that row, not by having an auth account. Revoking
   someone is `active = false`, and it takes effect in the database policies as
   well as in the interface.

---

## Security model

The rules are enforced by Postgres, not by the application:

- **anon** (the public site) reads published, non-deleted content and nothing
  else. It cannot read enquiries, customers, users or the audit log, and it
  cannot INSERT anywhere.
- **Enquiries** are written by server actions holding the service-role key.
  That is what keeps the public key from being able to write to the database at
  all.
- **Portal roles** — `viewer` reads; `editor` writes content and works
  enquiries; `admin` also manages users and settings; `owner` is unrestricted.
- **The audit log** has no insert, update or delete policy. Its only writer is a
  `security definer` trigger, so a change made directly in Supabase is captured
  too.
- **Deletes are soft.** `deleted_at` is set and the row leaves both the site and
  the portal's default view, but it stays recoverable.
- **Enquiry attachments** live in a private bucket. anon may upload but may not
  read; the portal signs a one-hour URL when a member opens one.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run media` | Reprocess photography → `public/media` + manifest |
| `npm run seed:sql` | Regenerate `0004_seed.sql` from the seed graph |

### QA scripts

Run against a production build (`npm run build && npm run start -- -p 4311`):

```bash
node scripts/qa/interact.mjs   # 20 interaction checks: forms, filters, lightbox, mobile nav, overflow
node scripts/qa/audit.mjs      # axe-core accessibility sweep across all 21 public routes
node scripts/qa/vitals.mjs     # LCP / CLS on emulated 4G with 4x CPU throttling
node scripts/qa/shot.mjs "/:home" "/quote:quote"   # screenshots, desktop + mobile
node scripts/qa/section.mjs "/" 3 "divisions"      # one section at real size
node scripts/qa/icon-sheet.mjs                    # the equipment icon family, three sizes
node scripts/qa/blueprint-sheet.mjs               # the technical drawings
```

State at handover: **20/20 interaction checks**, **0 accessibility violations**
across 22 routes, **worst LCP 1.86 s, CLS 0**.

---

## Media pipeline

`scripts/process-media.mjs` reads the client's originals from `../assest`,
trims letterbox bars, resizes to the widths the layout actually requests,
converts to WebP, and emits `src/content/media-manifest.json` with dimensions
and an inline LQIP for each image.

Content references images by **manifest slug**, never by URL, so renditions can
be regenerated without touching a single content file. `next/image` then serves
AVIF where the browser supports it.

To add photography: drop the files into `../assest/images`, add an entry to the
`CATALOGUE` array in the script (slug, title, alt text, tags), and run
`npm run media`.

---

## Architecture notes

Decisions that are not obvious from the file tree, each one the fix for a real
bug found during the build:

- **`src/lib/utils.ts` extends `tailwind-merge`** so `text-display-1…4` are
  recognised as font sizes. Without it, `cn("text-display-2", "text-paper-50")`
  silently drops the size — tailwind-merge classifies unknown `text-*` classes
  as colours.
- **Base element styles live inside `@layer base`.** Unlayered CSS outranks
  every layered Tailwind utility, so an unlayered `h2 { color }` rule beats
  `text-ink-950` and turns headings on light sections white-on-white.
- **Reveal animations travel vertically only**, including the directions named
  `left` and `right`. A horizontal offset on an element below the fold widens
  `documentElement.scrollWidth` and gives phones a horizontal scrollbar.
- **Nothing branches on `useReducedMotion()` structurally.** It resolves to
  `null` on the server and to the real preference after hydration, so returning
  a different tree shape guarantees a hydration mismatch. Animation *values* go
  flat instead.
- **`motion.create()` results are cached per tag.** Calling it during render
  creates a new component identity every time and remounts the whole subtree.
- **`steel-500` is the smallest text on the site**, tuned to clear WCAG AA
  against every ink ground down to `ink-800`. `steel-600` is a hairline colour
  only — never put text on it.
- **A `<dl>` may only contain `dt`/`dd` groups and their wrappers.** Decorative
  children — registration marks, backgrounds — belong on the container around
  it, not inside it.
- **The visual language lives in three files.** `EquipmentIcon.tsx` (the machine
  icon family and the slug → icon registry), `Blueprint.tsx` (four technical
  drawings with per-stroke draw ordering) and `Atmosphere.tsx` (survey grid,
  contours, dust, watermarks, dividers). Render them as contact sheets with
  `node scripts/qa/icon-sheet.mjs` and `node scripts/qa/blueprint-sheet.mjs`
  rather than judging them in situ.

---

## Deployment

Vercel is the path of least resistance: connect the repository, add the four
environment variables, deploy. `next.config.ts` already sets long-lived
immutable caching for `/media`, plus `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options` and a restrictive `Permissions-Policy`.

Two things to know before going live:

- **Enquiry rate limiting is in-memory**, so it is per-instance. It stops casual
  form hammering; a serious abuse problem needs a shared store.
- **Nothing sends email yet.** Enquiries are stored and appear in the portal.
  Wiring Resend or Postmark into `src/lib/enquiries/actions.ts` is a small job,
  and `site_settings.notifications` already holds the recipient lists.

---

## Outstanding before launch

The portal dashboard generates this list from the live content, and it clears
itself as the gaps are filled. At handover:

1. Company registration number, VAT number and B-BBEE level
   (`/portal/pages/business`)
2. Branded mailboxes — the site lists `info@` and `quotes@leikahplanthire.co.za`;
   create them, or change them to addresses that work
3. Real client testimonials — the section stays hidden until one is published
4. Safety certifications and compliance documents for the vendor pack
5. Client logos, only where written permission exists

`HANDOVER.md` has the full account of what was built, what was deliberately left
empty, and why.
