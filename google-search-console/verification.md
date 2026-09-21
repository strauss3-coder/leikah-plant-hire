# Domain ownership verification

Search Console will not show data for a property until you prove you control the
domain. There are several methods; which one you use determines what kind of
property you get.

---

## Recommended: DNS TXT, for a Domain property

**Use this one.** A Domain property covers every protocol, every subdomain and
both `www` and bare spellings in a single property. It can only be verified by
DNS.

The domain is at **xneelo**.

### The record

| Field | Value |
|---|---|
| Type | `TXT` |
| Host / Name | `@` (the root — xneelo may show this as blank) |
| Value | `google-site-verification=...` exactly as Search Console gives it |
| TTL | leave default |

### Steps

1. Search Console → Add property → **Domain** → `leikahgroup.co.za`
2. Copy the TXT value.
3. xneelo konsoleH → the domain → DNS.
4. Add the TXT record above. **Do not remove anything.**
5. Save, then wait.
6. Back in Search Console, press **Verify**.

### Confirming it propagated

```bash
dig +short TXT leikahgroup.co.za
```

Or, if `dig` is not available:

```bash
nslookup -type=TXT leikahgroup.co.za
```

You want the `google-site-verification=` string in the output. If it is not
there after an hour, the record was probably added in the wrong place.

### What must not be touched

The domain currently serves the website from GitHub Pages. These records keep
that working:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
```

And `public/CNAME` in the repository contains `leikahgroup.co.za`, which is what
tells GitHub Pages to answer for it. Deleting that file breaks the custom domain
on the next deploy.

Once the Microsoft 365 mailboxes exist there will also be `MX`, and probably
`TXT` records for SPF and DKIM. Adding the Google TXT record alongside them is
fine; a domain can hold many TXT records.

---

## Alternative: HTML meta tag, for a URL prefix property

Only if DNS is genuinely unavailable. This gives a URL prefix property, which
covers one exact spelling of the URL and nothing else.

A placeholder already exists in `.env.example`:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Set it to the token, then add to the metadata export in `src/app/layout.tsx`:

```ts
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
},
```

The variable also has to be set in the deploy workflow,
`.github/workflows/pages.yml`, alongside the ones already there, or the built
site will not contain it:

```yaml
env:
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: ${{ secrets.GOOGLE_SITE_VERIFICATION }}
```

Deploy, confirm the tag is live, then press Verify:

```bash
curl -s https://leikahgroup.co.za/ | grep google-site-verification
```

---

## Alternative: HTML file

Google provides a file named like `google1234abcdef.html`. Put it in `public/`:

```
public/google1234abcdef.html
```

Everything in `public/` is copied verbatim into the export, so it will be served
at `https://leikahgroup.co.za/google1234abcdef.html` after the next deploy.

Confirm before verifying:

```bash
curl -sI https://leikahgroup.co.za/google1234abcdef.html | head -1
```

You want `HTTP/2 200`.

---

## Bing Webmaster Tools

Do not verify Bing separately. It can import everything from Search Console:

1. <https://www.bing.com/webmasters>
2. Sign in, choose **Import from Google Search Console**
3. Authorise, pick `leikahgroup.co.za`

Ownership, the sitemap and the URL list come across in one step. Bing powers
DuckDuckGo and Ecosia as well, so it is worth the two minutes.

---

## After verifying

- **Leave the verification in place.** Google re-checks, and removing it
  un-verifies the property and loses access to the historical data.
- **Add the client as an owner** in Settings → Users and permissions, so access
  does not depend on one person's account.
- Verify **both** Search Console and Bing before considering this done.
