/**
 * Drives the interactive surfaces the way a visitor would, so a broken filter
 * or a form that silently fails is caught before a client finds it.
 *
 * Run against a built server: npm run start -- -p 4311, then node this file.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4311";
const results = [];
const consoleErrors = [];

function check(name, passed, detail = "") {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch();

/* --- Desktop ------------------------------------------------------------- */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${page.url()} :: ${m.text()}`));
page.on("pageerror", (e) => consoleErrors.push(`${page.url()} :: ${e.message}`));

/* Header mega menu */
await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.getByRole("button", { name: "Services" }).hover();
await page.waitForTimeout(400);
check(
  "Header services panel opens on hover",
  await page.getByRole("link", { name: /Heavy Diesel Engine Overhauls/ }).first().isVisible(),
);

/* Service filter */
await page.goto(`${BASE}/services`, { waitUntil: "load" });
const allCount = await page.locator("a[href^='/services/']").count();
await page.getByRole("button", { name: /Supply Division/ }).click();
await page.waitForTimeout(600);
const supplyCount = await page.locator("a[href^='/services/']").count();
check(
  "Service division filter narrows the grid",
  supplyCount < allCount && supplyCount > 0,
  `all=${allCount} supply=${supplyCount}`,
);

/* Deep link into a filtered division */
await page.goto(`${BASE}/services?division=earthmoving`, { waitUntil: "load" });
await page.waitForTimeout(400);
check(
  "?division= deep link preselects the filter",
  (await page.getByRole("button", { name: /Earthmoving & Plant Hire/ }).getAttribute("aria-pressed")) === "true",
);

/* FAQ search + accordion */
await page.goto(`${BASE}/faq`, { waitUntil: "load" });
await page.getByPlaceholder("Search questions").fill("warranty");
await page.waitForTimeout(400);
const faqAccordion = page.locator("main h3 > button[aria-expanded]");
const faqMatches = await faqAccordion.count();
check("FAQ search filters the list", faqMatches > 0 && faqMatches < 24, `${faqMatches} matches`);

const firstFaq = faqAccordion.first();
const wasOpen = (await firstFaq.getAttribute("aria-expanded")) === "true";
await firstFaq.click();
await page.waitForTimeout(400);
check(
  "FAQ accordion toggles",
  ((await firstFaq.getAttribute("aria-expanded")) === "true") !== wasOpen,
);

/* Gallery filter + lightbox */
await page.goto(`${BASE}/gallery`, { waitUntil: "load" });
const tiles = await page.locator("ul li button").count();
await page.getByRole("button", { name: /^Workshop/ }).click();
await page.waitForTimeout(600);
const workshopTiles = await page.locator("ul li button").count();
check(
  "Gallery category filter works",
  workshopTiles > 0 && workshopTiles < tiles,
  `all=${tiles} workshop=${workshopTiles}`,
);

await page.locator("ul li button").first().click();
await page.waitForTimeout(500);
const dialog = page.getByRole("dialog");
check("Gallery lightbox opens", await dialog.isVisible());

await page.keyboard.press("ArrowRight");
await page.waitForTimeout(300);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
check("Lightbox closes on Escape", !(await dialog.isVisible().catch(() => false)));

/* Quote workflow, end to end */
await page.goto(`${BASE}/quote`, { waitUntil: "load" });
await page.getByText("Plant Hire — Wet & Dry", { exact: false }).first().click();
await page.selectOption("select", "mining");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(500);
check("Quote step 1 advances when valid", await page.getByRole("textbox", { name: "Site or town" }).isVisible());

await page.getByRole("textbox", { name: "Site or town" }).fill("Coal operation, Hendrina");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(500);
await page
  .getByRole("textbox", { name: "Describe the work" })
  .fill(
    "Bell B40D, fleet number A20. Loses drive under load in third and fourth. Oil sample last month showed rising iron content.",
  );
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(500);
check("Quote reaches the contact step", await page.getByRole("textbox", { name: "Company" }).isVisible());

/* Validation must actually stop an incomplete submission */
await page.getByRole("button", { name: "Send the request" }).click();
await page.waitForTimeout(600);
check(
  "Quote form blocks submission with missing fields",
  await page.getByText("Company name is required").isVisible(),
);

await page.getByRole("textbox", { name: "Company" }).fill("Test Mining Co");
await page.getByRole("textbox", { name: "Your name" }).fill("Sam Nkosi");
await page.getByRole("textbox", { name: "Email" }).fill("sam@example.com");
await page.getByRole("textbox", { name: "Contact number" }).fill("060 976 3429");
await page.getByText("I confirm that Leikah Plant Hire may contact me").click();
await page.getByRole("button", { name: "Send the request" }).click();
await page.waitForTimeout(2500);
check(
  "Quote submits and returns a reference",
  await page.getByText("Request received").isVisible(),
);
const reference = await page.locator("text=/LKH-QT-/").first().textContent().catch(() => null);
check("Reference number generated", Boolean(reference), reference ?? "");

/* Contact form validation */
await page.goto(`${BASE}/contact`, { waitUntil: "load" });
await page.getByRole("button", { name: "Send the message" }).click();
await page.waitForTimeout(800);
check(
  "Contact form validates before sending",
  await page.getByText("Please give us a name").isVisible(),
);

/* Before/after slider on a project */
await page.goto(`${BASE}/projects/engine-overhaul-shutdown-turnaround`, { waitUntil: "load" });
await page.waitForTimeout(600);
const slider = page.getByLabel("Reveal the before or after image").first();
check("Before/after comparison present", await slider.count() > 0);
if (await slider.count()) {
  await slider.fill("20");
  await page.waitForTimeout(300);
  check("Before/after slider is keyboard operable", (await slider.inputValue()) === "20");
}

await desktop.close();

/* --- Mobile --------------------------------------------------------------- */
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await mobile.newPage();
m.on("pageerror", (e) => consoleErrors.push(`mobile ${m.url()} :: ${e.message}`));

await m.goto(`${BASE}/`, { waitUntil: "load" });
await m.getByRole("button", { name: "Open menu" }).click();
await m.waitForTimeout(600);
check("Mobile menu opens", await m.locator("#mobile-nav").isVisible());

await m.getByRole("button", { name: "Services" }).click();
await m.waitForTimeout(600);
check(
  "Mobile menu accordion expands",
  await m.locator("#mobile-nav").getByRole("link", { name: /All services/ }).isVisible(),
);

await m.getByRole("button", { name: "Close menu" }).click();
await m.waitForTimeout(500);
check("Mobile menu closes", !(await m.locator("#mobile-nav").isVisible().catch(() => false)));

/* No horizontal overflow anywhere on mobile — the classic responsive failure */
const overflowing = [];
for (const route of ["/", "/services", "/services/plant-hire", "/projects", "/gallery", "/quote", "/contact", "/health-safety", "/faq"]) {
  await m.goto(BASE + route, { waitUntil: "load" });
  await m.waitForTimeout(500);
  const scrollW = await m.evaluate(() => document.documentElement.scrollWidth);
  const clientW = await m.evaluate(() => document.documentElement.clientWidth);
  if (scrollW > clientW + 1) overflowing.push(`${route} (${scrollW} > ${clientW})`);
}
check("No horizontal overflow on mobile", overflowing.length === 0, overflowing.join(", "));

await mobile.close();
await browser.close();

/* --- Summary --------------------------------------------------------------- */
const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);

if (consoleErrors.length) {
  console.log("\nConsole errors:");
  for (const e of [...new Set(consoleErrors)]) console.log(`  ${e}`);
}

process.exit(failed.length ? 1 : 0);
