// 标题 → 锚点 id 的共用实现。
// 必须同时被「构建期的 Markdown 渲染」与「客户端目录（TOC）」使用，
// 否则标题 id 与目录 href 会失配。
export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");
}

// GitHub 风格的标题 id 去重：重复的标题追加 -1、-2… 后缀，
// 保证锚点唯一（同一文档内按出现顺序调用）
export function createSlugger(): (text: string) => string {
  const used = new Set<string>();
  return (text: string) => {
    const base = slugify(text);
    if (!used.has(base)) {
      used.add(base);
      return base;
    }
    let i = 1;
    while (used.has(`${base}-${i}`)) i++;
    const id = `${base}-${i}`;
    used.add(id);
    return id;
  };
}
