import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 主题切换：shadcn DropdownMenu + next-themes（与 ThemeProvider 同一数据源）
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    // modal={false}：与移动端导航菜单同理，避免展开时给 <body> 注入
    // margin-right 补偿（桌面端有滚动条时会额外平移居中容器）
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="切换主题"
          title="切换主题"
        >
          <Sun className="size-[19px] dark:hidden" />
          <Moon className="hidden size-[19px] dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          data-active={theme === "light" ? "" : undefined}
          className="data-[active]:bg-accent"
        >
          <Sun />
          浅色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          data-active={theme === "dark" ? "" : undefined}
          className="data-[active]:bg-accent"
        >
          <Moon />
          深色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          data-active={theme === "system" ? "" : undefined}
          className="data-[active]:bg-accent"
        >
          <Monitor />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
