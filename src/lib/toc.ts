import { createSlugger } from "./slug";

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

// 从 Markdown 源码提取目录（构建期执行一次，结果随正文 HTML 一起下发）。
// 代码围栏内的 # 注释行不是标题；锚点 id 必须与渲染器生成的标题 id 一致。
export function extractToc(content: string): TocItem[] {
  const items: Array<{ level: number; text: string }> = [];
  let inFence = false;
  for (const line of content.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{1,4})\s+(.+)$/);
    if (m) {
      // 与渲染器的 headingText 对齐：图片整体去掉，链接只留文字，
      // 再去除粗体/斜体/代码标记（避免 TOC 锚点 href 与标题 id 失配）
      const text = m[2]
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*_`]/g, "")
        .trim();
      // 正文 # 标题在渲染时降级为 h2（页面已有文章标题 h1），目录按 level 2 对齐
      items.push({ level: Math.max(2, m[1].length), text });
    }
  }
  // 与渲染一致的去重 id（重复标题追加 -1/-2）
  const slug = createSlugger();
  return items.map((t) => ({ ...t, id: slug(t.text) }));
}
