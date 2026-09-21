/** Desktop LCP, where the 1600 and 2200px renditions are actually served. */
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:4311";
const routes = ["/", "/about", "/services/bulk-earthworks", "/industries/mining", "/fleet"];
const b = await chromium.launch();
console.log("route".padEnd(30), "LCP".padStart(8), "  element");
for (const r of routes) {
  const c = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await c.newPage();
  const cdp = await c.newCDPSession(p);
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, downloadThroughput: (9 * 1024 * 1024) / 8,
    uploadThroughput: (1.5 * 1024 * 1024) / 8, latency: 85,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await p.addInitScript(() => {
    window.__lcp = null;
    new PerformanceObserver((l) => {
      const e = l.getEntries().at(-1);
      window.__lcp = { t: Math.round(e.startTime), url: (e.url || "").split("/").pop(), tag: e.element?.tagName };
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await p.goto(BASE + r, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(4000);
  const v = await p.evaluate(() => window.__lcp);
  console.log(r.padEnd(30), String(v?.t ?? "?").padStart(6) + "ms", ` ${v?.tag ?? ""} ${v?.url ?? ""}`);
  await c.close();
}
await b.close();
