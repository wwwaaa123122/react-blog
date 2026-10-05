/**
 * 全站 smoke test（Playwright）：对构建产物（默认 dist/ 经 preview 服务）逐页检查。
 *
 * 检查项（goal.txt 规划⑤）：
 *  - 页面 HTTP 200、title 存在
 *  - h1 有且仅有 1 个
 *  - canonical / description 存在
 *  - 无 console error / pageerror
 *  - 图片均有 alt、无损坏图片
 *  - 内部链接不返回 404
 *
 * 用法：先启动任意静态服务（pnpm preview），再：
 *   node scripts/smoke-test.mjs [baseURL]   # 默认 http://localhost:4173
 */
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:4173";
const routes = ["/", "/posts", "/archive", "/about", "/friends", "/posts/not-exist-slug"];

const results = [];
let failures = 0;

const browser = await chromium.launch();
const page = await browser.newPage();

for (const route of routes) {
  const errors = [];
  const onConsole = (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 150));
  };
  const onPageError = (e) => errors.push("pageerror: " + e.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const checks = {};
  try {
    const resp = await page.goto(base + route, { waitUntil: "networkidle" });
    checks["HTTP 200"] = resp?.status() === 200;
    checks["title 存在"] = !!(await page.title());
    checks["h1 恰好 1 个"] = (await page.locator("h1").count()) === 1;
    checks["canonical 存在"] = (await page.locator('link[rel="canonical"]').count()) > 0;
    checks["description 存在"] =
      (await page.locator('meta[name="description"]').count()) > 0;
    checks["图片均有 alt"] =
      await page.evaluate(() => [...document.images].every((i) => i.hasAttribute("alt")));
    checks["无损坏图片"] = await page.evaluate(
      () => [...document.images].every((i) => i.complete && i.naturalWidth > 0)
    );

    // 内部链接抽查（最多 10 条）：fetch 不跟随 SPA，直接 HEAD
    const internalHrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')]
        .map((a) => a.getAttribute("href").split("#")[0])
        .filter((h) => h && !h.startsWith("//"))
    );
    const sample = [...new Set(internalHrefs)].slice(0, 10);
    const dead = [];
    for (const h of sample) {
      const r = await page.request.get(base + h);
      if (r.status() >= 400) dead.push(`${h}:${r.status()}`);
    }
    checks["内部链接无 404"] = dead.length === 0;
    if (dead.length) errors.push("dead links: " + dead.join(", "));
  } catch (e) {
    checks["页面可达"] = false;
    errors.push("nav: " + e.message.slice(0, 150));
  }
  checks["无 console/page 错误"] = errors.length === 0;

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  const failed = Object.entries(checks).filter(([, v]) => !v);
  failures += failed.length;
  results.push({ route, pass: failed.length === 0, failed: failed.map(([k]) => k), errors });
}

await browser.close();

for (const r of results) {
  console.log(`${r.pass ? "✓" : "✗"} ${r.route}${r.failed.length ? " — " + r.failed.join("; ") : ""}`);
  r.errors.slice(0, 5).forEach((e) => console.log("   ", e));
}
console.log(failures === 0 ? "\nsmoke test 全部通过" : `\nsmoke test 失败 ${failures} 项`);
process.exit(failures === 0 ? 0 : 1);
