import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingBar from "./LoadingBar";
import BackToTop from "./BackToTop";

export default function Layout() {
  const loc = useLocation();
  const [key, setKey] = useState(0);
  const prevPath = useRef(loc.pathname);
  const mounted = useRef(false);

  useEffect(() => {
    // 跳过首次挂载：预渲染 HTML 已被 React 接管，不重播动画，
    // 否则每次刷新都会看到内容再"加载"一遍（旧版 slideDown 的怪异来源）
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (prevPath.current !== loc.pathname) {
      prevPath.current = loc.pathname;
      setKey((k) => k + 1);
      // SPA 跳转后回到顶部（不覆盖带 #hash 的锚点跳转，那些不改变 pathname）
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        // 旧浏览器不支持 behavior:"instant"，退化为直接跳转
        window.scrollTo(0, 0);
      }
    }
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        跳到主要内容
      </a>
      <LoadingBar />
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-[900px] px-5 py-8 md:py-10">
          <div
            key={key}
            style={
              key === 0
                ? undefined
                : { animation: "fadeIn 0.22s ease-out both" }
            }
          >
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
