// 构建后静态预渲染：让纯前端 SPA 在爬虫（微信/Telegram/Discord/百度/谷歌）面前表现如传统多页网站
//
// 原理（借鉴 2x.nz 的"边缘预渲染"思路，用构建时静态文件替代 Worker）：
//   1. 用与客户端完全相同的组件树（<App/> + MemoryRouter）渲染每个路由 → HTML
//   2. 注入正确的 title/description/canonical/OG/Twitter meta（Seo 组件是 useEffect 注入，
//      静态 HTML 需要脚本注入）
//   3. 把渲染结果写入 dist/<path>/index.html —— GitHub Pages 直接以 200 服务，
//      爬虫无需执行 JS 即可看到完整正文；浏览器访问时 React 挂载并接管（CSR 全量替换，无 hydration 冲突）
//   4. 生成 rss.xml（含全文 content:encoded 与封面图）
//
// 用法: VITE_BASE=/react-blog/ npx tsx scripts/prerender.tsx （在 vite build 之后）
import React from "react";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { routerBase, assetUrl } from "../src/lib/base";
import { publishedPosts, rewriteImagePaths } from "../src/lib/posts";
import Markdown from "../src/components/Markdown";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  jsonLd,
  websiteJsonLd,
} from "../src/lib/seo";
import siteData from "../src/data/site.json";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// 注入构建环境（与 vite.config 的 base 保持一致）
const baseEnv = process.env.VITE_BASE || "/";
(globalThis as unknown as { __BASE_URL__?: string }).__BASE_URL__ = baseEnv;
(globalThis as unknown as { __POSTS_DIR__?: string }).__POSTS_DIR__ = join(
  root,
  "src/posts"
);

const site = siteData as unknown as {
  title: string;
  subtitle: string;
  author: string;
  site_url: string;
  description: string;
};
const siteUrl = site.site_url.replace(/\/$/, "");

const esc = (s: string): string =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const template = readFileSync(join(dist, "index.html"), "utf-8");

// 渲染单个路由的完整应用 HTML（同一组件树）
function renderApp(path: string): string {
  // MemoryRouter 的 initialEntries 需包含 basename 前缀
  const fullPath = routerBase === "" ? path : routerBase + path;
  return renderToString(
    <MemoryRouter basename={routerBase} initialEntries={[fullPath]}>
      <App />
    </MemoryRouter>
  );
}

interface PageMeta {
  title?: string;
  description?: string;
  ogImage?: string;
}

// 按路径推导 JSON-LD（与客户端 seo.ts 同源）：WebSite / BlogPosting / BreadcrumbList
function jsonLdFor(path: string): string[] {
  const blocks: string[] = [];
  if (path === "/") {
    blocks.push(jsonLd(websiteJsonLd()));
  } else if (path.startsWith("/posts/") && path !== "/posts/") {
    const post = publishedPosts.find(
      (p) => `/posts/${p.slug}/` === path
    );
    if (post) {
      blocks.push(jsonLd(articleJsonLd(post)));
      blocks.push(
        jsonLd(
          breadcrumbJsonLd([
            { label: "文章", to: "/posts/" },
            { label: post.title },
          ])
        )
      );
    }
  } else {
    const labelMap: Record<string, string> = {
      "/posts/": "文章",
      "/archive": "归档",
      "/friends": "友链",
      "/about": "关于我",
    };
    const label = labelMap[path];
    if (label) {
      blocks.push(
        jsonLd(breadcrumbJsonLd([{ label, to: path }]))
      );
    }
  }
  return blocks;
}

// 注入 head：title / description / canonical / OG / Twitter / JSON-LD
function withHead(
  html: string,
  path: string,
  meta: PageMeta
): string {
  const fullTitle = meta.title ? `${meta.title} · ${site.title}` : site.title;
  const desc = meta.description || site.description;
  const url = siteUrl + path;
  const ogImageUrl = meta.ogImage
    ? meta.ogImage.startsWith("http")
      ? meta.ogImage
      : siteUrl + assetUrl(rewriteImagePaths(meta.ogImage))
    : undefined;

  const jsonLdBlocks = jsonLdFor(path);

  const headExtra = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:site_name" content="${esc(site.title)}">`,
    `<meta property="og:title" content="${esc(fullTitle)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:type" content="${path.startsWith("/posts/") ? "article" : "website"}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:locale" content="zh_CN">`,
    ogImageUrl ? `<meta property="og:image" content="${esc(ogImageUrl)}">` : "",
    `<meta name="twitter:card" content="${ogImageUrl ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${esc(fullTitle)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    ogImageUrl ? `<meta name="twitter:image" content="${esc(ogImageUrl)}">` : "",
    ...jsonLdBlocks.map(
      (b) => `<script type="application/ld+json">${b}</script>`
    ),
  ]
    .filter(Boolean)
    .join("\n");

  return html
    .replace(/<title>.*?<\/title>/is, "")
    .replace(/<meta name="description"[^>]*>/i, "")
    .replace("</head>", headExtra + "\n</head>");
}

// 写入页面：dist/<path>/index.html
// 流程：renderApp 得到应用 HTML → 注入模板 #root → withHead 注入 head meta
function writePage(path: string, meta: PageMeta): void {
  try {
    const appHtml = renderApp(path);
    const doc = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
    const html = withHead(doc, path, meta);
    const filePath =
      path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html, "utf-8");
    console.log(`[prerender] ${path} (${Buffer.byteLength(html)} bytes)`);
  } catch (e) {
    // 优雅降级：渲染失败则保留原 SPA 壳（不阻塞构建）
    console.warn(`[prerender] SKIP ${path}: ${(e as Error).message}`);
  }
}

// ---------- 预渲染主要页面 ----------
writePage("/", { title: "", description: site.description });
writePage("/posts/", {
  title: "文章",
  description: `共 ${publishedPosts.length} 篇文章 · 分享技术、生活与热爱`,
});
writePage("/archive", { title: "归档", description: "全部文章按年份归档" });
writePage("/friends", {
  title: "友链",
  description: "友情链接与友链申请方式，与优秀的朋友们一起成长",
});
writePage("/about", { title: "关于我", description: "认识一下这个博客的主人" });

// 每篇文章：/posts/<slug>/ （GitHub Pages 静态目录形态，sitemap/canonical 与之对应）
for (const post of publishedPosts) {
  writePage(`/posts/${post.slug}/`, {
    title: post.title,
    description: post.description || site.description,
    ogImage: post.image,
  });
}

// ---------- RSS ----------
function buildRss(): string {
  const fmtRFC822 = (d: string): string => {
    const date = new Date(d);
    return Number.isNaN(date.getTime())
      ? new Date().toUTCString()
      : date.toUTCString();
  };

  const items = publishedPosts
    .map((p) => {
      const postUrl = `${siteUrl}/posts/${p.slug}/`;
      let bodyHtml = "";
      try {
        bodyHtml = renderToString(
          <Markdown content={rewriteImagePaths(p.content)} />
        );
      } catch {
        bodyHtml = esc(p.description || "");
      }
      // 正文中的相对根路径资源/链接 → 绝对 URL（RSS 阅读器需要）
      const absBody = bodyHtml
        .replace(/src="\/(?!\/)/g, `src="${siteUrl}/`)
        .replace(/href="\/(?!\/)/g, `href="${siteUrl}/`);
      const cover = p.image
        ? p.image.startsWith("http")
          ? p.image
          : siteUrl + assetUrl(rewriteImagePaths(p.image))
        : undefined;

      return `  <item>
    <title>${esc(p.title)}</title>
    <link>${esc(postUrl)}</link>
    <guid isPermaLink="true">${esc(postUrl)}</guid>
    <pubDate>${fmtRFC822(p.published)}</pubDate>
    <description>${esc(p.description || "")}</description>
    <content:encoded><![CDATA[${absBody}]]></content:encoded>
    ${cover ? `<media:content url="${esc(cover)}" medium="image"/>` : ""}
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(site.title)}</title>
    <link>${siteUrl}/</link>
    <description>${esc(site.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

writeFileSync(join(dist, "rss.xml"), buildRss(), "utf-8");
console.log(`[prerender] rss.xml (${publishedPosts.length} items)`);
console.log(`[prerender] done, base=${baseEnv}`);
