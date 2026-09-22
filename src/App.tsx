import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { assetUrl } from "./lib/base";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Friends from "./pages/Friends";
import About from "./pages/About";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import { Spinner } from "./components/ui/spinner";

// 组件预览页聚合了整个 shadcn/ui 组件库（含 cmdk / react-day-picker / vaul 等），
// 体积远大于内容页，因此单独分包：只有访问 /components 的访客才下载。
// 预渲染在 Node 中等待 lazy 解析完成，静态 HTML 依然是完整内容。
const Components = lazy(() => import("./pages/Components"));

export default function App() {
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
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/about" element={<About />} />
        <Route path="/archive" element={<Archive />} />
        <Route
          path="/components"
          element={
            <Suspense
              fallback={
                <div className="flex justify-center py-20 text-muted-foreground">
                  <Spinner className="size-6" />
                </div>
              }
            >
              <Components />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
