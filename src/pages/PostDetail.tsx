import { Link, useParams } from "react-router-dom";
import { BookOpen, Clock, Home, ListTree, Tag } from "lucide-react";
import { getPostBySlug, formatDate, readingTime } from "../lib/posts";
import Markdown, { slugify } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function extractToc(content: string) {
  const toc: { level: number; text: string }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) {
      toc.push({ level: m[1].length, text: m[2].replace(/[#*\x60]/g, "").trim() });
    }
  }
  return toc;
}

export default function PostDetail() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <Card className="py-14 text-center text-muted-foreground">
        <div className="flex justify-center opacity-50">
          <BookOpen className="size-11" />
        </div>
        <p className="mt-3">文章不存在或已被删除</p>
        <div className="mt-4">
          <Button asChild>
            <Link to="/posts">返回文章列表</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const toc = extractToc(post.content);
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Seo
        title={post.title}
        description={post.description || siteConfig.description}
        path={"/posts/" + post.slug}
        keywords={post.tags}
        ogType="article"
        ogImage={post.image}
      />
      <Breadcrumb
        items={[
          { label: "文章", to: "/posts" },
          { label: post.title },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }}
      />

      <Card className="px-[40px] py-9 sm:p-6 sm:pt-7">
        <header className="mb-6 border-b border-border pb-5">
          <h1 className="text-[26px] font-extrabold leading-snug tracking-[0.3px] [overflow-wrap:anywhere]">
            {post.title}
          </h1>
          <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatDate(post.published)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {readingTime(post.words)} · {post.words} 字
            </span>
            {post.category && (
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-3.5" />
                {post.category}
              </span>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to={"/posts?tag=" + encodeURIComponent(t)}
                  className="transition-opacity hover:opacity-80"
                >
                  <Badge variant="secondary">{t}</Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        {cover && (
          <img
            className="mb-6 max-h-[320px] w-full rounded-xl object-cover"
            src={cover}
            alt={post.title}
            loading="lazy"
          />
        )}

        {toc.length > 1 && (
          <details className="mb-5">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[14px] font-semibold text-muted-foreground [&::-webkit-details-marker]:hidden">
              <ListTree className="size-4" />
              目录
            </summary>
            <ul className="mt-2.5 space-y-0.5 border-l border-border pl-5 text-[13.5px] leading-7 text-muted-foreground">
              {toc.map((item, i) => (
                <li key={i} style={{ paddingLeft: (item.level - 2) * 14 }}>
                  <a
                    href={"#" + slugify(item.text)}
                    className="transition-colors hover:text-primary"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <Markdown content={post.content} />

        <footer className="mt-9 border-t border-border pt-5 text-[13.5px] text-muted-foreground">
          <p>
            本文发布于 {formatDate(post.published)} · 转载需注明出处 · ©{" "}
            {currentYear} 星辰旅人
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            <Button asChild variant="outline">
              <Link to="/posts">← 返回文章列表</Link>
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="size-4" />
                首页
              </Link>
            </Button>
          </div>
        </footer>
      </Card>
    </>
  );
}
