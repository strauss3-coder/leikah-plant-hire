/**
 * Captures a single element (by selector or nth section) at device resolution,
 * so section-level design decisions can be judged at real size rather than in a
 * thumbnail of the whole page.
 *
 * Usage: node scripts/qa/section.mjs <route> <selector-or-index> <label>
 */
import { chromium } from "playwright";
import path from "node:path";

const OUT =
  "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad";
const BASE = process.env.BASE || "http://localhost:4311";

const [route, target, label = "section"] = process.argv.slice(2);
const width = Number(process.env.W || 1440);
const height = Number(process.env.H || 900);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1000);

// Reveal animations only fire in view, so walk the page before capturing.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(600);

const locator = /^\d+$/.test(target)
  ? page.locator("main section").nth(Number(target))
  : page.locator(target).first();

await locator.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const file = path.join(OUT, `${label}.png`);
await locator.screenshot({ path: file });
console.log(file);

await browser.close();
