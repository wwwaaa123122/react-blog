import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Home, ListTree, RefreshCw } from "lucide-react";
import { getPostBySlug, formatDate, readingTime, publishedPosts } from "../lib/posts";
import Markdown, { slugify } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Giscus from "../components/Giscus";

function extractToc(content: string) {
  const toc: { level: number; text: string }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{1,4})\s+(.+)$/);
    if (m) {
      // 与 Markdown.tsx 的 headingText 对齐：图片整体去掉，链接只留文字，
      // 再去除粗体/斜体/代码标记（避免 TOC 锚点 href 与标题 id 失配）
      const text = m[2]
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*_`]/g, "")
        .trim();
      // 正文 # 标题在渲染时降级为 h2（页面已有文章标题 h1），目录按 level 2 对齐
      toc.push({ level: Math.max(2, m[1].length), text });
    }
  }
  return toc;
}

// 目录滚动高亮（scroll-spy）：滚动时找出视口上方最近的一个标题作为"当前章节"
function useActiveHeading(toc: { level: number; text: string }[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive("");
    // 标题由 Markdown 组件渲染（id = slugify(text)），滚动时取视口最上方的章节
    const onScroll = () => {
      const offset = 140; // 导航栏高度 + 阅读余量
      let current = "";
      for (const item of toc) {
        const el = document.getElementById(slugify(item.text));
        if (el && el.getBoundingClientRect().top <= offset) {
          current = slugify(item.text);
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  return active;
}

export default function PostDetail() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  // 注意：所有 hooks 必须在早期 return 之前调用（保持调用顺序稳定）
  const toc = useMemo(
    () => (post ? extractToc(post.content) : []),
    [post]
  );
  const activeHeading = useActiveHeading(toc);

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">文章不存在或已被删除</p>
        <Button asChild variant="outline"><Link to="/posts">返回文章列表</Link></Button>
      </div>
    );
  }

  const cover = post.image ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/")) : undefined;
  const currentYear = new Date().getFullYear();

  const currentIdx = publishedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? publishedPosts[currentIdx - 1] : null;
  const nextPost = currentIdx < publishedPosts.length - 1 ? publishedPosts[currentIdx + 1] : null;

  return (
    <>
      <Seo title={post.title} description={post.description || siteConfig.description}
        path={"/posts/" + post.slug + "/"} keywords={post.tags} ogType="article" ogImage={post.image} />
      <Breadcrumb items={[{ label: "文章", to: "/posts/" }, { label: post.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />

      {/* 双栏布局：文章 + 右侧目录 */}
      <div className="flex gap-8 lg:gap-12 relative">
        {/* 文章主体 */}
        <article className="min-w-0 flex-1 max-w-[720px]">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4 [overflow-wrap:anywhere]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-6 text-sm text-muted-foreground">
            <time dateTime={post.published}>{formatDate(post.published)}</time>
            {post.updated && post.updated !== post.published && (
              <span className="inline-flex items-center gap-1">
                <RefreshCw className="size-3" />
                <time dateTime={post.updated}>更新于 {formatDate(post.updated)}</time>
              </span>
            )}
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
              {/* 首屏封面：急切加载并提高优先级（LCP 元素），避免 lazy 延迟 */}
              <img className="w-full rounded-xl shadow-sm bg-muted" src={cover} alt={post.title} decoding="async" fetchPriority="high" />
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
          <nav aria-label="上一篇/下一篇" className="mt-10 pt-6 border-t border-border grid grid-cols-2 gap-4">
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
              <nav aria-label="文章目录" className="space-y-0.5 border-l-2 border-border pl-3 text-sm leading-7 text-muted-foreground">
                {toc.map((item, i) => (
                  <div key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                    <a
                      href={"#" + slugify(item.text)}
                      aria-current={activeHeading === slugify(item.text) ? "location" : undefined}
                      className={cn(
                        "block transition-colors hover:text-foreground truncate",
                        activeHeading === slugify(item.text)
                          ? "text-primary font-medium"
                          : undefined
                      )}
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
