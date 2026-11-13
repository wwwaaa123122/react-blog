"use client"

import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import { Toaster } from "./ui/sonner"

// 独立的 toast 宿主。
//
// 单独挂一棵 React 根：这样 sonner 与图标不会被打进入口包，只有真正触发提示
// （复制链接、复制失败等）时才会下载。主题跟随 <html class="dark">，不依赖
// ThemeProvider 上下文，因此可以挂在应用树之外。

let resolveReady: (() => void) | null = null

/** 宿主挂载完成（Toaster 已订阅）后 resolve，避免第一条提示丢失 */
export const whenToastHostReady = new Promise<void>((resolve) => {
  resolveReady = resolve
})

function Host() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Toaster 订阅发生在它的 effect 里，父组件的 effect 晚于子组件执行
    resolveReady?.()
  }, [])

  return <Toaster theme={theme} position="top-center" richColors={false} />
}

export function mountToastHost(): void {
  if (document.getElementById("cn-toast-host")) return
  const container = document.createElement("div")
  container.id = "cn-toast-host"
  document.body.appendChild(container)
  createRoot(container).render(<Host />)
}
