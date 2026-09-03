import { chromium } from "playwright";
import path from "node:path";

const OUT = "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad";
const BASE = process.env.BASE || "http://localhost:4311";

const targets = process.argv.slice(2);
if (!targets.length) targets.push("/:home");

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const errors = [];

const browser = await chromium.launch();
for (const [name, viewport] of Object.entries(viewports)) {
  if (process.env.ONLY && process.env.ONLY !== name) continue;
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    reducedMotion: process.env.MOTION === "on" ? "no-preference" : "reduce",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${name}] ${page.url()} :: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${name}] ${page.url()} :: ${e.message}`));

  for (const t of targets) {
    const [route, label = route.replace(/\W+/g, "-") || "home"] = t.split(":");
    await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(1200);
    // Walk the page so every lazy image and scroll reveal has fired.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.75;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const file = path.join(OUT, `${label}-${name}.png`);
    await page.screenshot({ path: file, fullPage: process.env.FULL === "1" });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();

if (errors.length) {
  console.log("\n--- CONSOLE ERRORS ---");
  for (const e of [...new Set(errors)]) console.log(e);
} else {
  console.log("\nno console errors");
}
