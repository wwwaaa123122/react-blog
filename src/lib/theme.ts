export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_MEDIA = "(prefers-color-scheme: dark)";

/** 当前系统主题 */
export function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light"; // Node 预渲染
  return window.matchMedia(DARK_MEDIA).matches ? "dark" : "light";
}

/** 把用户主题（含 system）解析为实际亮/暗 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? systemTheme() : theme;
}

/** 读取用户明确保存的主题；未保存或值非法时返回 null（视为跟随系统） */
export function getStoredTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** 初始主题：默认跟随系统，仅在用户明确选择过时用其选择 */
export function getInitialTheme(): Theme {
  return getStoredTheme() ?? "system";
}

// shadcn/ui 深色模式约定：在 <html> 上切换 .dark class
export function applyTheme(
  theme: Theme,
  options: { persist?: boolean } = {}
): void {
  const { persist = true } = options;
  if (typeof document !== "undefined") {
    const resolved = resolveTheme(theme);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    // 同步浏览器地址栏/状态栏底色（移动端），与背景色一致避免突兀色块
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", resolved === "dark" ? "#0b0e14" : "#f8f9fc");
  }
  // 仅在用户明确选择时写入 localStorage；跟随系统时清除保存值，
  // 这样"默认跟随系统"不会因首次访问把系统主题写死成用户选择。
  if (!persist) return;
  try {
    if (theme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    /* ignore */
  }
}

/** 监听系统主题变化（仅当主题为 system 时由调用方订阅） */
export function watchSystemTheme(listener: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(DARK_MEDIA);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}
