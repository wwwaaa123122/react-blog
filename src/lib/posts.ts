import type { Post } from "../types";
import meta from "../generated/posts-meta.json";

// 文章数据流（构建期 → 运行期）：
//   scripts/build-content.mts 解析 Markdown，产出 src/generated/posts-meta.json（仅元数据）
//   本模块只读元数据：首页/列表/归档/详情页的骨架都靠它，体积约 3 KB
//   正文 HTML 由 ../lib/post-content.ts 单独引入，只有文章页会下载
//
// 这样做的关键收益：入口包里不再包含全部文章的 Markdown 源码，
// 也不再需要 top-level await 去加载/解析它们（会拖慢首屏模块求值）。

export const allPosts: Post[] = meta as Post[];

export const publishedPosts: Post[] = allPosts
  .filter((p) => !p.draft)
  .sort((a, b) => (a.published < b.published ? 1 : -1));

// slug → 文章，避免详情页/预渲染每次 find（O(n)）
const bySlug = new Map(publishedPosts.map((p) => [p.slug, p]));

export const getPostBySlug = (slug: string): Post | undefined => bySlug.get(slug);

// 标签集合与顺序是静态的：算一次即可（此前每次渲染都会重扫全部文章）
const TAGS: string[] = (() => {
  const set = new Set<string>();
  for (const p of publishedPosts) {
    for (const t of p.tags) set.add(t);
  }
  return Array.from(set).sort();
})();

export const getAllTags = (): string[] => TAGS;

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
// 实现放在 ./paths，构建期渲染器也用它（避免首次生成时的循环依赖）
export { rewriteImagePaths } from "./paths";
