/**
 * Wraps the Microsoft 365 handbook for publication on leikahgroup.co.za.
 *
 * The authored source is a fragment: it begins at <title> because the Artifact
 * preview supplies its own document skeleton. GitHub Pages does not, so this
 * adds the head the other client documents use (/overview, /checklist,
 * /onboarding) and a download bar that disappears when the page is printed.
 *
 * One source, two outputs: edit the fragment, run this and topdf.mjs, and the
 * hosted page and the PDF cannot drift apart.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , SRC, OUT] = process.argv;

const fragment = readFileSync(SRC, "utf8");

/* The fragment splits cleanly in two: stylesheet links and CSS above the deck,
   markup from the deck down. The trailing print block belongs with the CSS. */
const DECK = '<div class="deck">';
const PRINT = "\n<style>\n/* ==========";

const deckAt = fragment.indexOf(DECK);
const printAt = fragment.lastIndexOf(PRINT);
if (deckAt < 0 || printAt < deckAt) throw new Error("source markers not found");

const headCss = fragment
  .slice(0, deckAt)
  .replace(/<title>[\s\S]*?<\/title>\s*/, "");      // replaced by the head below
const body = fragment.slice(deckAt, printAt);
const printCss = fragment.slice(printAt);

/* The Leikah mark, inline so the page makes no image request. */
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 2 H98 V78 L78 98 H2 V22 Z M26 20 H41 V44 H55 V58 H69 V72 H83 V80 H26 Z' fill='%23eda91b' fill-rule='evenodd'/%3E%3C/svg%3E";

const PDF = "Microsoft-365-User-Guide-Leikah-Plant-Hire.pdf";

writeFileSync(
  OUT,
  `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="description" content="Microsoft 365 Business User Guide prepared by ISM Digital Solutions for Leikah Plant Hire.">
<meta property="og:title" content="Microsoft 365 Business User Guide | Leikah Plant Hire">
<meta property="og:description" content="A complete guide to your new business email, cloud storage and productivity platform.">
<meta property="og:type" content="website">
<link rel="icon" href="${FAVICON}">
<title>Microsoft 365 Business User Guide | Leikah Plant Hire</title>
${headCss}${printCss}
<style>
/* --- Download bar ---------------------------------------------------------
   Fixed rather than inline: the document runs to nineteen sheets and the
   reader should be able to take the PDF from anywhere in it. Dropped for
   print, where it would otherwise land on top of the cover. */
.doc-actions{
  position:fixed; z-index:50;
  top:calc(env(safe-area-inset-top, 0px) + 14px); right:14px;
  display:flex; gap:8px;
}
.doc-actions a, .doc-actions button{
  font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  font-size:12px; font-weight:600; letter-spacing:.02em; line-height:1;
  padding:10px 15px; border-radius:4px; cursor:pointer;
  border:1px solid rgba(255,255,255,.18); text-decoration:none;
  background:rgba(11,14,19,.92); color:#e2e5e9;
  -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px);
}
.doc-actions a.primary{ background:#eda91b; color:#07090c; border-color:#eda91b }
.doc-actions a:hover, .doc-actions button:hover{ border-color:#eda91b; color:#f7c440 }
.doc-actions a.primary:hover{ background:#f7c440; color:#07090c }
.doc-actions :focus-visible{ outline:2px solid #f7c440; outline-offset:2px }
@media (max-width:600px){ .doc-actions a, .doc-actions button{ padding:9px 12px; font-size:11px } }
@media print{ .doc-actions{ display:none !important } }
</style>
</head>
<body>
<div class="doc-actions">
  <a class="primary" href="./${PDF}" download>Download PDF</a>
  <button type="button" onclick="window.print()">Print</button>
</div>

${body}</body>
</html>
`,
);
console.log("wrote", OUT);
