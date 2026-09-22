import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/global.css";
import { routerBase } from "./lib/base";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { watchThemeColor } from "./lib/theme";

// 主题由 <head> 内联脚本提前应用（避免闪烁），ThemeProvider 接管后续切换与持久化；
// 这里只同步移动端地址栏/状态栏底色
watchThemeColor();

// Umami 统计分析
(function() {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://umami.xc-lr.cn/script.js';
  script.setAttribute('data-website-id', 'f92a0c32-598f-4700-8ac7-b3328d6133c8');
  script.setAttribute('data-domains', 'xc-lr.cn');
  document.head.appendChild(script);
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
      {/* shadcn Sonner：主题跟随 next-themes 的 .dark class */}
      <Toaster position="top-center" richColors={false} />
    </ThemeProvider>
  </StrictMode>
);
