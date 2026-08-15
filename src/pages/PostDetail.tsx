import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Home, ListTree } from "lucide-react";
import { getPostBySlug, formatDate, readingTime } from "../lib/posts";
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

  return (
    <>
      <Seo title={post.title} description={post.description || siteConfig.description}
        path={"/posts/" + post.slug} keywords={post.tags} ogType="article" ogImage={post.image} />
      <Breadcrumb items={[{ label: "文章", to: "/posts" }, { label: post.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />

      <article className="max-w-[720px] mx-auto">
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

        {toc.length > 1 && (
          <details className="mb-6">
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

        <footer className="mt-10 pt-6 border-t border-border text-sm text-muted-foreground">
          <p className="mb-4">本文发布于 {formatDate(post.published)} · &copy; {currentYear} {siteConfig.author}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/posts"><ArrowLeft className="size-3.5" /> 返回文章列表</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/"><Home className="size-3.5" /> 首页</Link></Button>
          </div>
        </footer>

        {/* Giscus 评论区 */}
        <Giscus />
      </article>
    </>
  );
}
