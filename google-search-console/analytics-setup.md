# Google Analytics 4

**Not installed.** Nothing in the codebase loads an analytics script, sets a
cookie or sends a request to Google. This document says exactly where it goes
and what has to be true before it is switched on.

---

## Why it is not installed yet

Two reasons, and the second is the important one.

**There is no GA4 property.** Nobody has decided which Google account owns it.

**The site has a cookie consent banner that promises something.** It currently
says:

> This site sets no advertising or tracking cookies. We need a few essential
> ones to keep enquiry forms working, and we will only store anything optional
> if you allow it.

That statement is true today. Adding GA4 without wiring it to the consent
mechanism would make it false, and under POPIA that is a compliance problem, not
just an inaccuracy. The consent infrastructure already exists —
`src/lib/consent.ts` and `src/components/site/CookieSettingsPanel.tsx` — and GA4
has to go behind it.

---

## The placeholder

Already in `.env.example`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Nothing reads it yet. It exists so the variable name is settled and so this
document has something to point at.

---

## Creating the property

1. <https://analytics.google.com> → Admin → Create → Property
2. Name: `Leikah Plant Hire`
3. Time zone: `(GMT+02:00) South Africa Standard Time`
4. Currency: `South African Rand (ZAR)`
5. Industry: Business & Industrial Markets
6. Create a **Web** data stream for `https://leikahgroup.co.za`
7. Copy the **Measurement ID**, in the form `G-XXXXXXXXXX`

Leave **Enhanced measurement** on. It tracks scroll depth, outbound clicks, file
downloads and site search without any extra code.

---

## Where the tag goes

`src/app/layout.tsx`, inside the root `<body>`, after the existing children.
That is the only place a site-wide script belongs; there is no other layout that
wraps every page.

The correct implementation is **not** a bare `<Script>` tag. It must not load
until the visitor has accepted, and it must react if they change their mind.

Sketch, to be completed when the property exists:

```tsx
// src/components/site/Analytics.tsx
"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  const consent = useConsent();          // the existing consent store
  if (!GA_ID || !consent.analytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
```

Then in `src/app/layout.tsx`:

```tsx
import { Analytics } from "@/components/site/Analytics";
// ...
<body>
  {children}
  <Analytics />
</body>
```

Read the actual shape of `src/lib/consent.ts` before writing this; the sketch
above assumes a hook that may not have that exact name.

---

## The Content Security Policy has to change

`next.config.ts` sets a CSP. It currently does **not** permit Google's domains,
so the script would be blocked and fail silently.

Two directives need extending:

```
script-src  ... https://www.googletagmanager.com
connect-src ... https://www.google-analytics.com https://analytics.google.com
```

Find `contentSecurityPolicy` in `next.config.ts`. Do not widen it further than
those two hosts.

Test after deploying by opening the browser console. A CSP violation is reported
there explicitly; there is no other symptom, the script just never runs.

---

## The deploy workflow

`.github/workflows/pages.yml` has to pass the variable through, or the built
site will not contain the ID:

```yaml
env:
  NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
```

Add `GA_MEASUREMENT_ID` under Settings → Secrets and variables → Actions. A
measurement ID is not secret — it ships in the page — but keeping it out of the
repository makes it easier to change.

---

## Events worth defining

GA4's automatic events cover most of it. Three custom ones are worth the effort,
because they are what the client actually cares about:

| Event | Fires when | Why |
|---|---|---|
| `quote_submitted` | Quote form submitted successfully | The primary conversion |
| `contact_submitted` | Contact form submitted | Secondary conversion |
| `emergency_call` | The breakdown number is tapped | Cannot be inferred any other way |

The server actions in `src/lib/enquiries/` are where the first two would fire
from, on success. Mark all three as **key events** in GA4 so they appear in
reporting.

---

## Linking to Search Console

Once both exist: GA4 Admin → Product links → Search Console links.

This puts organic search queries into GA4 alongside behaviour, so you can see
which search terms lead to a quote request rather than just which lead to a
visit. It is free and takes a minute.

---

## POPIA

- IP anonymisation on, as in the sketch above
- Load nothing until consent is given
- Stop when consent is withdrawn
- The privacy policy has to name Google Analytics as a processor and say what
  it collects — `src/content/seed/legal.ts`
- The cookie policy has to list the `_ga` and `_ga_*` cookies with their
  purpose and duration

**The privacy and cookie policies must be updated in the same deploy that turns
analytics on.** They currently state that no tracking cookies are set. Shipping
the tag without amending them would make the published policy untrue.
