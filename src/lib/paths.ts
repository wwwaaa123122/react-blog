// Markdown 资源路径改写：`../images/x.webp` → `/images/x.webp`。
// 独立成模块，供构建期渲染器使用——避免它为了一个字符串替换去依赖 posts.ts
// （后者依赖构建产物 src/generated/*.json，首次生成时会形成循环依赖）。
export const rewriteImagePaths = (content: string): string =>
  content.replace(/\.\.\/images\//g, "/images/");
