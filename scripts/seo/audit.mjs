/**
 * Static SEO audit of the exported site.
 *
 * Reads out/**\/*.html directly rather than a running server, because the
 * export is exactly what GitHub Pages serves: what this sees is what Google
 * sees. Run after `npm run build:static`.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");

async function htmlFiles(dir = OUT, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await htmlFiles(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

/**
 * Titles and descriptions are measured as a search engine renders them, not as
 * they sit in the file. "&amp;" is one character on screen and five in the
 * source, and counting the source reported every title containing an ampersand
 * as four characters longer than it is.
 */
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&nbsp;/g, " ");

const pick = (html, re) => decode((html.match(re)?.[1] ?? "").trim());
const attr = (html, sel) =>
  pick(html, new RegExp(`<meta[^>]+${sel}[^>]+content="([^"]*)"`, "i")) ||
  pick(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+${sel}`, "i"));

/** A page that says noindex is not competing for anything, so the
 *  discoverability checks below do not apply to it. */
const isNoIndex = (r) => /noindex/i.test(r.robots);

const files = await htmlFiles();
const rows = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const route =
    "/" + path.relative(OUT, file).replace(/index\.html$/, "").replace(/\.html$/, "");

  // Headings, in document order, so a skipped level is visible.
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: +m[1],
    text: m[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(),
  }));

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const m of ld) {
    try {
      const parsed = JSON.parse(m[1]);
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === "object") {
          if (n["@type"]) types.push(...[].concat(n["@type"]));
          Object.values(n).forEach(walk);
        }
      };
      walk(parsed);
    } catch {
      types.push("PARSE_ERROR");
    }
  }

  rows.push({
    route,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(html, 'name="description"'),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
    ogTitle: attr(html, 'property="og:title"'),
    ogDesc: attr(html, 'property="og:description"'),
    ogImage: attr(html, 'property="og:image"'),
    ogUrl: attr(html, 'property="og:url"'),
    twCard: attr(html, 'name="twitter:card"'),
    viewport: attr(html, 'name="viewport"'),
    robots: attr(html, 'name="robots"'),
    lang: pick(html, /<html[^>]+lang="([^"]*)"/i),
    favicon: /rel="(icon|shortcut icon|apple-touch-icon)"/i.test(html),
    h1s: headings.filter((h) => h.level === 1).map((h) => h.text),
    headings,
    imgTotal: imgs.length,
    imgNoAlt: imgs.filter((t) => !/\balt=/.test(t)).length,
    imgEmptyAlt: imgs.filter((t) => /\balt=""/.test(t)).length,
    ldTypes: [...new Set(types)],
  });
}

/* --- Findings ----------------------------------------------------------- */
const problems = [];
const add = (sev, route, msg) => problems.push({ sev, route, msg });

const byTitle = new Map();
const byDesc = new Map();

const indexable = rows.filter((r) => !isNoIndex(r));
const excluded = rows.filter(isNoIndex);

for (const r of indexable) {
  if (!r.title) add("HIGH", r.route, "missing <title>");
  else {
    byTitle.set(r.title, [...(byTitle.get(r.title) ?? []), r.route]);
    if (r.title.length > 60) add("LOW", r.route, `title ${r.title.length} chars (>60, may truncate)`);
    if (r.title.length < 15) add("MED", r.route, `title only ${r.title.length} chars`);
  }

  if (!r.description) add("HIGH", r.route, "missing meta description");
  else {
    byDesc.set(r.description, [...(byDesc.get(r.description) ?? []), r.route]);
    if (r.description.length > 165) add("LOW", r.route, `description ${r.description.length} chars (>165)`);
    if (r.description.length < 70) add("MED", r.route, `description only ${r.description.length} chars`);
  }

  if (!r.canonical) add("HIGH", r.route, "missing canonical");
  if (!r.ogTitle) add("MED", r.route, "missing og:title");
  if (!r.ogDesc) add("MED", r.route, "missing og:description");
  if (!r.ogImage) add("MED", r.route, "missing og:image");
  if (!r.ogUrl) add("LOW", r.route, "missing og:url");
  if (!r.twCard) add("MED", r.route, "missing twitter:card");
  if (!r.viewport) add("HIGH", r.route, "missing viewport");
  if (!r.lang) add("HIGH", r.route, "missing <html lang>");
  if (!r.favicon) add("MED", r.route, "no favicon link");

  if (r.h1s.length === 0) add("HIGH", r.route, "no <h1>");
  if (r.h1s.length > 1) add("MED", r.route, `${r.h1s.length} <h1> elements`);

  let prev = 0;
  for (const h of r.headings) {
    if (prev && h.level > prev + 1) {
      add("LOW", r.route, `heading jumps h${prev} -> h${h.level} ("${h.text.slice(0, 40)}")`);
      break;
    }
    prev = h.level;
  }

  if (r.ldTypes.includes("PARSE_ERROR")) add("HIGH", r.route, "JSON-LD failed to parse");
  if (!r.ldTypes.length) add("MED", r.route, "no JSON-LD");
}

/* Alt text and valid JSON-LD matter whether or not a page is indexed. */
for (const r of rows) {
  if (r.imgNoAlt) add("HIGH", r.route, `${r.imgNoAlt} <img> without an alt attribute`);
  if (!r.viewport) add("HIGH", r.route, "missing viewport");
  if (!r.lang) add("HIGH", r.route, "missing <html lang>");
}

for (const [t, routes] of byTitle) if (routes.length > 1) add("HIGH", routes.join(", "), `duplicate title: "${t}"`);
for (const [d, routes] of byDesc) if (routes.length > 1) add("HIGH", routes.join(", "), `duplicate description: "${d.slice(0, 60)}…"`);

/* --- Report -------------------------------------------------------------- */
const order = { HIGH: 0, MED: 1, LOW: 2 };
problems.sort((a, b) => order[a.sev] - order[b.sev] || a.route.localeCompare(b.route));

console.log(`Audited ${rows.length} pages from out/  (${indexable.length} indexable, ${excluded.length} noindex)\n`);
if (excluded.length) console.log(`Excluded from indexing by their own robots meta: ${excluded.map((r) => r.route).join(", ")}\n`);
const counts = { HIGH: 0, MED: 0, LOW: 0 };
for (const p of problems) counts[p.sev]++;

if (!problems.length) console.log("No issues found.");
for (const p of problems) console.log(`  [${p.sev}] ${p.route}\n         ${p.msg}`);

console.log(`\nHIGH ${counts.HIGH}   MED ${counts.MED}   LOW ${counts.LOW}`);

const allTypes = [...new Set(rows.flatMap((r) => r.ldTypes))].sort();
console.log(`\nJSON-LD types present: ${allTypes.join(", ") || "none"}`);
const imgs = rows.reduce((a, r) => a + r.imgTotal, 0);
const noAlt = rows.reduce((a, r) => a + r.imgNoAlt, 0);
const empty = rows.reduce((a, r) => a + r.imgEmptyAlt, 0);
console.log(`Images: ${imgs} total, ${noAlt} missing alt, ${empty} decorative (alt="")`);

// A crude score so the before/after is comparable rather than a feeling.
const max = indexable.length * 12;
const lost = counts.HIGH * 6 + counts.MED * 2 + counts.LOW * 0.5;
console.log(`\nScore: ${Math.max(0, Math.round((1 - lost / max) * 100))}/100`);
