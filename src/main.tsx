import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/global.css";
import { applyTheme, getInitialTheme } from "./lib/theme";
import { routerBase } from "./lib/base";

// 首屏前应用主题，避免闪烁（<head> 内联脚本已提前应用；此处不写入 localStorage，
// 以免把系统主题写死成用户选择，破坏"默认跟随系统"）
applyTheme(getInitialTheme(), { persist: false });

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
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
