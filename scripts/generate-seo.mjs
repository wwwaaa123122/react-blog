// 构建后生成 SEO 文件：sitemap.xml / llms.txt / robots.txt
// 用法: node scripts/generate-seo.mjs （在 vite build 之后运行）
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// ---------- 读取站点配置 ----------
const site = JSON.parse(readFileSync(join(root, "src/data/site.json"), "utf-8"));
const baseUrl = site.site_url.replace(/\/$/, "");

// ---------- 轻量 frontmatter 解析 ----------
function parseFrontmatter(raw) {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") return { data: {}, content: raw };
  let i = 1;
  const data = {};
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i];
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (value === "" && lines[i + 1]?.trimStart().startsWith("- ")) {
        const arr = [];
        i++;
        while (i < lines.length && lines[i].trimStart().startsWith("- ")) {
          arr.push(lines[i].trim().slice(2).trim().replace(/^['"]|['"]$/g, ""));
          i++;
        }
        data[key] = arr;
        continue;
      }
      if (value === "|" || value === ">" || value === "|-" || value === ">-") {
        const folded = value === ">" || value === ">-";
        const parts = [];
        i++;
        while (i < lines.length && (lines[i].startsWith(" ") || lines[i] === "")) {
          parts.push(lines[i]);
          i++;
        }
        let text = parts.join("\n").replace(/^\s+/gm, "");
        if (folded) text = text.replace(/\n+/g, " ");
        data[key] = text;
        continue;
      }
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        data[key] = value.slice(1, -1);
      } else if (value.startsWith("[") && value.endsWith("]")) {
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean);
      } else if (value === "true" || value === "false") {
        data[key] = value === "true";
      } else {
        data[key] = value;
      }
    }
    i++;
  }
  return { data, content: lines.slice(i + 1).join("\n") };
}

// ---------- 读取文章 ----------
const postsDir = join(root, "src/posts");
const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = readFileSync(join(postsDir, f), "utf-8");
    const { data } = parseFrontmatter(raw);
    return {
      slug: f.replace(/\.md$/, ""),
      title: String(data.title || f),
      published: String(data.published || ""),
      description: String(data.description || ""),
      draft: Boolean(data.draft),
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.published < b.published ? 1 : -1));

const today = new Date().toISOString().slice(0, 10);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- sitemap.xml ----------
const staticPages = [
  { path: "/", lastmod: today, priority: "1.0", changefreq: "daily" },
  { path: "/posts", lastmod: today, priority: "0.8", changefreq: "daily" },
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
    loc: baseUrl + "/posts/" + p.slug,
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
- [文章列表](${baseUrl}/posts): 全部技术文章
- [归档](${baseUrl}/archive): 按年份归档
- [友链](${baseUrl}/friends): 友情链接与申请方式
- [关于](${baseUrl}/about): 关于作者

## 文章

${posts
  .map((p) => {
    const desc = p.description ? `: ${p.description.replace(/\n+/g, " ")}` : "";
    return `- [${p.title}](${baseUrl}/posts/${p.slug})${desc}`;
  })
  .join("\n")}
`;

// ---------- robots.txt ----------
const robots = `# robots.txt for ${baseUrl}
User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;

// ---------- 404.html：GitHub Pages 无 SPA fallback，用 404.html 承载应用 ----------
// GitHub Pages 对未知路径返回 404 页；把 404.html 做成与 index.html 相同的 SPA，
// React Router 即可接管深链（如 /posts/xxx）正常渲染。
const indexPath = join(dist, "index.html");
if (existsSync(indexPath)) {
  copyFileSync(indexPath, join(dist, "404.html"));
  console.log(`[seo] 404.html (SPA fallback)`);
}

// ---------- 写入 ----------
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "sitemap.xml"), sitemap, "utf-8");
writeFileSync(join(dist, "llms.txt"), llms, "utf-8");
writeFileSync(join(dist, "robots.txt"), robots, "utf-8");

console.log(`[seo] sitemap.xml (${urls.length} URLs)`);
console.log(`[seo] llms.txt (${posts.length} posts)`);
console.log(`[seo] robots.txt`);
