import { Link, useParams } from "react-router-dom";
import { BookOpen, Home, ListTree } from "lucide-react";
import { getPostBySlug, formatDate, readingTime } from "../lib/posts";
import Markdown, { slugify } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";
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
      <div className="py-20 text-center">
        <BookOpen className="mx-auto size-8 text-muted-foreground opacity-50" />
        <p className="mt-3 text-sm text-muted-foreground">文章不存在或已被删除</p>
        <div className="mt-5">
          <Button asChild size="sm"><Link to="/posts">返回文章列表</Link></Button>
        </div>
      </div>
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
      <Breadcrumb items={[{ label: "文章", to: "/posts" }, { label: post.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />

      <article className="mb-16">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 [overflow-wrap:anywhere]">
          {post.title}
        </h1>

        {/* Date + Reading Time */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <time>{formatDate(post.published)}</time>
          <span className="mx-1">·</span>
          {readingTime(post.words)}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {post.tags.map((t) => (
              <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                <Badge variant="secondary" className="text-xs">{t}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {cover && (
          <div className="mb-8 -mx-5 md:mx-0">
            <img className="w-full rounded-lg shadow-sm" src={cover} alt={post.title} loading="lazy" />
          </div>
        )}

        {/* TOC */}
        {toc.length > 1 && (
          <details className="mb-6 max-w-2xl mx-auto">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground [&::-webkit-details-marker]:hidden">
              <ListTree className="size-4" /> 目录
            </summary>
            <ul className="mt-2 space-y-0.5 border-l border-border pl-4 text-sm leading-7 text-muted-foreground">
              {toc.map((item, i) => (
                <li key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                  <a href={"#" + slugify(item.text)} className="transition-colors hover:text-foreground">{item.text}</a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Body */}
        <div className="max-w-2xl mx-auto">
          <Markdown content={post.content} />
        </div>

        {/* Footer */}
        <footer className="mt-10 max-w-2xl mx-auto border-t border-border pt-5 text-sm text-muted-foreground">
          <p>本文发布于 {formatDate(post.published)} · 转载需注明出处 · &copy; {currentYear} {siteConfig.author}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm"><Link to="/posts">&larr; 返回文章列表</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/"><Home className="size-4" /> 首页</Link></Button>
          </div>
        </footer>
      </article>
    </>
  );
}
