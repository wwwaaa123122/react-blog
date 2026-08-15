// Cloudflare Worker — 静态资源服务 + SPA 路由回退
// 不使用 @cloudflare/workers-types 避免类型冲突

interface Env {
  ASSETS: any;
  SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 尝试从静态资产读取
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }
    } catch {
      // 资产不存在，继续
    }

    // 2. 预渲染的静态页面（dist/posts/xxx/index.html 等）
    const indexUrl = new URL(request.url);
    indexUrl.pathname = path.endsWith("/") ? path + "index.html" : path + "/index.html";
    try {
      const indexReq = new Request(indexUrl.toString(), request);
      const indexAsset = await env.ASSETS.fetch(indexReq);
      if (indexAsset.status !== 404) {
        return indexAsset;
      }
    } catch {
      // 不存在
    }

    // 3. SPA 回退：返回 index.html
    const spaUrl = new URL(request.url);
    spaUrl.pathname = "/index.html";
    const spaReq = new Request(spaUrl.toString(), request);
    return env.ASSETS.fetch(spaReq);
  },
};
