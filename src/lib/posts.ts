import type { Post } from "../types";

// 文章加载：
//  - 浏览器构建：Vite 的 import.meta.glob 注入（eager）
//  - Node 预渲染（scripts/prerender.tsx）：从文件系统读取同一批 Markdown，
//    保证爬虫预渲染与客户端渲染使用完全相同的管线（同源同数据）
const __isNode = typeof process !== "undefined" && !!process.versions?.node;

async function loadModules(): Promise<Record<string, string>> {
  // Node 预渲染（scripts/prerender.tsx）：从文件系统读取，浏览器中不会进入此分支
  if (__isNode) {
    const dir =
      process.env.POSTS_DIR ||
      (globalThis as unknown as { __POSTS_DIR__?: string }).__POSTS_DIR__;
    if (dir) {
      // 动态导入避免打进浏览器 bundle
      const fs = await import("node:fs");
      const pathMod = await import("node:path");
      const modules: Record<string, string> = {};
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".md")) {
          modules["../posts/" + f] = fs.readFileSync(
            pathMod.join(dir, f),
            "utf-8"
          );
        }
      }
      return modules;
    }
  }
  // 浏览器构建：直接调用 import.meta.glob，让 Vite 做静态转换（eager 内联）
  return import.meta.glob("../posts/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;
}

const modules = await loadModules();

type FmValue = string | string[] | boolean | null;

// 轻量 frontmatter 解析器
// 支持：内联数组 [a, b]、YAML 块列表（- item）、块标量（| 与 >）、引号与布尔值
function parseFrontmatter(raw: string): { data: Record<string, FmValue>; content: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") {
    return { data: {}, content: raw };
  }
  let i = 1;
  const data: Record<string, FmValue> = {};
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i];
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();

      // YAML 块列表
      if (value === "" && lines[i + 1]?.trimStart().startsWith("- ")) {
        const arr: string[] = [];
        i++;
        while (i < lines.length) {
          const item = lines[i];
          if (!item.trimStart().startsWith("- ")) break;
          arr.push(item.trim().slice(2).trim().replace(/^['"]|['"]$/g, ""));
          i++;
        }
        data[key] = arr;
        continue;
      }

      // YAML 块标量：| 保留换行，> 折叠换行
      if (value === "|" || value === ">" || value === "|-" || value === ">-") {
        const folded = value === ">" || value === ">-";
        const parts: string[] = [];
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
      } else if (value === "" || value === "null" || value === "~") {
        data[key] = null;
      } else {
        data[key] = value;
      }
    }
    i++;
  }
  const content = lines.slice(i + 1).join("\n");
  return { data, content };
}

function countWords(text: string): number {
  // 统计中文字符 + 英文单词数
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = text
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + words;
}

function parsePosts(): Post[] {
  const posts: Post[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const filename = path.split("/").pop() || "";
    const slug = filename.replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
    posts.push({
      slug,
      title: String(data.title || slug),
      published: String(data.published || ""),
      description: String(data.description || ""),
      image: data.image ? String(data.image) : undefined,
      tags,
      category: String(data.category || ""),
      draft: Boolean(data.draft),
      lang: String(data.lang || "zh_CN"),
      content,
      words: countWords(content),
    });
  }
  return posts;
}

export const allPosts: Post[] = parsePosts();

export const publishedPosts: Post[] = allPosts
  .filter((p) => !p.draft)
  .sort((a, b) => (a.published < b.published ? 1 : -1));

export const getPostBySlug = (slug: string): Post | undefined =>
  publishedPosts.find((p) => p.slug === slug);

export const getAllTags = (): string[] => {
  const set = new Set<string>();
  for (const p of publishedPosts) {
    for (const t of p.tags) set.add(t);
  }
  return Array.from(set).sort();
};

export const formatDate = (d: string): string => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const readingTime = (words: number): string => {
  const mins = Math.max(1, Math.round(words / 300));
  return `约 ${mins} 分钟`;
};

// 重写 markdown 中的图片路径（兼容相对路径与绝对路径）
export const rewriteImagePaths = (content: string): string =>
  content.replace(/\.\.\/images\//g, "/images/");
