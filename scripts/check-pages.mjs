import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = "http://127.0.0.1:4173";
const outDir = "artifacts/screens";
mkdirSync(outDir, { recursive: true });

const routes = [
  ["home", "/"],
  ["posts", "/posts"],
  ["archive", "/archive"],
  ["friends", "/friends"],
  ["about", "/about"],
  ["post-detail", "/posts/kick-live-notify/"],
  ["404", "/definitely-not-a-page"],
];

const browser = await chromium.launch();
const report = { errors: [], overflow: [], screens: [] };

async function checkPage(name, path, viewport, theme) {
  const page = await browser.newPage({ viewport });
  page.on("console", (m) => {
    if (m.type() === "error") report.errors.push(name + "/" + theme + " console: " + m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => report.errors.push(name + "/" + theme + " pageerror: " + String(e).slice(0, 300)));
  await page.goto(base + path, { waitUntil: "networkidle" });
  if (theme === "dark") {
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(250);
  }
  // horizontal overflow detection: body vs viewport
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const max = Math.max(doc.scrollWidth, body.scrollWidth);
    return { over: max - window.innerWidth, scrollWidth: max, innerWidth: window.innerWidth };
  });
  if (overflow.over > 1) {
    report.overflow.push(name + "/" + theme + " 横向溢出 " + overflow.over + "px (scrollWidth=" + overflow.scrollWidth + ", vw=" + overflow.innerWidth + ")");
  }
  const shot = outDir + "/" + name + "-" + theme + ".png";
  await page.screenshot({ path: shot, fullPage: true });
  report.screens.push(shot);
  await page.close();
}

for (const [name, path] of routes) {
  await checkPage(name, path, { width: 1280, height: 900 }, "light");
  await checkPage(name, path, { width: 1280, height: 900 }, "dark");
}

// mobile viewport for key pages (friends wrap check)
for (const [name, path] of [["friends-m", "/friends"], ["home-m", "/"], ["posts-m", "/posts"], ["post-m", "/posts/fuwari-rss/"]]) {
  await checkPage(name, path, { width: 390, height: 844 }, "light");
  await checkPage(name, path, { width: 390, height: 844 }, "dark");
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
