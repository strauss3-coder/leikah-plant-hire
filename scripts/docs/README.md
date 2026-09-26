# Client documents

Standalone HTML documents published alongside the website at
`public/<slug>/index.html`, served from the custom domain. They are not Next
routes: they carry their own styles, are excluded from search with
`noindex, nofollow, noarchive`, and never appear in the sitemap.

## Microsoft 365 user guide

Source: `m365-guide.src.html`. A nineteen sheet A4 handbook prepared for
Leikah Plant Hire by ISM Digital Solutions.

Edit the source, then regenerate both outputs:

```sh
# the hosted page, with its download bar and document head
node scripts/docs/build-m365.mjs \
  scripts/docs/m365-guide.src.html \
  public/microsoft-365/index.html

# the PDF the page links to
node scripts/docs/topdf.mjs \
  scripts/docs/m365-guide.src.html \
  public/microsoft-365/Microsoft-365-User-Guide-Leikah-Plant-Hire.pdf
```

### Why the fit check matters

Every sheet is a fixed 297mm with `overflow:hidden`, so a page that runs long
is silently cut off at the bottom rather than spilling onto a new one. Adding
two sentences to a section is enough to lose a paragraph without any visible
error. `topdf.mjs` measures each sheet in print media first and refuses to
write the PDF if any of them exceeds A4, so the failure is loud.
