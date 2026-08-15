// 站点部署基础路径工具
// BASE_URL 由 Vite 根据 vite.config.ts 的 base 生成：
//   本地/根路径部署 => "/"
//   GitHub Pages 子路径部署 => "/react-blog/"
// Node 预渲染脚本（tsx）无 import.meta.env，通过 globalThis.__BASE_URL__ 注入
const nodeBase =
  typeof process !== "undefined" && process.env?.VITE_BASE
    ? process.env.VITE_BASE
    : undefined;

const rawBase: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.BASE_URL ??
  nodeBase ??
  (globalThis as unknown as { __BASE_URL__?: string }).__BASE_URL__ ??
  "/";

export const routerBase = rawBase.replace(/\/$/, "");

// 把站点资源路径转为部署环境下的实际地址（如 /images/x -> /react-blog/images/x）
export const assetUrl = (path: string): string => {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return rawBase + p;
};
