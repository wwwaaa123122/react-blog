import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Menu, menuItemClass } from "@/components/ui/menu"

// 主题切换：轻量菜单 + next-themes（与 ThemeProvider 同一数据源）
const OPTIONS = [
  { value: "light", label: "浅色模式", icon: Sun },
  { value: "dark", label: "深色模式", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
] as const

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Menu
      label="切换主题"
      trigger={
        <Button variant="ghost" size="icon-lg" aria-label="切换主题" title="切换主题">
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      }
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="menuitem"
          tabIndex={-1}
          data-active={theme === value ? "" : undefined}
          className={menuItemClass}
          onClick={() => setTheme(value)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </Menu>
  )
}
