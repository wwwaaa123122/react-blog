import { siteConfig } from "../config/site";
import type { Post } from "../types";

export const siteUrl = (): string => siteConfig.site_url.replace(/\/$/, "");

export const absoluteUrl = (path: string): string =>
  `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

// 面包屑 JSON-LD
export function breadcrumbJsonLd(
  items: { label: string; to?: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: absoluteUrl(item.to) } : {}),
    })),
  };
}

// 站点 JSON-LD（首页）
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    alternateName: siteConfig.author,
    description: siteConfig.description,
    url: siteUrl(),
  };
}

// 文章 JSON-LD
export function articleJsonLd(post: Post): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.published,
    dateModified: post.published,
    author: { "@type": "Person", name: siteConfig.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.title,
    },
    ...(post.image
      ? { image: absoluteUrl(post.image.replace(/\.\.\/images\//, "/images/")) }
      : {}),
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
  };
}

// 通用 JSON-LD 注入
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}
