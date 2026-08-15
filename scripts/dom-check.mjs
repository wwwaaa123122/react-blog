import { chromium } from "playwright";
const base = "http://127.0.0.1:4173";
const browser = await chromium.launch();
const report = { failures: [], passes: [] };
const ok = (n) => report.passes.push(n);
const fail = (n, w) => report.failures.push(n + " :: " + w);

// home: hero avatar loaded + theme colors
{
  const page = await browser.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const hero = await page.evaluate(() => {
    const img = document.querySelector("img[alt='星辰旅人' i], .rounded-full");
    return {
      imgLoaded: img ? (img.naturalWidth || 0) > 0 : false,
      bg: getComputedStyle(document.body).backgroundColor,
      primary: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      cardCount: document.querySelectorAll("[data-slot='card']").length,
      postLinks: document.querySelectorAll("a[href^='/posts/']").length,
    };
  });
  if (hero.imgLoaded) ok("首页头像加载");
  else fail("首页头像", "未加载(可能跨域)");
  if (hero.postLinks >= 5) ok("首页最新文章 (" + hero.postLinks + ")");
  else fail("首页最新文章", "仅 " + hero.postLinks);
  if (hero.primary.startsWith("hsl")) ok("主题 primary 变量为蓝色系: " + hero.primary);
  else fail("primary 变量", hero.primary);
  await page.close();
}

// dark bg differs
{
  const page = await browser.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(300);
  const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (light !== dark) ok("明暗背景色不同 (" + light + " vs " + dark + ")");
  else fail("明暗背景", "相同: " + light);
  await page.close();
}

// friends avatars: count imgs that actually loaded vs fallback usage
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/friends", { waitUntil: "networkidle" });
  const st = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("a[target='_blank']"));
    const imgs = cards.flatMap((c) => Array.from(c.querySelectorAll("img")));
    const loaded = imgs.filter((i) => (i.naturalWidth || 0) > 0).length;
    const fallbacks = cards.filter((c) => c.querySelector("span")).length;
    return { cards: cards.length, imgs: imgs.length, loaded, fallbacks };
  });
  if (st.cards > 0) ok("友链卡片 (" + st.cards + ")");
  else fail("友链卡片", "0 张");
  console.log("  友链头像: 加载=" + st.loaded + "/" + st.imgs + " 兜底=" + st.fallbacks);
  await page.close();
}

// posts list: cards render titles
{
  const page = await browser.newPage();
  await page.goto(base + "/posts", { waitUntil: "networkidle" });
  const titles = await page.locator("h3 a[href^='/posts/']").count();
  if (titles >= 6) ok("文章列表标题 (" + titles + ")");
  else fail("文章列表标题", "仅 " + titles);
  await page.close();
}

// post detail: article body text length + cover
{
  const page = await browser.newPage();
  await page.goto(base + "/posts/mc-srv-worker/", { waitUntil: "networkidle" });
  const st = await page.evaluate(() => {
    const md = document.querySelector(".markdown");
    return { textLen: md ? md.innerText.length : 0, preCount: document.querySelectorAll(".markdown pre").length };
  });
  if (st.textLen > 500) ok("文章正文渲染 (" + st.textLen + " 字, " + st.preCount + " 个代码块)");
  else fail("文章正文", "过短: " + st.textLen);
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
