import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const loc = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 路由变化时触发动画
    const el = mainRef.current;
    if (el) {
      el.classList.remove("page-enter");
      // 强制浏览器重排以重新触发动画
      void el.offsetWidth;
      el.classList.add("page-enter");
    }
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[900px] px-5 py-8 md:py-10">
          <div ref={mainRef} className="page-enter">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
