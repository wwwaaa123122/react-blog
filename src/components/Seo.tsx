import { useEffect } from "react";
import { siteConfig } from "../config/site";
import { absoluteUrl } from "../lib/seo";
import { assetUrl } from "../lib/base";
import coverSizes from "../data/cover-sizes.json";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  ogType?: "website" | "article";
  ogImage?: string; // 封面图路径（本地 /images/x 或绝对 URL）
  // 文章类页面的补充 meta（对应 article: 前缀与 Twitter/X 卡片）
  articlePublished?: string;
  articleModified?: string;
  articleSection?: string;
  articleTags?: string[];
}

// 设置页面标题、描述、关键词、canonical、hreflang 与 OG/Twitter/文章 meta
export default function Seo({
  title,
  description,
  path,
  keywords,
  noindex,
  ogType = "website",
  ogImage,
  articlePublished,
  articleModified,
  articleSection,
  articleTags,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title
      ? (title.includes(siteConfig.title) ? title : `${title} · ${siteConfig.title}`)
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
    // 文章（宽封面）用大图卡，站点/页面（方形头像等）用小图卡
    setMeta("name", "twitter:card", ogImageUrl && ogType === "article" ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);

    // 无封面时移除上一页残留的图片 meta（否则文章 → 无图页面后 OG 仍是旧图）
    const removeMeta = (attr: "name" | "property", key: string) => {
      document.querySelector(`meta[${attr}="${key}"]`)?.remove();
    };
    if (ogImageUrl) {
      setMeta("property", "og:image", ogImageUrl);
      setMeta("name", "twitter:image", ogImageUrl);
      const size = ogImage && !ogImage.startsWith("http")
        ? coverSizes[ogImage as keyof typeof coverSizes]
        : undefined;
      if (size) {
        setMeta("property", "og:image:width", String(size.w));
        setMeta("property", "og:image:height", String(size.h));
      } else {
        removeMeta("property", "og:image:width");
        removeMeta("property", "og:image:height");
      }
    } else {
      removeMeta("property", "og:image");
      removeMeta("name", "twitter:image");
      removeMeta("property", "og:image:width");
      removeMeta("property", "og:image:height");
    }

    // 图片 alt（无障碍 + 部分社交平台的图文说明）
    if (ogImageUrl) setMeta("property", "og:image:alt", desc);
    else removeMeta("property", "og:image:alt");

    // ---- 文章扩展 meta（og:type=article 时 Google 新闻等会读取）----
    // 先清掉上一页残留的同名 meta（article:tag 会重复出现多份），再按当前文章重写
    const removeMetaAll = (attr: "name" | "property", key: string) => {
      document.querySelectorAll(`meta[${attr}="${key}"]`).forEach((el) => el.remove());
    };
    removeMetaAll("property", "article:published_time");
    removeMetaAll("property", "article:modified_time");
    removeMetaAll("property", "article:section");
    removeMetaAll("property", "article:tag");
    if (articlePublished) {
      setMeta("property", "article:published_time", articlePublished);
      setMeta("property", "article:modified_time", articleModified || articlePublished);
    }
    if (articleSection) setMeta("property", "article:section", articleSection);
    articleTags?.forEach((t) => setMeta("property", "article:tag", t));

    // ---- hreflang：单语站点也显式声明，搜索引擎据此判定语言版本 ----
    const setLangLink = (hreflang: string, url: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[hreflang="${hreflang}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", hreflang);
        document.head.appendChild(link);
      }
      link.href = url;
    };
    if (!noindex) {
      setLangLink("zh-Hans", url);
      setLangLink("x-default", url);
    }
  }, [title, description, path, keywords, noindex, ogType, ogImage, articlePublished, articleModified, articleSection, articleTags]);

  return null;
}