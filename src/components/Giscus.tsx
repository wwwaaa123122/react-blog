import { useEffect } from "react";

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

export default function Giscus() {
  useEffect(() => {
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

    const container = document.getElementById("giscus-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    // 监听主题变化
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (iframe) {
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: isDark ? "dark" : "light" } } },
          "https://giscus.app"
        );
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      if (container) container.innerHTML = "";
    };
  }, []);

  return <div id="giscus-container" className="mt-8 pt-8 border-t border-border" />;
}
