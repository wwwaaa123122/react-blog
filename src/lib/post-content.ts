import type { TocItem } from "./toc";

/**
 * 文章正文（HTML + 目录）的运行时入口。
 *
 * 正文在构建期已编译好（scripts/build-content.mts），这里只负责「怎么拿到它」：
 *
 * 1. 首屏（直接访问 / 打开文章链接）
 *    页面本来就是预渲染的，正文已经在 DOM 里。main.tsx 在挂载 React 之前调用
 *    primeFromPrerenderedDom() 把它收进缓存 —— 不额外下载任何数据，也不重解析，
 *    更不会出现「预渲染内容被清空、再等 JS 重建」的闪烁。
 *
 * 2. 站内跳转到另一篇文章
 *    按 slug 动态 import 对应的 JSON chunk（单独一篇约 8 KB gzip），
 *    期间抛出 promise 交给 <Suspense>，加载完即渲染。
 *
 * 3. Node（预渲染 / RSS）
 *    preloadAllContent() 从磁盘同步读入全部 JSON，之后的渲染都是同步的。
 */
export interface PostContent {
  html: string;
  toc: TocItem[];
}

const isNode = typeof process !== "undefined" && !!process.versions?.node;

const cache = new Map<string, PostContent>();
const inflight = new Map<string, Promise<PostContent>>();

// Vite 为每个 JSON 生成独立 chunk；Node 下没有 import.meta.glob，走磁盘分支
const loaders: Record<string, () => Promise<{ default: PostContent }>> = isNode
  ? {}
  : import.meta.glob<{ default: PostContent }>("../generated/posts/*.json");

const loaderKey = (slug: string): string => `../generated/posts/${slug}.json`;

/**
 * 首屏接管：把预渲染 DOM 里的正文与标题锚点收进缓存。
 * 必须在 createRoot().render() 之前调用（React 挂载会清空 #root）。
 */
export function primeFromPrerenderedDom(): void {
  if (typeof document === "undefined") return;
  const article = document.querySelector<HTMLElement>("[data-prerendered-post]");
  const slug = article?.getAttribute("data-prerendered-post");
  if (!article || !slug || cache.has(slug)) return;
  const markdown = article.querySelector<HTMLElement>(".markdown");
  if (!markdown) return;

  const toc: TocItem[] = Array.from(
    markdown.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]")
  ).map((el) => ({
    level: Number(el.tagName[1]),
    text: (el.textContent ?? "").trim(),
    id: el.id,
  }));

  cache.set(slug, { html: markdown.innerHTML, toc });
}

/** 预渲染 / 构建脚本用：从磁盘载入全部文章正文 */
export async function preloadAllContent(): Promise<void> {
  if (!isNode) return;
  const [{ readdirSync, readFileSync }, { join }] = await Promise.all([
    import(/* @vite-ignore */ "node:fs"),
    import(/* @vite-ignore */ "node:path"),
  ]);
  const dir = join(process.cwd(), "src/generated/posts");
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const slug = file.slice(0, -".json".length);
      if (cache.has(slug)) continue;
      cache.set(slug, JSON.parse(readFileSync(join(dir, file), "utf-8")) as PostContent);
    }
  } catch {
    // 未生成内容时保持空缓存：页面会退化为「文章不存在」，但不会崩构建
  }
}

/**
 * 同步取正文；未命中时抛出正在加载的 promise（React Suspense 契约）。
 * 没有任何 chunk 对应这个 slug 时返回 undefined（调用方渲染 404）。
 */
export function getPostContentOrSuspend(slug: string): PostContent | undefined {
  const hit = cache.get(slug);
  if (hit) return hit;

  const load = loaders[loaderKey(slug)];
  if (!load) return undefined;

  let pending = inflight.get(slug);
  if (!pending) {
    pending = load().then((mod) => {
      cache.set(slug, mod.default);
      inflight.delete(slug);
      return mod.default;
    });
    inflight.set(slug, pending);
  }
  throw pending;
}
