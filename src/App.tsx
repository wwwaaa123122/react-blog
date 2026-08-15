import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Friends from "./pages/Friends";
import About from "./pages/About";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* 站外跳转（不经过 Layout） */}
      <Route path="/gh" element={<Navigate to="https://github.com/wwwaaa123122" replace />} />
      <Route path="/bot" element={<Navigate to="https://xc.bot.cd/" replace />} />
      <Route path="/rss" element={<Navigate to="/rss.xml" replace />} />

      {/* 主站页面 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/about" element={<About />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
