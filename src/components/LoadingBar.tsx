import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// 路由切换时的顶部加载进度条（nprogress 风格）
// - 仅在发生路由跳转时出现（首次加载不播，避免和预渲染首屏重复动画）
// - 每次跳转通过 key 重新挂载，纯 CSS 播完一次后淡出，无需 JS 定时器
export default function LoadingBar() {
  const { pathname } = useLocation();
  const [barKey, setBarKey] = useState<string | null>(null);
  const prevPath = useRef(pathname);
  const mounted = useRef(false);

  useEffect(() => {
    // 跳过首次挂载
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setBarKey(pathname);
    }
  }, [pathname]);

  if (barKey === null) return null;
  return <div key={barKey} className="route-loading-bar" aria-hidden="true" />;
}
