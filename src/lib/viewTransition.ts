import { flushSync } from "react-dom";
import type { To } from "react-router-dom";

const VT_CLASS = "vt-running";

/** 浏览器是否支持 View Transitions API */
export function viewTransitionSupported(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as Document & { startViewTransition?: unknown })
      .startViewTransition === "function"
  );
}

/**
 * 带共享元素过渡的导航：文章列表的标题/封面会"飞"到文章页顶部对应位置。
 * - 不支持 View Transitions 的浏览器直接普通导航（Layout 淡入兜底）
 * - 过渡期间在 <html> 上打 vt-running 标记，Layout/LoadingBar 借此跳过重复动画
 * - 导航前滚动到顶部，保证新页面快照从文章开头开始
 */
export function navigateWithViewTransition(
  navigate: (to: To) => void,
  to: To
): void {
  if (!viewTransitionSupported()) {
    window.scrollTo({ top: 0 });
    navigate(to);
    return;
  }
  const doc = document as Document & {
    startViewTransition: (cb: () => void) => { finished: Promise<void> };
  };
  document.documentElement.classList.add(VT_CLASS);
  const t = doc.startViewTransition(() => {
    window.scrollTo({ top: 0 });
    flushSync(() => navigate(to));
  });
  t.finished
    .catch(() => undefined)
    .finally(() => {
      document.documentElement.classList.remove(VT_CLASS);
    });
}

/** 当前是否处于视图过渡中 */
export function isViewTransitionRunning(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains(VT_CLASS)
  );
}
