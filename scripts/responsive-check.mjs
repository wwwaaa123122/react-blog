import { chromium } from "playwright";
const base = "http://127.0.0.1:4173";
const browser = await chromium.launch();
const report = { failures: [], passes: [] };
const ok = (n) => report.passes.push(n);
const fail = (n, w) => report.failures.push(n + " :: " + w);

const breakpoints = [
  { w: 320, h: 568, label: "320px" },
  { w: 375, h: 667, label: "375px" },
  { w: 390, h: 844, label: "390px" },
  { w: 430, h: 932, label: "430px" },
  { w: 768, h: 1024, label: "768px" },
  { w: 1024, h: 768, label: "1024px" },
  { w: 1280, h: 800, label: "1280px" },
  { w: 1440, h: 900, label: "1440px" },
];

const routes = ["/", "/posts", "/posts/kick-live-notify/", "/archive", "/friends", "/about", "/definitely-not-found"];

for (const bp of breakpoints) {
  for (const path of routes) {
    const page = await browser.newPage({ viewport: { width: bp.w, height: bp.h } });
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 15000 });
      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const max = Math.max(doc.scrollWidth, body.scrollWidth);
        return { over: max - window.innerWidth, scrollWidth: max, innerWidth: window.innerWidth };
      });
      if (overflow.over > 1) {
        fail(bp.label + " " + path, "横向溢出 " + overflow.over + "px");
      } else {
        ok(bp.label + " " + path + " ✓");
      }
      // Check console errors
      page.on("console", (msg) => {
        if (msg.type() === "error") fail(bp.label + " " + path, "console error: " + msg.text().slice(0, 100));
      });
      page.on("pageerror", (e) => fail(bp.label + " " + path, "pageerror: " + String(e).slice(0, 100)));
    } catch (e) {
      fail(bp.label + " " + path, "load error: " + String(e).slice(0, 100));
    }
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
