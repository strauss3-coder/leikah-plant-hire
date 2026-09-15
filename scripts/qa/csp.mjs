/**
 * Content Security Policy verification.
 *
 * The audit harness bypasses CSP so it can inject axe. This one does the
 * opposite: it loads every route with the policy fully enforced and fails on
 * any violation, any console error, or any request the policy blocked.
 *
 * A CSP that silently breaks a page is worse than no CSP, so this runs on the
 * production server build rather than in dev.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4311";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/bulk-earthworks",
  "/fleet",
  "/industries",
  "/projects",
  "/projects/mining-excavator-field-repair",
  "/gallery",
  "/emergency",
  "/contact",
  "/quote",
  "/careers",
  "/faq",
  "/privacy",
  "/cookies",
  "/terms",
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();

const problems = [];

page.on("console", (msg) => {
  if (msg.type() !== "error") return;
  problems.push({ route: page.url(), kind: "console", detail: msg.text() });
});
page.on("pageerror", (err) => {
  problems.push({ route: page.url(), kind: "pageerror", detail: String(err) });
});
page.on("requestfailed", (req) => {
  const failure = req.failure()?.errorText ?? "";
  // Only surface failures the policy caused, not an aborted prefetch.
  if (/blocked|csp/i.test(failure)) {
    problems.push({ route: page.url(), kind: "blocked", detail: `${req.url()} — ${failure}` });
  }
});

let headerSeen = null;

for (const route of ROUTES) {
  const response = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
  headerSeen ??= response?.headers()["content-security-policy"] ?? null;
  // Give hydration and any deferred work a chance to trip the policy.
  await page.waitForTimeout(900);
  process.stdout.write(`  checked ${route}\n`);
}

await browser.close();

console.log("\nCSP header served:");
console.log(headerSeen ? `  ${headerSeen}` : "  (none — is this the server build?)");

if (problems.length === 0) {
  console.log("\nNo CSP violations, console errors or blocked requests across "
    + `${ROUTES.length} routes.`);
} else {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  [${p.kind}] ${p.route}\n    ${p.detail}`);
  process.exitCode = 1;
}
