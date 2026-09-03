/**
 * Measures the field metrics that actually matter — LCP, CLS and the time to
 * first render — under a throttled connection, because the audience for this
 * site is often on a phone at a mine gate rather than on office fibre.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4311";
const ROUTES = ["/", "/services", "/services/engine-overhauls", "/projects", "/gallery", "/quote", "/contact"];

const browser = await chromium.launch();
const rows = [];

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();

  // Regular 4G: ~9 Mbps down, 170 ms RTT, plus a 4x CPU slowdown.
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (9 * 1024 * 1024) / 8,
    uploadThroughput: (1.5 * 1024 * 1024) / 8,
    latency: 170,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__vitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3500);
  // A scroll settles any shift that only happens once content enters view.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await page.waitForTimeout(1200);

  const v = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      lcp: Math.round(window.__vitals.lcp),
      cls: Number(window.__vitals.cls.toFixed(4)),
      fcp: Math.round(fcp?.startTime ?? 0),
      ttfb: Math.round(nav?.responseStart ?? 0),
    };
  });

  rows.push({ route, ...v });
  await context.close();
}

await browser.close();

const verdict = (metric, value) => {
  const limits = { lcp: [2500, 4000], cls: [0.1, 0.25], fcp: [1800, 3000] };
  const [good, poor] = limits[metric];
  return value <= good ? "good" : value <= poor ? "needs work" : "poor";
};

console.log("route                              TTFB    FCP    LCP     CLS");
console.log("-".repeat(68));
for (const r of rows) {
  console.log(
    `${r.route.padEnd(34)}${String(r.ttfb).padStart(4)}ms ${String(r.fcp).padStart(5)}ms ` +
      `${String(r.lcp).padStart(5)}ms  ${String(r.cls).padStart(6)}   ` +
      `${verdict("lcp", r.lcp)} / ${verdict("cls", r.cls)}`,
  );
}

const worstLcp = Math.max(...rows.map((r) => r.lcp));
const worstCls = Math.max(...rows.map((r) => r.cls));
console.log(`\nworst LCP ${worstLcp}ms (${verdict("lcp", worstLcp)}), worst CLS ${worstCls} (${verdict("cls", worstCls)})`);
console.log("Emulated: 4G, 4x CPU slowdown, 390px viewport.");
