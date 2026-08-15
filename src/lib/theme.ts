export type Theme = "light" | "dark";

export function getInitialTheme(): Theme {
  try {
    if (typeof window === "undefined") return "light"; // Node 预渲染
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// shadcn/ui 深色模式约定：在 <html> 上切换 .dark class
export function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* ignore */
  }
}
