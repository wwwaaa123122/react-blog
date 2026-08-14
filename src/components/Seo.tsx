import { useEffect } from "react";
import { siteConfig } from "../config/site";
import { absoluteUrl } from "../lib/seo";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
}

// 设置页面标题、描述、关键词与 canonical 链接
export default function Seo({ title, description, path, keywords, noindex }: SeoProps) {
  useEffect(() => {
    document.title = title
      ? `${title} · ${siteConfig.title}`
      : siteConfig.title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta(
      "description",
      description || siteConfig.description
    );
    setMeta("keywords", (keywords || siteConfig.keywords).join(", "));

    // noindex（如后台管理页）
    let robots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", absoluteUrl(path || "/"));

    return () => {
      // 组件卸载时不清理，避免页面切换时闪烁；由下一次渲染覆盖
    };
  }, [title, description, path, keywords, noindex]);

  return null;
}
