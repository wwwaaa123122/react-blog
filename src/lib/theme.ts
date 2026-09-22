// 主题相关的小工具。
// 主题状态本身由 next-themes（见 src/components/theme-provider.tsx）统一管理：
// 存储键 "theme"、取值 light / dark / system，通过 <html class="dark"> 生效。
// 这里只保留「同步移动端地址栏/状态栏底色」这一与主题状态无关的副作用。

const LIGHT_BG = "#f8f9fc";
const DARK_BG = "#0b0e14";

/** 把不带 media 限定的 theme-color meta 更新为当前实际主题底色 */
function syncThemeColor(): void {
  if (typeof document === "undefined") return;
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  let meta: HTMLMetaElement | null = null;
  for (const m of metas) {
    if (!m.hasAttribute("media")) meta = m;
  }
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  const dark = document.documentElement.classList.contains("dark");
  meta.setAttribute("content", dark ? DARK_BG : LIGHT_BG);
}

/** 监听 .dark class 变化（next-themes 切换主题时）并同步 theme-color */
export function watchThemeColor(): void {
  if (typeof document === "undefined") return;
  syncThemeColor();
  const observer = new MutationObserver(syncThemeColor);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
