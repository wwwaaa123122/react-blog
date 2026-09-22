import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Home, ListTree, RefreshCw } from "lucide-react";
import { getPostBySlug, formatDate, readingTime, publishedPosts } from "../lib/posts";
import Markdown, { createSlugger } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Giscus from "../components/Giscus";

function extractToc(content: string) {
  const toc: { level: number; text: string }[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    // 代码围栏内的 # 注释行不是标题，跳过（此前会被误判为目录项）
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
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
  // 与 Markdown 渲染一致的去重 id（重复标题追加 -1/-2）
  const slug = createSlugger();
  return toc.map((t) => ({ ...t, id: slug(t.text) }));
}

// 目录滚动高亮（scroll-spy）：滚动时找出视口上方最近的一个标题作为"当前章节"
function useActiveHeading(toc: { level: number; text: string; id: string }[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive("");
    // 标题由 Markdown 组件渲染（id 与目录一致，重复标题带 -1/-2 后缀）
    const onScroll = () => {
      const offset = 140; // 导航栏高度 + 阅读余量
      let current = "";
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = item.id;
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

  // 长目录：高亮项滚出目录内部视口时，把目录滚动到该项（仅滚动最近的可滚动祖先）
  useEffect(() => {
    if (!active) return;
    const el = document.querySelector(`[data-toc-id="${CSS.escape(active)}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

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
      <>
        <Seo title="文章不存在" description="文章不存在或已被删除" noindex />
        <Empty className="py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>文章不存在或已被删除</EmptyTitle>
            <EmptyDescription>链接可能已失效，或这篇文章已被移除。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link to="/posts">
                <ArrowLeft data-icon="inline-start" />
                返回文章列表
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </>
    );
  }

  const cover = post.image ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/")) : undefined;
  const currentYear = new Date().getFullYear();

  // 上一篇 = 更新的文章（后发），下一篇 = 更早的文章（先发）；列表按发布时间倒序
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

          <div className="mb-6 flex flex-wrap items-center gap-2 text-muted-foreground">
            <Badge variant="secondary" className="font-normal">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </Badge>
            {post.updated && post.updated !== post.published && (
              <Badge variant="secondary" className="font-normal">
                <RefreshCw data-icon="inline-start" />
                <time dateTime={post.updated}>更新于 {formatDate(post.updated)}</time>
              </Badge>
            )}
            <Badge variant="secondary" className="font-normal">
              <Clock data-icon="inline-start" />
              {readingTime(post.words)}
            </Badge>
            {post.category && (
              <Badge variant="secondary" className="font-normal">
                <BookOpen data-icon="inline-start" />
                {post.category}
              </Badge>
            )}
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

          {/* 移动端：折叠目录（shadcn Collapsible） */}
          {toc.length > 1 && (
            <Collapsible className="mb-6 lg:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ListTree data-icon="inline-start" />
                  目录
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav
                  aria-label="文章目录"
                  className="mt-2 max-h-72 overflow-y-auto space-y-0.5 border-l-2 border-border pl-4 text-sm leading-7 text-muted-foreground"
                >
                  {toc.map((item, i) => (
                    <div key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                      <a href={"#" + item.id} data-toc-id={item.id} className="transition-colors hover:text-foreground">
                        {item.text}
                      </a>
                    </div>
                  ))}
                </nav>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Markdown content={post.content} />

          {/* 上一篇 / 下一篇（shadcn Item，只渲染存在的邻居） */}
          <Separator className="mt-10" />
          <nav aria-label="上一篇/下一篇" className="grid gap-3 sm:grid-cols-2">
            {prevPost && (
              <Item asChild variant="outline" className="hover:border-primary/40 transition-colors">
                <Link to={"/posts/" + prevPost.slug}>
                  <ItemContent>
                    <ItemDescription className="flex items-center gap-1">
                      <ArrowLeft data-icon="inline-start" /> 上一篇
                    </ItemDescription>
                    <ItemTitle className="line-clamp-1">{prevPost.title}</ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            )}
            {nextPost && (
              <Item asChild variant="outline" className="text-right hover:border-primary/40 transition-colors sm:col-start-2">
                <Link to={"/posts/" + nextPost.slug}>
                  <ItemContent className="items-end">
                    <ItemDescription className="flex items-center gap-1">
                      下一篇 <ArrowRight data-icon="inline-end" />
                    </ItemDescription>
                    <ItemTitle className="line-clamp-1">{nextPost.title}</ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            )}
          </nav>

          <Separator className="mt-6" />
          <footer className="pt-4 text-sm text-muted-foreground">
            <p className="mb-4">
              本文发布于 {formatDate(post.published)} · &copy; {currentYear} {siteConfig.author}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/posts">
                  <ArrowLeft data-icon="inline-start" />
                  返回文章列表
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <Home data-icon="inline-start" />
                  首页
                </Link>
              </Button>
            </div>
          </footer>

          <Giscus />
        </article>

        {/* 桌面端：右侧目录 */}
        {toc.length > 1 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">目录</p>
              <nav aria-label="文章目录" className="max-h-[calc(100vh-7rem)] overflow-y-auto space-y-0.5 border-l-2 border-border pl-3 text-sm leading-7 text-muted-foreground">
                {toc.map((item, i) => (
                  <div key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                    <a
                      href={"#" + item.id}
                      data-toc-id={item.id}
                      aria-current={activeHeading === item.id ? "location" : undefined}
                      className={cn(
                        "block transition-colors hover:text-foreground truncate",
                        activeHeading === item.id
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
