// 共用 frontmatter 解析器（构建脚本 generate-seo.mjs / prerender.tsx 使用）
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function parseFrontmatter(raw) {
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
      } else if (value === "" || value === "null" || value === "~") {
        data[key] = null;
      } else {
        data[key] = value;
      }
    }
    i++;
  }
  return { data, content: lines.slice(i + 1).join("\n") };
}

// 读取并解析所有文章（过滤草稿）
export function loadPosts(postsDir) {
  return readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = readFileSync(join(postsDir, f), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title || f),
        published: String(data.published || ""),
        description: String(data.description || ""),
        image: data.image ? String(data.image) : undefined,
        tags,
        category: String(data.category || ""),
        draft: Boolean(data.draft),
        content,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));
}
