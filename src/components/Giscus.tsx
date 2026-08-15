import { useEffect, useRef } from "react";

const GISCUS_CONFIG = {
  repo: "wwwaaa123122/blogcomment",
  repoId: "R_kgDOPX1knA",
  category: "Announcements",
  categoryId: "DIC_kwDOPX1knM4CtwEh",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "zh-CN",
  loading: "lazy",
};

function sendTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }
}

export default function Giscus() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = document.getElementById("giscus-container");
    if (!container) return;

    // 加载 giscus 脚本
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
    script.setAttribute("data-strict", GISCUS_CONFIG.strict);
    script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
    script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
    script.setAttribute("data-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    script.setAttribute("data-lang", GISCUS_CONFIG.lang);
    script.setAttribute("data-loading", GISCUS_CONFIG.loading);
    script.async = true;
    script.crossOrigin = "anonymous";

    container.innerHTML = "";
    container.appendChild(script);

    // 监听主题变化 — 向 giscus iframe 发送主题更新消息
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      // 立即尝试发送，iframe 可能还没加载
      sendTheme(theme);
      // 500ms 后再试一次（确保 iframe 已加载）
      setTimeout(() => sendTheme(theme), 500);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      container.innerHTML = "";
      initialized.current = false;
    };
  }, []);

  return <div id="giscus-container" className="mt-8 pt-8 border-t border-border" />;
}
