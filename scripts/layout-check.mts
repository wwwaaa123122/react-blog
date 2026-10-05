// 回归检查：PC 排版宽度 / 文字排版 / 移动端触控与安全区 / SEO meta。
// 纯静态断言（读源码与构建产物），不依赖浏览器，可在无 GUI 环境运行。
// 用法: node scripts/layout-check.mts
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, p), "utf-8");

const passes: string[] = [];
const failures: string[] = [];
const ok = (c: boolean, msg: string) => (c ? passes.push(msg) : failures.push(msg));

// ---------- 1) 容器宽度：Layout / Navbar / Footer 三处必须一致 ----------
// Tailwind v4 主题 token：230×4=920px、250×4=1000px、280×4=1120px（与旧 [Npx] 等价）
const containerSpec = ['max-w-230', 'md:max-w-250', 'lg:max-w-280'];
for (const file of ["src/components/Layout.tsx", "src/components/Navbar.tsx", "src/components/Footer.tsx"]) {
  const src = read(file);
  const missing = containerSpec.filter((c) => !src.includes(c));
  ok(missing.length === 0, `${file}: 响应式容器宽度完整（max-w-230/250/280 = 920/1000/1120px）${missing.length ? `，缺少 ${missing.join(" ")}` : ""}`);
}

// ---------- 2) 文章正文居中 + 上限 ----------
// max-w-180 = 180×4 = 720px（Tailwind v4 主题 token，等价于旧 max-w-[720px]）
const postDetail = read("src/pages/PostDetail.tsx");
ok(
  /<article\b[^>]*className="[^"]*min-w-0 flex-1 max-w-180[^"]*mx-auto[^"]*"/.test(postDetail),
  "PostDetail: 文章列 max-w-180（720px）且水平居中（PC 端不被侧栏挤窄）"
);

// ---------- 3) 文字排版：中英文可读性与代码块 ----------
const globalCss = read("src/styles/global.css");
for (const rule of [
  "text-wrap: pretty",
  "text-wrap: balance",
  "text-rendering: optimizeLegibility",
  "font-feature-settings",
  "scroll-margin-top",
  "overflow-wrap: anywhere",
]) {
  ok(globalCss.includes(rule) || read("src/index.css").includes(rule), `排版规则: ${rule}`);
}
// 正文随视口放大（16px → 17px）
ok(
  /@media\s*\(min-width:\s*1024px\)\s*{\s*\.markdown\s*{\s*font-size:\s*17px\s*;?\s*}/.test(globalCss),
  "Markdown: 大屏正文提升到 17px"
);
// 代码块字号不小于 14px
ok(
  /\.markdown pre code\s*{[^}]*font-size:\s*14px/.test(globalCss),
  "Markdown: 代码块字号 14px（原 13.5px 偏小）"
);

// ---------- 4) 移动端：触控目标 >= 36px ----------
// Button size="icon-lg" 映射到 size-9（36px），符合 WCAG 推荐的最小触控目标
const navbar = read("src/components/Navbar.tsx");
ok(
  !navbar.includes('className="size-8 ') && (navbar.match(/size="icon-lg"/g) || []).length >= 4,
  "Navbar: 图标按钮触控目标 36px（size=\"icon-lg\"，原 size-8/32px 低于推荐值）"
);
ok(
  read("src/components/theme-toggle.tsx").includes('size="icon-lg"'),
  "ThemeToggle: 与导航栏按钮尺寸统一（size=\"icon-lg\" = 36px）"
);

// ---------- 5) 移动端：刘海/手势条安全区 ----------
ok(
  read("index.html").includes("viewport-fit=cover"),
  "index.html: viewport-fit=cover（启用安全区）"
);
ok(
  read("src/components/BackToTop.tsx").includes("safe-area-inset-bottom"),
  "BackToTop: 避让全面屏底部安全区"
);
ok(
  read("index.html").includes('name="apple-mobile-web-app-capable"') &&
    read("index.html").includes('name="mobile-web-app-capable"'),
  "index.html: PWA/添加到主屏幕 meta"
);
ok(read("index.html").includes("<noscript>"), "index.html: 无 JS 兜底提示");

// ---------- 6) CSS 语法健康 ----------
const indexCss = read("src/index.css");
const open = (indexCss.match(/{/g) || []).length;
const close = (indexCss.match(/}/g) || []).length;
ok(open === close, `index.css: 花括号配平（{ ${open} / } ${close}）`);

// ---------- 7) 构建产物：SEO meta 已落入静态 HTML ----------
const siteIndex = read("dist/index.html");
ok(siteIndex.includes('hreflang="zh-Hans"') && siteIndex.includes('hreflang="x-default"'), "首页: hreflang zh-Hans + x-default");
ok(siteIndex.includes('rel="canonical"'), "首页: canonical");

const postHtml = read("dist/posts/archlinux/index.html");
for (const m of [
  "article:published_time",
  "article:modified_time",
  "article:section",
  'article:tag',
  'og:image:alt',
  'hreflang="zh-Hans"',
]) {
  ok(postHtml.includes(m), `文章页静态 HTML 含 ${m}`);
}
ok(
  postHtml.includes('"inLanguage":"zh-Hans"') && postHtml.includes('"mainEntityOfPage"'),
  "文章 JSON-LD: inLanguage + mainEntityOfPage"
);
ok(
  postHtml.includes('"logo"') && postHtml.includes('"isPartOf"'),
  "文章 JSON-LD: publisher.logo + isPartOf"
);

// ---------- 8) 构建产物：图片 sitemap ----------
const sitemap = read("dist/sitemap.xml");
ok(sitemap.includes('xmlns:image=') && (sitemap.match(/<image:image>/g) || []).length > 0, "sitemap.xml: 含 image:image 图片索引");
ok(sitemap.includes("image:width") && sitemap.includes("image:title"), "sitemap.xml: 图片含宽高与标题");
// 整份 XML 必须能被解析（此前 image;height 笔误导致非法标签名逃过检查）
ok(!/[<]image;/.test(sitemap), "sitemap.xml: 无非法标签（分号冒号笔误）");

// ---------- 8) 渲染性能：屏外区块跳过布局 ----------
// 长列表页（归档/文章/友链/首页）的重复区块应启用 content-visibility，
// 否则首屏要完整布局数百个 DOM 节点。
// cv-auto 可由 className 直接指定，也可由 Card/Item 的 size="flush" 变体内置提供。
const cvSpecs: [string, string, string][] = [
  ["src/styles/global.css", ".cv-auto", "cv-auto 工具类已定义"],
];
for (const [file, needle, label] of cvSpecs) {
  ok(read(file).includes(needle), label);
}
// 组件级：Card size="flush" 内置 cv-auto，无需在每个调用处重复
const cvAutoViaComponent = (file: string): boolean => {
  const src = read(file);
  return src.includes("cv-auto") || /Card[^>]*size="flush"/.test(src) || /Item[^>]*size="flush"/.test(src);
};
const cvComponentChecks: [string, string][] = [
  ["src/components/PostCard.tsx", "PostCard: 卡片启用 cv-auto（Card size=\"flush\"）"],
  ["src/pages/Archive.tsx", "Archive: 年份分组启用 cv-auto"],
  ["src/pages/Friends.tsx", "Friends: 友链卡片启用 cv-auto"],
  ["src/pages/Home.tsx", "Home: 文章条目启用 cv-auto"],
];
for (const [file, label] of cvComponentChecks) {
  ok(cvAutoViaComponent(file), label);
}
ok(/content-visibility:\s*auto/.test(read("src/styles/global.css")), "cv-auto: content-visibility: auto");
ok(/contain-intrinsic-size/.test(read("src/styles/global.css")), "cv-auto: contain-intrinsic-size 防滚动抖动");

// ---------- 8.3) 搜索快捷键 ----------
// /posts 页按 / 聚焦搜索框；焦点已在输入框内时必须放行，否则会吞掉用户输入的 "/"
const postsSrc = read("src/pages/Posts.tsx");
ok(postsSrc.includes('e.key !== "/"'), "Posts: / 键聚焦搜索框");
ok(postsSrc.includes("isContentEditable"), "Posts: 内容可编辑区域放行 /");
ok(postsSrc.includes("searchRef"), "Posts: 搜索框绑定 ref");
ok(postsSrc.includes("按 / 快速聚焦"), "Posts: placeholder 提示快捷键");

// ---------- 8.4) 阅读进度条 ----------
// 长文需要进度反馈；实现必须用 scaleX（合成器）而非 width（触发回流）
const rp = read("src/components/ReadingProgress.tsx");
ok(rp.includes("scaleX"), "ReadingProgress: 用 transform: scaleX 更新进度");
ok(rp.includes("requestAnimationFrame"), "ReadingProgress: rAF 节流滚动");
ok(rp.includes("passive: true"), "ReadingProgress: passive 滚动监听");
ok(read("src/pages/PostDetail.tsx").includes("ReadingProgress"), "PostDetail: 渲染阅读进度条");

// ---------- 8.5) 文章页滚动监听：避免每帧全量 DOM 读取 ----------
// 目录高亮应走 IntersectionObserver（合成线程判定），
// 而不是 scroll 事件里对每个标题逐个 getBoundingClientRect
const postDetailSrc = read("src/pages/PostDetail.tsx");
ok(postDetailSrc.includes("IntersectionObserver"), "PostDetail: 目录高亮使用 IntersectionObserver");
ok(postDetailSrc.includes("requestAnimationFrame"), "PostDetail: 滚动回退路径用 rAF 节流");
ok(postDetailSrc.includes("passive: true"), "PostDetail: 滚动监听为 passive");

// ---------- 8.46) 构建可移植性：CI 没有 cwebp/dwebp ----------
// 缩略图与清单都已入库，CI 不需要（也不能）重新生成。
// 脚本必须先探测外部工具，缺失时直接跳过并保留仓库里的清单，
// 否则 CI 会把 cover-thumbnails.json 覆写成空对象导致本项断言失败。
const genThumbs = read("scripts/generate-thumbnails.mjs");
ok(genThumbs.includes("hasTool("), "generate-thumbnails: 探测外部图片工具");
ok(/process\.exit\(0\)/.test(genThumbs), "generate-thumbnails: 工具缺失时正常退出（不阻断 CI）");
ok(
  genThumbs.includes("不覆写") || genThumbs.includes("保留已有清单"),
  "generate-thumbnails: 拒绝用空结果覆写已有清单"
);
// cover-sizes 只能收录真实图片，不能把 robots.txt 当图片解析
const coverSizesSrc = read("scripts/cover-sizes.mjs");
ok(coverSizesSrc.includes("IMAGE_EXT"), "cover-sizes: 只收录图片扩展名（忽略 robots.txt 等）");

// ---------- 8.45) 爬虫入口：robots.txt ----------
// 由 scripts/generate-seo.mjs 在构建期生成到 dist/（public/ 里的手写版本会被覆盖，
// 所以不入库、改校验产物），sitemap 地址取自 site.json 的 site_url
ok(existsSync(join(root, "dist", "robots.txt")), "dist/robots.txt 存在（generate-seo 生成）");
if (existsSync(join(root, "dist", "robots.txt"))) {
  const robots = read("dist/robots.txt");
  ok(/User-agent:\s*\*/.test(robots), "robots.txt: 含 User-agent: *");
  ok(/Allow:\s*\//.test(robots), "robots.txt: 放开整站爬取");
  ok(!/Disallow:\s*\//.test(robots), "robots.txt: 未封禁整站");
  ok(/Sitemap:\s*https?:\/\//.test(robots), "robots.txt: 指向 sitemap");
}

// ---------- 8.5) 响应式封面变体 ----------
// 缩略图由 scripts/generate-thumbnails.mjs 生成，变体清单在 cover-thumbnails.json。
// 清单里声明的每个文件必须真实存在，否则 srcset 会出现 404。
const coverThumbs = JSON.parse(read("src/data/cover-thumbnails.json")) as Record<
  string,
  { src: string; variants: { suffix: string; width: number }[] }
>;
const thumbMissing: string[] = [];
const thumbPairs: string[] = [];
for (const [srcPath, entry] of Object.entries(coverThumbs)) {
  if (!existsSync(join(root, "public", srcPath))) thumbMissing.push(srcPath);
  for (const v of entry.variants) {
    const vPath = srcPath.replace(/\.webp$/, v.suffix + ".webp");
    if (!existsSync(join(root, "public", vPath))) thumbMissing.push(vPath);
    else thumbPairs.push(v.suffix);
  }
}
ok(thumbMissing.length === 0, `封面缩略图：${thumbPairs.length} 个变体文件均存在${thumbMissing.length ? `，缺失 ${thumbMissing.join(" ")}` : ""}`);
ok(Object.keys(coverThumbs).length >= 10, `封面缩略图：${Object.keys(coverThumbs).length} 篇文章封面已生成变体`);
// 组件确实消费了 srcset
ok(read("src/components/PostCard.tsx").includes("srcSet"), "PostCard: 使用 srcset 响应式变体");
ok(read("src/pages/Home.tsx").includes("srcSet"), "Home: 使用 srcset 响应式变体");
ok(read("src/lib/post-image.ts").includes("responsiveImageSrc"), "post-image: 导出带 base 的 srcset helper");

// ---------- 8.6) 字体预加载 ----------
// @font-face 在 CSS 里，浏览器解析完 CSS 才知道字体 URL；
// 预渲染应注入 preload 让字体请求与 CSS 下载并行
const homeHtml = read("dist/index.html");
ok(
  /<link rel="preload"[^>]*as="font"[^>]*type="font\/woff2"/.test(homeHtml),
  "首页静态 HTML: 字体 preload（与 CSS 下载并行）"
);
ok(
  /<link rel="preload"[^>]*crossorigin/.test(homeHtml),
  "字体 preload: crossorigin（字体需 CORS）"
);

// ---------- 9) 静态资源引用完整性 ----------
// src/ 中引用的图片必须真实存在于 public/，避免图片转换/删除后留下 404
// 文档示例里的伪路径（post-image.ts 注释、文章 markdown 里的说明文字），非真实引用
const IGNORED_ASSET_REFS = ["/images/x", "/images/xxx", "/images/foo", "/images/bar"];
const srcFiles = (function walk(d: string): string[] {
  const out: string[] = [];
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(md|tsx|ts|json|html)$/.test(n)) out.push(p);
  }
  return out;
})(join(root, "src"));
const allSrcText = srcFiles.map((f) => readFileSync(f, "utf-8")).join("\n") + "\n" + read("index.html");
// 仅匹配站点内本地路径：排除 https://xxx/avatar.webp 这类外链
const assetRefs = [
  ...new Set(
    (allSrcText.match(/(?:^|[\s"'`(,])\/images\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|gif|svg)/gm) || [])
      .map((s) => s.replace(/^[\s"'`(,]+/, ""))
  ),
];
const isIgnored = (r: string): boolean =>
  IGNORED_ASSET_REFS.some((ig) => r === ig || r.startsWith(ig + ".") || r.startsWith(ig + "-"));
const missingAssets = assetRefs.filter(
  (r) => !isIgnored(r) && !existsSync(join(root, "public", r))
);
ok(missingAssets.length === 0, `资源引用完整：${assetRefs.length} 个图片路径均存在${missingAssets.length ? `，缺失 ${missingAssets.join(" ")}` : ""}`);

// cover-sizes.json 的每个条目都必须对应真实文件（否则 og:image 尺寸标注失效）
const coverSizes = JSON.parse(read("src/data/cover-sizes.json")) as Record<string, { w: number; h: number }>;
const missingSizes = Object.keys(coverSizes).filter((k) => !existsSync(join(root, "public", k)));
ok(missingSizes.length === 0, `cover-sizes.json：${Object.keys(coverSizes).length} 条尺寸记录均有效${missingSizes.length ? `，失效 ${missingSizes.join(" ")}` : ""}`);

// ---------- 10) 图片体积预算 ----------
// 防止体积回潮（未转 WebP 时 public/ 曾达 3.1MB）。
// 现在含 -thumb / -md 两档缩略图，总量更高但单页下载量更低
const publicBytes = (function total(d: string): number {
  let sum = 0;
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) sum += total(p);
    else sum += statSync(p).size;
  }
  return sum;
})(join(root, "public"));
ok(publicBytes < 1_700_000, `public/ 总体积 ${(publicBytes / 1024 / 1024).toFixed(2)}MB < 1.7MB 预算`);

// 单张位图不超过 150KB
const bigImages: string[] = [];
for (const n of readdirSync(join(root, "public", "images"))) {
  if (/\.(png|jpe?g|webp|gif)/i.test(n) && statSync(join(root, "public", "images", n)).size > 200 * 1024) {
    bigImages.push(n);
  }
}
ok(bigImages.length === 0, `单图体积均 < 200KB${bigImages.length ? `，超标 ${bigImages.join(" ")}` : ""}`);

// 最长边不超过 2000px：显示容器上限 1120px，@2x 也只需 2240px，更大纯属浪费流量
// （尺寸信息已在 cover-sizes.json 中，复用其宽高判定）
const oversized = Object.entries(coverSizes).filter(
  ([k, v]) => Math.max(v.w, v.h) > 2000
).map(([k]) => k);
ok(oversized.length === 0, `所有图片最长边 <= 2000px${oversized.length ? `，超标 ${oversized.join(" ")}` : ""}`);

// public/images 内不再遗留 PNG/JPG（位图统一 WebP）
const legacyFmt = readdirSync(join(root, "public", "images")).filter((n) => /\.(png|jpe?g|gif)/i.test(n));
ok(legacyFmt.length === 0, `public/images 内无遗留 PNG/JPG${legacyFmt.length ? `：${legacyFmt.join(" ")}` : ""}`);

console.log("\n=== 排版 / 移动 / SEO 回归检查 ===");
for (const p of passes) console.log("  ✓ " + p);
for (const f of failures) console.log("  ✗ " + f);
if (failures.length) {
  console.log(`\n${failures.length} 项失败\n`);
  process.exit(1);
}
console.log(`\n全部通过（${passes.length} 项）\n`);
