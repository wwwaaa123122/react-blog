import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

// shadcn/ui 官方推荐的 Vite 深色模式方案：
// 以 next-themes 作为主题唯一数据源（存储键沿用本站既有的 "theme"，
// 取值 light / dark / system），在 <html> 上切换 .dark class。
// <head> 内联脚本负责首屏前应用主题，避免刷新闪白。
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
