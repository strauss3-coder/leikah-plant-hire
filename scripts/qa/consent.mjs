/**
 * Cookie consent behaviour.
 *
 * The banner is the one piece of the site that must behave correctly for a
 * first-time visitor, a returning visitor and a keyboard-only visitor, and it
 * is the one piece that is invisible to a normal page audit once dismissed.
 * Every assertion below is a legal or accessibility requirement, not a nicety.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4311";
const AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  process.stdout.write(`  ${pass ? "pass" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}\n`);
};

const browser = await chromium.launch();

async function freshPage() {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
    bypassCSP: true,
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

const readStore = (page) =>
  page.evaluate(() => {
    try {
      const raw = localStorage.getItem("leikah:cookie-consent");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return "blocked";
    }
  });

/* --- 1. First visit shows the banner ------------------------------------ */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const banner = page.getByRole("region", { name: "Cookie consent" });
  await banner.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
  check("banner appears on a first visit", await banner.isVisible());
  check("nothing stored before a choice is made", (await readStore(page)) === null);

  // axe over the banner itself.
  await page.addScriptTag({ url: AXE });
  const res = await page.evaluate(async () =>
    (await axe.run(document.querySelector('[aria-label="Cookie consent"]'), {
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
    })).violations.map((v) => v.id),
  );
  check("banner has no axe violations", res.length === 0, res.join(", "));
  await ctx.close();
}

/* --- 2. Accept all records both categories and dismisses ----------------- */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Accept all cookies" }).click();
  await page.waitForTimeout(600);
  const stored = await readStore(page);
  check("accept all dismisses the banner",
    !(await page.getByRole("region", { name: "Cookie consent" }).isVisible()));
  check("accept all records analytics + functional",
    stored?.analytics === true && stored?.functional === true, JSON.stringify(stored));
  check("a decision timestamp is recorded", Boolean(stored?.decidedAt));

  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(900);
  check("banner does not return after reload",
    !(await page.getByRole("region", { name: "Cookie consent" }).isVisible()));

  await page.goto(BASE + "/contact", { waitUntil: "load" });
  await page.waitForTimeout(700);
  check("banner does not return on another page",
    !(await page.getByRole("region", { name: "Cookie consent" }).isVisible()));
  await ctx.close();
}

/* --- 3. Reject optional records false, not absent ------------------------ */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Reject optional cookies" }).click();
  await page.waitForTimeout(600);
  const stored = await readStore(page);
  check("reject records an explicit refusal",
    stored?.analytics === false && stored?.functional === false, JSON.stringify(stored));
  check("reject dismisses the banner",
    !(await page.getByRole("region", { name: "Cookie consent" }).isVisible()));
  await ctx.close();
}

/* --- 4. Preferences dialog: keyboard, focus trap, escape ----------------- */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Manage preferences" }).click();

  const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  check("preferences dialog opens", await dialog.isVisible());
  check("dialog is marked modal",
    (await dialog.getAttribute("aria-modal")) === "true");

  const essential = page.locator("#cookie-cat-essential");
  check("essential is checked and locked",
    (await essential.isChecked()) && (await essential.isDisabled()));

  // Tab right around the dialog and confirm focus never escapes it.
  let escaped = false;
  for (let i = 0; i < 24; i += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d ? d.contains(document.activeElement) : false;
    });
    if (!inside) { escaped = true; break; }
  }
  check("focus stays trapped inside the dialog", !escaped);

  await page.locator("#cookie-cat-analytics").check();
  await page.getByRole("button", { name: "Save my preferences" }).click();
  await page.waitForTimeout(600);
  const stored = await readStore(page);
  check("per-category choice is saved",
    stored?.analytics === true && stored?.functional === false, JSON.stringify(stored));
  await ctx.close();
}

/* --- 5. Escape closes without saving ------------------------------------- */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Manage preferences" }).click();
  await page.getByRole("dialog", { name: "Cookie preferences" }).waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  check("escape closes the dialog",
    !(await page.getByRole("dialog", { name: "Cookie preferences" }).isVisible()));
  check("escape saves nothing", (await readStore(page)) === null);
  await ctx.close();
}

/* --- 6. Footer link reopens preferences after a decision ----------------- */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Accept all cookies" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Cookie preferences" }).click();
  await page.waitForTimeout(600);
  check("footer link reopens preferences after a decision",
    await page.getByRole("dialog", { name: "Cookie preferences" }).isVisible());
  await ctx.close();
}

/* --- 7. The cookie policy page reflects and can change the choice -------- */
{
  const { ctx, page } = await freshPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Accept all cookies" }).click();
  await page.waitForTimeout(500);
  await page.goto(BASE + "/cookies", { waitUntil: "load" });
  await page.waitForTimeout(900);
  const text = await page.locator("#your-choice").innerText();
  check("policy page shows the recorded choice", /You made a choice on/i.test(text));
  check("policy page shows allowed categories", (text.match(/Allowed/gi) || []).length >= 2, text.slice(0, 80));

  await page.getByRole("button", { name: "Clear my saved choice" }).click();
  await page.waitForTimeout(700);
  check("clearing the choice brings the banner back",
    await page.getByRole("region", { name: "Cookie consent" }).isVisible());
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} consent checks passed`);
if (failed.length) process.exitCode = 1;
