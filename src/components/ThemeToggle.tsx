import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  applyTheme,
  getInitialTheme,
  watchSystemTheme,
  type Theme,
} from "../lib/theme";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    // 跟随系统时实时响应系统主题变化
    if (theme !== "system") return;
    return watchSystemTheme(() => applyTheme("system", { persist: false }));
  }, [theme]);

  return (
    <DropdownMenu>
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
          className={cn(theme === "light" && "bg-accent text-accent-foreground")}
        >
          <Sun />
          浅色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(theme === "dark" && "bg-accent text-accent-foreground")}
        >
          <Moon />
          深色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(theme === "system" && "bg-accent text-accent-foreground")}
        >
          <Monitor />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
