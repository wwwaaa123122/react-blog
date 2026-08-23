import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingBar from "./LoadingBar";

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
    }
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <LoadingBar />
      <Navbar />
      <main className="flex-1">
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
    </div>
  );
}
