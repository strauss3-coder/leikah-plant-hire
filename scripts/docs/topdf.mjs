/**
 * Renders a document fragment to a real A4 PDF, and reports any sheet that
 * would be clipped.
 *
 *   node scripts/docs/topdf.mjs <source.html> <output.pdf>
 *
 * preferCSSPageSize honours the document's own `@page { size:A4; margin:0 }`
 * instead of letting Chromium impose its default half-inch margins, which
 * would shrink every sheet and break the full-bleed dark covers.
 *
 * The fit check is not optional decoration. Each sheet is a fixed 297mm with
 * `overflow:hidden`, so content that runs long is silently cut off the bottom
 * rather than spilling onto a new page. Adding two sentences to a page is
 * enough to trigger it, so this refuses to write a PDF that would lose text.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error("usage: node scripts/docs/topdf.mjs <source.html> <output.pdf>");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve(SRC)).href, { waitUntil: "networkidle" });
// Archivo and Inter come from Google Fonts. Printing before they land would
// quietly fall back to Helvetica and lose the whole type treatment.
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });

const sheets = await page.locator("section.page").count();

const over = await page.evaluate(() => {
  const limit = 297 * (96 / 25.4);
  return [...document.querySelectorAll("section.page")]
    .map((el, i) => ({ sheet: i + 1, height: Math.round(el.scrollHeight) }))
    .filter((s) => s.height > limit + 2);
});

if (over.length) {
  console.error("Sheets exceed A4 and would be clipped:", JSON.stringify(over));
  await browser.close();
  process.exit(1);
}

await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();
console.log(`wrote ${OUT}: ${sheets} sheets, none clipped`);
