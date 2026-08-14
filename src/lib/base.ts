// 站点部署基础路径工具
// BASE_URL 由 Vite 根据 vite.config.ts 的 base 生成：
//   本地/根路径部署 => "/"
//   GitHub Pages 子路径部署 => "/react-blog/"
export const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

// 把站点资源路径转为部署环境下的实际地址（如 /images/x -> /react-blog/images/x）
export const assetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return base + p;
};
