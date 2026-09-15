/**
 * Internal link integrity.
 *
 * Crawls every public route, collects every same-origin href, and requests each
 * one. A 404 reached from a real link is the most visible kind of unfinished
 * site, and the easiest to miss when routes are added.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4311";
const START = [
  "/", "/about", "/services", "/fleet", "/industries", "/projects",
  "/maintenance", "/supply", "/emergency", "/health-safety", "/gallery",
  "/careers", "/news", "/testimonials", "/faq", "/contact", "/quote",
  "/privacy", "/cookies", "/terms",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });

const found = new Map(); // href -> Set of pages linking to it

for (const route of START) {
  await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && !/^(https?:|mailto:|tel:|#|javascript:)/i.test(h)),
  );
  for (const h of hrefs) {
    const clean = h.split("#")[0] || "/";
    if (!found.has(clean)) found.set(clean, new Set());
    found.get(clean).add(route);
  }
}
await browser.close();

console.log(`${found.size} distinct internal links found across ${START.length} pages.`);

const broken = [];
for (const [href, sources] of found) {
  const url = BASE + (href.startsWith("/") ? href : `/${href}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) broken.push({ href, status: res.status, sources: [...sources] });
}

if (broken.length === 0) {
  console.log("No broken internal links.");
} else {
  console.log(`\n${broken.length} broken link(s):`);
  for (const b of broken) {
    console.log(`  ${b.status}  ${b.href}\n       linked from: ${b.sources.join(", ")}`);
  }
  process.exitCode = 1;
}
