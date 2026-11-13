import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route, Navigate } from "./lib/router";
import { assetUrl } from "./lib/base";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { Spinner } from "./components/ui/spinner";

// 路由级分包：首页保持同步（它是入口页），其余页面全部按需下载。
// 文章详情页与组件预览页尤其重（Markdown 渲染链 / 整个 shadcn 组件库），
// 只有对应路由的访客才付这份流量。
const Posts = lazy(() => import("./pages/Posts"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Friends = lazy(() => import("./pages/Friends"));
const About = lazy(() => import("./pages/About"));
const Archive = lazy(() => import("./pages/Archive"));
const Components = lazy(() => import("./pages/Components"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LazyFallback() {
  return (
    <div className="flex justify-center py-20 text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  );
}

function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Component />
    </Suspense>
  );
}

/**
 * 懒加载页面的注入点。
 *
 * 浏览器运行时用默认的 React.lazy 版本（分包下载）；预渲染脚本在 Node 里
 * 先用 `await import()` 取到真实组件再注入，renderToString 才能同步
 * 序列化出真实内容，而不是 Suspense fallback。
 */
export interface AppPages {
  posts?: ComponentType;
  postDetail?: ComponentType;
  friends?: ComponentType;
  about?: ComponentType;
  archive?: ComponentType;
  components?: ComponentType;
  notFound?: ComponentType;
}

export default function App({ pages = {} }: { pages?: AppPages } = {}) {
  const P = {
    Posts: pages.posts ?? Posts,
    PostDetail: pages.postDetail ?? PostDetail,
    Friends: pages.friends ?? Friends,
    About: pages.about ?? About,
    Archive: pages.archive ?? Archive,
    Components: pages.components ?? Components,
    NotFound: pages.notFound ?? NotFound,
  };

  return (
    <Routes>
      {/* 站外跳转（不经过 Layout） */}
      <Route path="/gh" element={<Navigate to="https://github.com/wwwaaa123122" replace />} />
      <Route path="/bot" element={<Navigate to="https://xc.bot.cd/" replace />} />
      <Route path="/rss" element={<Navigate to={assetUrl("/rss.xml")} replace />} />

      {/* 主站页面 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={withSuspense(P.Posts)} />
        <Route path="/posts/:slug" element={withSuspense(P.PostDetail)} />
        <Route path="/friends" element={withSuspense(P.Friends)} />
        <Route path="/about" element={withSuspense(P.About)} />
        <Route path="/archive" element={withSuspense(P.Archive)} />
        <Route path="/components" element={withSuspense(P.Components)} />
        <Route path="*" element={withSuspense(P.NotFound)} />
      </Route>
    </Routes>
  );
}
