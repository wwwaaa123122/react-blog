import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { assetUrl } from "./lib/base";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Friends from "./pages/Friends";
import About from "./pages/About";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import { Spinner } from "./components/ui/spinner";

// 组件预览页聚合了整个 shadcn/ui 组件库（含 cmdk / react-day-picker / vaul 等），
// 文章详情页含 react-markdown + highlight.js（Markdown 渲染链最重），
// 两者都远大于其它内容页，因此单独分包：只有对应路由的访客才下载。
const Components = lazy(() => import("./pages/Components"));
const PostDetail = lazy(() => import("./pages/PostDetail"));

function LazyFallback() {
  return (
    <div className="flex justify-center py-20 text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  );
}

/**
 * 懒加载页面的注入点。
 *
 * 浏览器运行时用默认的 React.lazy 版本（分包下载）；预渲染脚本在 Node 里
 * 先用 `await import()` 取到真实组件再注入，renderToStaticMarkup 才能同步
 * 序列化出真实内容，而不是 Suspense fallback。
 */
export interface AppProps {
  PostDetailComponent?: ComponentType;
  ComponentsComponent?: ComponentType;
}

export default function App({ PostDetailComponent, ComponentsComponent }: AppProps = {}) {
  const PostDetailPage = PostDetailComponent ?? PostDetail;
  const ComponentsPage = ComponentsComponent ?? Components;

  return (
    <Routes>
      {/* 站外跳转（不经过 Layout） */}
      <Route path="/gh" element={<Navigate to="https://github.com/wwwaaa123122" replace />} />
      <Route path="/bot" element={<Navigate to="https://xc.bot.cd/" replace />} />
      <Route path="/rss" element={<Navigate to={assetUrl("/rss.xml")} replace />} />

      {/* 主站页面 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/posts/:slug"
          element={
            <Suspense fallback={<LazyFallback />}>
              <PostDetailPage />
            </Suspense>
          }
        />
        <Route path="/friends" element={<Friends />} />
        <Route path="/about" element={<About />} />
        <Route path="/archive" element={<Archive />} />
        <Route
          path="/components"
          element={
            <Suspense fallback={<LazyFallback />}>
              <ComponentsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
