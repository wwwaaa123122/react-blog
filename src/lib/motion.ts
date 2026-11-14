import { useEffect, useState } from "react";

/**
 * 动效偏好（prefers-reduced-motion）的两种读法：
 * - 函数版：给事件回调/命令式滚动用（JS 的 smooth 滚动不受 CSS 规则约束）
 * - Hook 版：给"按偏好决定是否播动画"的组件用
 *
 * 之前这两套分别散在 utils.ts 和 Home.tsx 里各写一份，媒体查询字符串重复，
 * 改一处容易漏另一处，统一收在这里。
 */
const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(QUERY).matches
  );
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
