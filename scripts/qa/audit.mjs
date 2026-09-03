/**
 * Accessibility and page-weight audit across every public route.
 *
 * Uses axe-core from the CDN inside the page. Checks the things that actually
 * break a site for real users — contrast, labels, headings, landmarks, alt
 * text — rather than producing a score.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:4311";
const AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/bulk-earthworks",
  "/services/engine-overhauls",
  "/industries",
  "/industries/mining",
  "/projects",
  "/projects/mining-excavator-field-repair",
  "/maintenance",
  "/supply",
  "/emergency",
  "/health-safety",
  "/gallery",
  "/careers",
  "/news",
  "/news/what-an-honest-strip-report-contains",
  "/testimonials",
  "/faq",
  "/contact",
  "/quote",
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();

const violations = [];
const weights = [];

for (const route of ROUTES) {
  let bytes = 0;
  const onResponse = async (res) => {
    try {
      const len = Number(res.headers()["content-length"] ?? 0);
      bytes += len;
    } catch {
      /* opaque response — not counted */
    }
  };
  page.on("response", onResponse);

  await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1200);
  page.off("response", onResponse);

  await page.addScriptTag({ url: AXE });
  const result = await page.evaluate(async () => {
    // @ts-expect-error injected at runtime
    return await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
  });

  const serious = result.violations.filter((v) =>
    ["critical", "serious", "moderate"].includes(v.impact),
  );

  weights.push({ route, kb: Math.round(bytes / 1024) });

  if (serious.length) {
    violations.push({ route, issues: serious });
    console.log(`\n${route}`);
    for (const issue of serious) {
      console.log(`  [${issue.impact}] ${issue.id} — ${issue.help} (${issue.nodes.length})`);
      for (const node of issue.nodes.slice(0, 3)) {
        console.log(`      ${node.target.join(" ")}`);
        const summary = (node.failureSummary ?? "").split("\n").filter(Boolean)[1];
        if (summary) console.log(`      ${summary.trim()}`);
      }
    }
  } else {
    console.log(`clean  ${route}`);
  }
}

await browser.close();

console.log("\n--- Initial page weight (uncompressed content-length) ---");
for (const w of weights.sort((a, b) => b.kb - a.kb).slice(0, 8)) {
  console.log(`  ${String(w.kb).padStart(5)} KB  ${w.route}`);
}

const total = violations.reduce((n, v) => n + v.issues.length, 0);
console.log(`\n${total} accessibility issue type(s) across ${violations.length} route(s)`);

writeFileSync(
  "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad/a11y.json",
  JSON.stringify({ violations, weights }, null, 2),
);

process.exit(total ? 1 : 0);
