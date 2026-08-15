import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Home, ListTree } from "lucide-react";
import { getPostBySlug, formatDate, readingTime, publishedPosts } from "../lib/posts";
import Markdown, { slugify } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Giscus from "../components/Giscus";

function extractToc(content: string) {
  const toc: { level: number; text: string }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) toc.push({ level: m[1].length, text: m[2].replace(/[#*\x60]/g, "").trim() });
  }
  return toc;
}

export default function PostDetail() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">文章不存在或已被删除</p>
        <Button asChild variant="outline"><Link to="/posts">返回文章列表</Link></Button>
      </div>
    );
  }

  const toc = extractToc(post.content);
  const cover = post.image ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/")) : undefined;
  const currentYear = new Date().getFullYear();

  const currentIdx = publishedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? publishedPosts[currentIdx - 1] : null;
  const nextPost = currentIdx < publishedPosts.length - 1 ? publishedPosts[currentIdx + 1] : null;

  return (
    <>
      <Seo title={post.title} description={post.description || siteConfig.description}
        path={"/posts/" + post.slug} keywords={post.tags} ogType="article" ogImage={post.image} />
      <Breadcrumb items={[{ label: "文章", to: "/posts" }, { label: post.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />

      {/* 双栏布局：文章 + 右侧目录 */}
      <div className="flex gap-8 lg:gap-12 relative">
        {/* 文章主体 */}
        <article className="min-w-0 flex-1 max-w-[720px]">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4 [overflow-wrap:anywhere]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-6 text-sm text-muted-foreground">
            <time>{formatDate(post.published)}</time>
            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{readingTime(post.words)}</span>
            {post.category && <span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" />{post.category}</span>}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((t) => (
                <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                  <Badge variant="secondary" className="text-xs">{t}</Badge>
                </Link>
              ))}
            </div>
          )}

          {cover && (
            <div className="mb-8 -mx-5 md:mx-0">
              <img className="w-full rounded-xl shadow-sm" src={cover} alt={post.title} loading="lazy" />
            </div>
          )}

          {/* 移动端：折叠目录 */}
          {toc.length > 1 && (
            <details className="mb-6 lg:hidden">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground [&::-webkit-details-marker]:hidden">
                <ListTree className="size-4" /> 目录
              </summary>
              <ul className="mt-2 space-y-0.5 border-l-2 border-border pl-4 text-sm leading-7 text-muted-foreground">
                {toc.map((item, i) => (
                  <li key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                    <a href={"#" + slugify(item.text)} className="transition-colors hover:text-foreground">{item.text}</a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <Markdown content={post.content} />

          {/* 上一篇 / 下一篇 */}
          <nav className="mt-10 pt-6 border-t border-border grid grid-cols-2 gap-4">
            <div>
              {prevPost && (
                <Link to={"/posts/" + prevPost.slug} className="group block">
                  <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowLeft className="size-3" /> 上一篇
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {prevPost.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextPost && (
                <Link to={"/posts/" + nextPost.slug} className="group block">
                  <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1 justify-end">
                    下一篇 <ArrowRight className="size-3" />
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>

          <footer className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
            <p className="mb-4">本文发布于 {formatDate(post.published)} · &copy; {currentYear} {siteConfig.author}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ghost" size="sm"><Link to="/posts"><ArrowLeft className="size-3.5" /> 返回文章列表</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link to="/"><Home className="size-3.5" /> 首页</Link></Button>
            </div>
          </footer>

          <Giscus />
        </article>

        {/* 桌面端：右侧目录 */}
        {toc.length > 1 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">目录</h4>
              <nav className="space-y-0.5 border-l-2 border-border pl-3 text-sm leading-7 text-muted-foreground">
                {toc.map((item, i) => (
                  <div key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                    <a
                      href={"#" + slugify(item.text)}
                      className="block transition-colors hover:text-foreground truncate"
                    >
                      {item.text}
                    </a>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
