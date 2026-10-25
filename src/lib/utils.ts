import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JS 触发的平滑滚动不受 CSS `prefers-reduced-motion` 规则约束（behavior 参数优先），
// 需要在调用处显式判断；SSR/无 matchMedia 环境按不减弱处理。
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
