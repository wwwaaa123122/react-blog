// 全站标题大纲校验：renderToString 渲染各路由，检查 h1 唯一且层级不跳级
import { join } from "node:path";
process.env.POSTS_DIR = join(process.cwd(), "src/posts");
process.env.VITE_BASE = "/";

const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("../src/lib/router");
const React = (await import("react")).default;
const { default: App } = await import("../src/App");
const { publishedPosts } = await import("../src/lib/posts");
const { preloadAllContent } = await import("../src/lib/post-content");

// 路由页面都是按需加载的：这里先全部取到再注入 App，
// 否则 renderToString 只会序列化出 Suspense fallback（没有 h1，误报大纲问题）。
const [PostDetail, Posts, Friends, About, Archive, NotFound] = await Promise.all([
  import("../src/pages/PostDetail").then((m) => m.default),
  import("../src/pages/Posts").then((m) => m.default),
  import("../src/pages/Friends").then((m) => m.default),
  import("../src/pages/About").then((m) => m.default),
  import("../src/pages/Archive").then((m) => m.default),
  import("../src/pages/NotFound").then((m) => m.default),
]);
// 正文 HTML 是构建期产物，先读进缓存，文章页才能同步渲染
await preloadAllContent();
const pages = { postDetail: PostDetail, posts: Posts, friends: Friends, about: About, archive: Archive, notFound: NotFound };

// 文章路由由 publishedPosts 派生，而不是硬编码 slug：
// 草稿（draft: true）会被自动排除，避免「文章转为草稿」时这里拿不到文章、
// PostDetail 落到「文章不存在」分支（无 h1）而误报为大纲问题。
if (publishedPosts.length === 0) {
  console.error("✗ 未加载到任何已发布文章，文章加载管线可能已损坏");
  process.exit(1);
}

const routes = [
  "/", "/posts/", "/archive", "/friends", "/about",
  ...publishedPosts.map((p) => `/posts/${p.slug}/`),
];

let issues = 0;
for (const r of routes) {
  const html = renderToString(
    React.createElement(MemoryRouter, { basename: "", initialEntries: [r] }, React.createElement(App, { pages }))
  );
  const heads = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((m) => parseInt(m[1]));
  const h1s = heads.filter((h) => h === 1).length;
  let skips: string[] = [];
  for (let i = 1; i < heads.length; i++) {
    if (heads[i] > heads[i - 1] + 1) skips.push(`${heads[i - 1]}->${heads[i]}`);
  }
  if (h1s !== 1 || skips.length) {
    issues++;
    console.log(`✗ ${r}: h1=${h1s} skips=${skips.join(",") || "none"}`);
  } else {
    console.log(`✓ ${r}`);
  }
}
if (issues === 0) console.log("\nALL OUTLINES VALID");
else { console.error(`\n${issues} route(s) with outline issues`); process.exit(1); }
