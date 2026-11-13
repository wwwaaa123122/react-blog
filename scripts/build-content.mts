// 构建期内容编译：把 Markdown 文章预先编译成可直接插入 DOM 的 HTML。
//
// 产物（src/generated/，不提交到仓库，构建/开发前自动生成）：
//   posts-meta.json        文章元数据（标题/日期/标签/字数…），不含正文 —— 首页、列表、归档只读它
//   posts/<slug>.json      单篇正文 HTML + 目录锚点（只有文章页按需下载，每篇约 8 KB gzip）
//   search-index.json      全文搜索用的纯文本索引（列表页空闲时加载）
//
// 好处：客户端不再需要 react-markdown / remark / rehype / highlight.js，
// 也不必为每篇文章重新解析 Markdown —— 首屏只做字符串插入。
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPosts } from "./lib/frontmatter.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/generated");
const postDir = join(outDir, "posts");

process.env.POSTS_DIR = process.env.POSTS_DIR || join(root, "src/posts");
process.env.VITE_BASE = process.env.VITE_BASE || "/";
(globalThis as unknown as { __BASE_URL__?: string }).__BASE_URL__ = process.env.VITE_BASE;

const { default: MarkdownRenderer } = await import("../src/lib/markdown-render");
const { extractToc } = await import("../src/lib/toc");

function countWords(text: string): number {
  // 统计中文字符 + 英文单词数
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = text
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + words;
}

interface RawPost {
  slug: string;
  title: string;
  published: string;
  updated?: string;
  description: string;
  image?: string;
  tags: string[];
  category: string;
  draft: boolean;
  content: string;
}

const posts = loadPosts(join(root, "src/posts")) as unknown as RawPost[];

const meta: Array<Record<string, unknown>> = [];
const search: Record<string, string> = {};
const articles: Array<{ slug: string; html: string; toc: ReturnType<typeof extractToc> }> = [];

const t0 = performance.now();
for (const post of posts) {
  // 源文件可能是 CRLF：统一成 LF —— 目录提取按行匹配标题，行尾残留 \r 会让
  // /^#{1,4}\s+(.+)$/ 整条失配（正文里明明有标题，目录却是空的）
  const content = post.content.replace(/\r\n/g, "\n");
  const words = countWords(content);
  meta.push({
    slug: post.slug,
    title: post.title,
    published: post.published,
    ...(post.updated ? { updated: post.updated } : {}),
    description: post.description,
    ...(post.image ? { image: post.image } : {}),
    tags: post.tags,
    category: post.category,
    draft: post.draft,
    lang: "zh_CN",
    words,
  });

  articles.push({
    slug: post.slug,
    html: renderToStaticMarkup(React.createElement(MarkdownRenderer, { content })),
    toc: extractToc(content),
  });

  search[post.slug] = (
    post.title +
    "\n" +
    post.description +
    "\n" +
    content +
    "\n" +
    post.tags.join(" ")
  ).toLowerCase();
}
const renderMs = performance.now() - t0;

mkdirSync(outDir, { recursive: true });

// 每篇文章单独一个文件：Vite 会为每个 JSON 生成独立 chunk，
// 访客只下载自己正在读的那一篇（约 8 KB gzip），而不是全站正文。
rmSync(postDir, { recursive: true, force: true });
mkdirSync(postDir, { recursive: true });

const write = (dir: string, name: string, data: unknown): number => {
  const body = JSON.stringify(data);
  writeFileSync(join(dir, name), body, "utf-8");
  return Buffer.byteLength(body);
};

const metaBytes = write(outDir, "posts-meta.json", meta);
const searchBytes = write(outDir, "search-index.json", search);
let htmlBytes = 0;
for (const a of articles) {
  htmlBytes += write(postDir, `${a.slug}.json`, { html: a.html, toc: a.toc });
}

const kb = (n: number): string => (n / 1024).toFixed(1) + " KB";
console.log(
  `[content] ${posts.length} posts compiled in ${renderMs.toFixed(0)}ms — ` +
    `meta ${kb(metaBytes)}, article html ${kb(htmlBytes)}, search ${kb(searchBytes)}`
);
