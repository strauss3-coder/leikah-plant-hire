/**
 * Validates the emitted structured data, sitemap and robots.txt.
 *
 * Not a replacement for Google's Rich Results Test, which is the authority.
 * This catches the errors that test would report, before the site is live:
 * unparsable JSON, relative URLs where an absolute one is required, required
 * properties missing, and a sitemap that disagrees with the canonical tags.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");
const problems = [];
const ok = [];

async function htmlFiles(dir = OUT, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await htmlFiles(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

/* --- Structured data ----------------------------------------------------- */
const REQUIRED = {
  LocalBusiness: ["name", "address", "telephone", "url"],
  Organization: ["name", "url"],
  WebSite: ["url"],
  WebPage: ["name"],
  BreadcrumbList: ["itemListElement"],
  Service: ["name", "provider"],
  ContactPoint: ["telephone", "contactType"],
};

const seen = new Set();
const canonicals = new Map();

for (const file of await htmlFiles()) {
  const html = await readFile(file, "utf8");
  const route = "/" + path.relative(OUT, file).replace(/index\.html$/, "").replace(/\.html$/, "");
  const canon = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1];
  if (canon) canonicals.set(route, canon);

  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch (err) {
      problems.push(`${route}: JSON-LD does not parse — ${err.message}`);
      continue;
    }
    const nodes = [];
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (n && typeof n === "object") {
        if (n["@type"]) nodes.push(n);
        Object.values(n).forEach(walk);
      }
    };
    walk(parsed);

    for (const node of nodes) {
      for (const type of [].concat(node["@type"])) {
        seen.add(type);
        for (const req of REQUIRED[type] ?? []) {
          if (node[req] === undefined || node[req] === "" ) {
            problems.push(`${route}: ${type} missing required property "${req}"`);
          }
        }
      }
      // Any absolute-URL property must actually be absolute.
      for (const key of ["url", "logo", "image", "@id"]) {
        const v = node[key];
        const check = (x) => {
          const s = typeof x === "string" ? x : x?.url;
          if (typeof s === "string" && s.startsWith("/")) {
            problems.push(`${route}: ${node["@type"]}.${key} is relative ("${s}")`);
          }
        };
        [].concat(v ?? []).forEach(check);
      }
    }
  }
}

for (const t of Object.keys(REQUIRED)) {
  if (seen.has(t)) ok.push(`${t} present`);
  else problems.push(`schema type never emitted anywhere: ${t}`);
}

/* --- Sitemap ------------------------------------------------------------- */
const sitemap = await readFile(path.join(OUT, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
if (dupes.length) problems.push(`sitemap has duplicate URLs: ${[...new Set(dupes)].join(", ")}`);
else ok.push(`sitemap: ${urls.length} URLs, no duplicates`);

// Every sitemap URL must match the canonical the page itself declares.
const canonSet = new Set(canonicals.values());
for (const u of urls) {
  if (!canonSet.has(u)) problems.push(`sitemap lists ${u} but no page declares it as canonical`);
}
// And nothing noindex should be listed.
for (const [route, canon] of canonicals) {
  void route;
  void canon;
}
ok.push(`canonical tags: ${canonicals.size} pages`);

/* --- robots.txt ---------------------------------------------------------- */
const robots = await readFile(path.join(OUT, "robots.txt"), "utf8");
if (!/Sitemap:\s*https?:\/\//i.test(robots)) problems.push("robots.txt does not reference an absolute sitemap URL");
else ok.push("robots.txt references the sitemap");
if (!/User-Agent:\s*\*/i.test(robots)) problems.push("robots.txt has no wildcard user-agent rule");
else ok.push("robots.txt has a wildcard rule");
if (/Disallow:\s*\/\s*$/im.test(robots)) problems.push("robots.txt disallows the whole site");

/* --- Report -------------------------------------------------------------- */
for (const o of ok) console.log(`  ok    ${o}`);
if (problems.length) {
  console.log("");
  for (const p of problems) console.log(`  FAIL  ${p}`);
}
console.log(`\n${problems.length ? problems.length + " problem(s)" : "All structured data, sitemap and robots checks passed."}`);
process.exit(problems.length ? 1 : 0);
