import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const browser = await chromium.launch();
const report = { failures: [], passes: [] };
const ok = (name) => report.passes.push(name);
const fail = (name, why) => report.failures.push(name + " :: " + why);

// --- 1. 逐元素横向溢出检测（friends 页面，桌面 + 移动） ---
for (const vp of [{ w: 1280, h: 900 }, { w: 390, h: 844 }]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(base + "/friends", { waitUntil: "networkidle" });
  const over = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (st.position === "fixed" && st.visibility === "hidden") continue;
      if (r.right > window.innerWidth + 1 && r.width > 0) {
        bad.push(el.tagName + "." + String(el.className).slice(0, 60) + " right=" + Math.round(r.right));
      }
      if (r.left < -1 && r.width > 0 && st.position !== "fixed") {
        bad.push(el.tagName + " left-over=" + Math.round(r.left));
      }
    }
    return bad.slice(0, 10);
  });
  if (over.length) fail("friends-@" + vp.w + " 元素溢出", over.join(" | "));
  else ok("friends-@" + vp.w + " 无元素溢出");
  await page.close();
}

// --- 2. 主题切换：dropdown 选择深色 ---
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "切换主题" }).click();
  await page.getByRole("menuitem", { name: "深色模式" }).click();
  await page.waitForTimeout(300);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (isDark) ok("主题切换 -> dark class 生效");
  else fail("主题切换", "dark class 未生效");
  // 刷新保持
  await page.reload({ waitUntil: "networkidle" });
  const persists = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (persists) ok("主题持久化(localStorage)");
  else fail("主题持久化", "刷新后丢失");
  // 切回浅色
  await page.getByRole("button", { name: "切换主题" }).click();
  await page.getByRole("menuitem", { name: "浅色模式" }).click();
  const back = await page.evaluate(() => !document.documentElement.classList.contains("dark"));
  if (back) ok("切回浅色");
  else fail("切回浅色", "未生效");
  await page.close();
}

// --- 3. 搜索过滤 + 分页 ---
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/posts", { waitUntil: "networkidle" });
  const countBefore = await page.locator("article, [data-slot='card']").count();
  await page.getByPlaceholder("搜索文章标题、描述或内容…").fill("Cloudflare");
  await page.waitForTimeout(400);
  const cardsAfterSearch = await page.locator("a[href^='/posts/']").count();
  const hasPagination = await page.getByRole("navigation", { name: "pagination" }).count();
  // 清空搜索看分页
  await page.getByRole("button", { name: "清除搜索" }).click();
  await page.waitForTimeout(300);
  const paginationVisible = await page.getByRole("navigation", { name: "pagination" }).count();
  if (paginationVisible > 0) {
    ok("文章列表分页出现");
    const totalBtns = await page.locator("[data-slot='pagination-content'] button").count();
    if (totalBtns >= 4) ok("分页页数按钮渲染 (" + totalBtns + " 个)");
    else fail("分页按钮", "仅 " + totalBtns + " 个");
  } else {
    fail("分页", "搜索影响分页渲染");
  }
  // 标签过滤
  const tagBtns = await page.locator("button[data-slot='badge']").count();
  if (tagBtns > 0) ok("标签过滤按钮渲染 (" + tagBtns + " 个)");
  else fail("标签过滤", "无按钮");
  await page.close();
}

// --- 4. 移动端菜单 ---
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const hamburger = page.getByRole("button", { name: "菜单" });
  if (await hamburger.count()) {
    await hamburger.click();
    await page.waitForTimeout(300);
    const linkVisible = await page.getByRole("banner").getByRole("link", { name: "归档" }).isVisible();
    if (linkVisible) ok("移动端菜单展开可见");
    else fail("移动端菜单", "链接不可见");
  } else {
    fail("移动端菜单", "无汉堡按钮");
  }
  await page.close();
}

// --- 5. 复制按钮（首页无需, 友链页) ---
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/friends", { waitUntil: "networkidle" });
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
  const copyBtns = await page.getByRole("button", { name: "复制" }).count();
  if (copyBtns >= 5) ok("复制按钮渲染 (" + copyBtns + " 个)");
  else fail("复制按钮", "仅 " + copyBtns + " 个");
  // 点击第一个复制按钮并检查图标切换为 check
  await page.getByRole("button", { name: "复制" }).first().click();
  await page.waitForTimeout(200);
  const checkIcon = await page.locator(".lucide-check").count();
  if (checkIcon > 0) ok("复制后显示对勾反馈");
  else fail("复制反馈", "无对勾");
  await page.close();
}

// --- 6. 文章详情锚点 TOC & 代码高亮 ---
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + "/posts/kick-live-notify/", { waitUntil: "networkidle" });
  const toc = await page.locator("summary").count();
  const hljs = await page.locator(".hljs").count();
  if (toc > 0) ok("目录渲染 (" + toc + " 个)");
  else fail("目录", "未渲染");
  if (hljs > 0) ok("代码高亮渲染 (" + hljs + " 个)");
  else fail("代码高亮", "无 .hljs");
  const mdTables = await page.locator(".markdown table").count();
  await page.close();
}

// --- 7. 各处 shadcn 组件存在性 ---
{
  const checks = [
    ["/", "data-slot='card'", 1],
    ["/posts", "data-slot='input'", 1],
    ["/archive", "data-slot='badge'", 1],
    ["/about", "data-slot='avatar'", 1],
    ["/admin", "data-slot='card'", 1],
    ["/posts/kick-live-notify/", "data-slot='card'", 1],
  ];
  for (const [path, sel, min] of checks) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(base + path, { waitUntil: "networkidle" });
    const n = await page.locator(sel === "data-slot='card'" ? "[data-slot='card']" : (sel.startsWith("data-slot") ? "[" + sel + "]" : sel)).count();
    if (n >= min) ok(path + " 组件渲染 (" + n + ")");
    else fail(path + " 组件", sel + " 数量=" + n);
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
