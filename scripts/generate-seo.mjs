// 构建后生成 SEO 文件：sitemap.xml / llms.txt / robots.txt / 404.html
// 用法: node scripts/generate-seo.mjs （在 vite build 之后运行）
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPosts } from "./lib/frontmatter.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// ---------- 读取站点配置 ----------
const site = JSON.parse(readFileSync(join(root, "src/data/site.json"), "utf-8"));
const baseUrl = site.site_url.replace(/\/$/, "");

// ---------- 读取文章（无尾斜杠路径） ----------
const posts = loadPosts(join(root, "src/posts"));

const today = new Date().toISOString().slice(0, 10);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- URL 形态统一 ----------
// GitHub Pages 静态托管下，文章页实际地址为 /posts/<slug>/（目录 index.html 形式），
// 为避免 /posts/x 与 /posts/x/ 分裂，canonical/sitemap 统一使用带尾斜杠的形态。
const postPath = (slug) => `/posts/${slug}/`;
const postUrl = (slug) => baseUrl + postPath(slug);

// ---------- sitemap.xml ----------
const staticPages = [
  { path: "/", lastmod: today, priority: "1.0", changefreq: "daily" },
  { path: "/posts/", lastmod: today, priority: "0.8", changefreq: "daily" },
  { path: "/archive", lastmod: today, priority: "0.5", changefreq: "weekly" },
  { path: "/friends", lastmod: today, priority: "0.5", changefreq: "weekly" },
  { path: "/about", lastmod: today, priority: "0.5", changefreq: "monthly" },
];

const urls = [
  ...staticPages.map((p) => ({
    loc: baseUrl + p.path,
    lastmod: p.lastmod,
    changefreq: p.changefreq,
    priority: p.priority,
  })),
  ...posts.map((p) => ({
    loc: postUrl(p.slug),
    lastmod: p.published || today,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

// ---------- llms.txt（https://llmstxt.org/） ----------
const llms = `# ${site.title}

> ${site.description}
>
> - 作者: ${site.author}
> - 主页: ${baseUrl}

## 页面

- [首页](${baseUrl}/): 个人资料与最新文章
- [文章列表](${baseUrl}/posts/): 全部技术文章
- [归档](${baseUrl}/archive): 按年份归档
- [友链](${baseUrl}/friends): 友情链接与申请方式
- [关于](${baseUrl}/about): 关于作者

## 文章

${posts
  .map((p) => {
    const desc = p.description ? `: ${p.description.replace(/\n+/g, " ")}` : "";
    return `- [${p.title}](${postUrl(p.slug)})${desc}`;
  })
  .join("\n")}
`;

// ---------- robots.txt ----------
const robots = `# robots.txt for ${baseUrl}
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

// ---------- 写入 ----------
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "sitemap.xml"), sitemap, "utf-8");
writeFileSync(join(dist, "llms.txt"), llms, "utf-8");
writeFileSync(join(dist, "robots.txt"), robots, "utf-8");

// 404.html：GitHub Pages 无 SPA fallback，用 404.html 承载应用（兜底深链）
const indexPath = join(dist, "index.html");
if (existsSync(indexPath)) {
  copyFileSync(indexPath, join(dist, "404.html"));
  console.log(`[seo] 404.html (SPA fallback)`);
}

console.log(`[seo] sitemap.xml (${urls.length} URLs)`);
console.log(`[seo] llms.txt (${posts.length} posts)`);
console.log(`[seo] robots.txt`);
