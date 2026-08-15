import { useEffect } from "react";
import { siteConfig } from "../config/site";
import { absoluteUrl } from "../lib/seo";
import { assetUrl } from "../lib/base";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  ogType?: "website" | "article";
  ogImage?: string; // 封面图路径（本地 /images/x 或绝对 URL）
}

// 设置页面标题、描述、关键词、canonical 与 OG/Twitter 分享卡片 meta
export default function Seo({
  title,
  description,
  path,
  keywords,
  noindex,
  ogType = "website",
  ogImage,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} · ${siteConfig.title}`
      : siteConfig.title;
    document.title = fullTitle;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(
        `meta[${attr}="${key}"]`
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc = description || siteConfig.description;
    setMeta("name", "description", desc);
    setMeta("name", "keywords", (keywords || siteConfig.keywords).join(", "));

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", absoluteUrl(path || "/"));

    // noindex（需要屏蔽索引的页面）
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

    // ---- OG / Twitter 分享卡片 ----
    const url = absoluteUrl(path || "/");
    const ogImageUrl = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : absoluteUrl(assetUrl(ogImage.replace(/\.\.\/images\//, "images/")))
      : undefined;

    setMeta("property", "og:site_name", siteConfig.title);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", url);
    setMeta("property", "og:locale", "zh_CN");
    if (ogImageUrl) setMeta("property", "og:image", ogImageUrl);

    setMeta("name", "twitter:card", ogImageUrl ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    if (ogImageUrl) setMeta("name", "twitter:image", ogImageUrl);
  }, [title, description, path, keywords, noindex, ogType, ogImage]);

  return null;
}
