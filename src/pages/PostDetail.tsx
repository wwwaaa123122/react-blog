import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, FileText, Home, ListTree, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getPostBySlug, formatDate, readingTime, publishedPosts } from "../lib/posts";
import Markdown, { createSlugger } from "../components/Markdown";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { resolveAssetUrl } from "../lib/base";
import { copyToClipboard } from "../lib/clipboard";
import { normalizeCover, variantUrl } from "../lib/post-image";
import coverSizes from "../data/cover-sizes.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn, prefersReducedMotion } from "@/lib/utils";
import Giscus from "../components/Giscus";
import ReadingProgress from "../components/ReadingProgress";

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

// 目录滚动高亮（scroll-spy）：视口上方最近的一个标题即"当前章节"。
// 用 IntersectionObserver 而非 scroll 监听：浏览器在合成线程判断相交，
// 不用每帧对每个标题做 getBoundingClientRect（长文最多 28 个标题）。
function useActiveHeading(toc: { level: number; text: string; id: string }[]): string {
  const [active, setActive] = useState("");
  const OFFSET = 140; // 导航栏高度 + 阅读余量

  useEffect(() => {
    setActive("");
    if (toc.length === 0 || !("IntersectionObserver" in window)) return;

    const items = toc
      .map((t) => ({ id: t.id, el: document.getElementById(t.id) }))
      .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);
    if (items.length === 0) return;

    // 缓存每个标题在文档中的纵向位置：滚动时只做数值比较，
    // 不必每帧对几十个标题逐个 getBoundingClientRect（会强制同步布局）。
    // 图片/字体/评论加载改变布局时，由 ResizeObserver 与 fonts.ready 重新测量。
    let tops: number[] = [];
    const measure = () => {
      const scrollY = window.scrollY;
      tops = items.map(({ el }) => el.getBoundingClientRect().top + scrollY);
    };
    const update = () => {
      const line = window.scrollY + OFFSET;
      let idx = -1;
      for (let i = tops.length - 1; i >= 0; i--) {
        if (tops[i] <= line) { idx = i; break; }
      }
      setActive(idx >= 0 ? items[idx].id : "");
    };

    measure();
    // 初次定位（含深链 #anchor 场景）
    update();

    const io = new IntersectionObserver(
      () => { measure(); update(); },
      { rootMargin: `-${OFFSET}px 0px 0px 0px`, threshold: [0, 1] }
    );
    for (const { el } of items) io.observe(el);

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; update(); });
    };
    const onResize = () => { measure(); update(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(onResize)
      : undefined;
    ro?.observe(document.body);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      io.disconnect();
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
  const articleRef = useRef<HTMLElement>(null);
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
        <div className="py-20">
          <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <h1 className="text-3xl font-bold tracking-tight">文章不存在或已被删除</h1>
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
        </div>
      </>
    );
  }

  const cover = post.image
    ? resolveAssetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;
  // 本地封面在构建期记录了宽高：写进 img 属性，图片下载前就按比例预留空间，
  // 避免慢网下封面加载完成时把正文整体往下推（CLS）。
  const coverKey = post.image && !/^https?:\/\//i.test(post.image)
    ? normalizeCover(post.image)
    : undefined;
  const coverSize = coverKey
    ? (coverSizes as Record<string, { w: number; h: number }>)[coverKey]
    : undefined;
  // 详情页封面在移动端只有 ~350px 宽，没必要加载 1600px 原图：
  // 给浏览器一份 760px 变体 + 原图，由 sizes/srcset 自行选择（桌面 2x 仍用原图）。
  const coverMd = post.image ? variantUrl(post.image, "-md") : undefined;
  const coverSrcSet = cover && coverSize && coverKey && coverMd && coverMd !== coverKey
    ? `${resolveAssetUrl(coverMd)} 760w, ${cover} ${coverSize.w}w`
    : undefined;
  const currentYear = new Date().getFullYear();

  // 上一篇 = 更新的文章（后发），下一篇 = 更早的文章（先发）；列表按发布时间倒序
  const currentIdx = publishedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? publishedPosts[currentIdx - 1] : null;
  const nextPost = currentIdx < publishedPosts.length - 1 ? publishedPosts[currentIdx + 1] : null;

  // 相关文章：按共享标签数排序，同分类加分，取前 3 篇（不含当前文章）
  const relatedPosts = publishedPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score:
        p.tags.filter((t) => post.tags.includes(t)).length * 2 +
        (p.category === post.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.post.published.localeCompare(a.post.published))
    .slice(0, 3)
    .map((x) => x.post);

  return (
    <>
      <Seo title={post.title} description={post.description || siteConfig.description}
        path={"/posts/" + post.slug + "/"} keywords={post.tags} ogType="article" ogImage={post.image}
        articlePublished={post.published} articleModified={post.updated}
        articleSection={post.category} articleTags={post.tags} />
      <Breadcrumb items={[{ label: "文章", to: "/posts/" }, { label: post.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />

      {/* 阅读进度条：随滚动推进，scaleX 走合成器不触发回流 */}
      {/* key：客户端在文章之间跳转时组件不卸载，必须重挂载以重新测量新正文 */}
      <ReadingProgress key={post.slug} target={articleRef} />

      {/* 双栏布局：文章 + 右侧目录 */}
      <div className="flex gap-8 lg:gap-12 relative">
        {/* 文章主体 */}
        <article ref={articleRef} className="min-w-0 flex-1 max-w-180 mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-2 text-muted-foreground">
            <Badge variant="secondary">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </Badge>
            {post.updated && post.updated !== post.published && (
              <Badge variant="secondary">
                <RefreshCw data-icon="inline-start" />
                <time dateTime={post.updated}>更新于 {formatDate(post.updated)}</time>
              </Badge>
            )}
            <Badge variant="secondary">
              <Clock data-icon="inline-start" />
              {readingTime(post.words)}
            </Badge>
            {post.words > 0 && (
              <Badge variant="secondary">
                <FileText data-icon="inline-start" />
                {post.words.toLocaleString("zh-CN")} 字
              </Badge>
            )}
            {post.category && (
              <Badge variant="secondary">
                <BookOpen data-icon="inline-start" />
                {post.category}
              </Badge>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((t) => (
                <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                  <Badge variant="secondary" size="xs">{t}</Badge>
                </Link>
              ))}
            </div>
          )}

          {cover && (
            <div className="mb-8 -mx-5 md:mx-0">
              {/* 首屏封面：急切加载并提高优先级（LCP 元素），避免 lazy 延迟 */}
              <img
                className="w-full h-auto rounded-xl shadow-sm bg-muted"
                src={cover}
                srcSet={coverSrcSet}
                sizes="(min-width: 768px) 720px, 100vw"
                alt={post.title}
                width={coverSize?.w}
                height={coverSize?.h}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          )}

          {/* 移动端：折叠目录（shadcn Collapsible） */}
          {toc.length > 1 && (
            <Collapsible className="mb-6 lg:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="muted" size="sm">
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
              <Item asChild variant="outline-accent">
                <Link to={"/posts/" + prevPost.slug}>
                  <ItemContent>
                    <ItemDescription>
                      <span className="flex items-center gap-1">
                        <ArrowLeft data-icon="inline-start" /> 上一篇
                      </span>
                    </ItemDescription>
                    <ItemTitle>{prevPost.title}</ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            )}
            {nextPost && (
              <Item asChild variant="outline-accent" className="text-right sm:col-start-2">
                <Link to={"/posts/" + nextPost.slug}>
                  <ItemContent className="items-end">
                    <ItemDescription>
                      <span className="flex items-center gap-1">
                        下一篇 <ArrowRight data-icon="inline-end" />
                      </span>
                    </ItemDescription>
                    <ItemTitle>{nextPost.title}</ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            )}
          </nav>

          {/* 相关文章：按共享标签/分类推荐（无相关内容则不渲染） */}
          {relatedPosts.length > 0 && (
            <section aria-labelledby="related-posts-heading" className="mt-10">
              <h2
                id="related-posts-heading"
                className="mb-3 text-sm font-semibold text-muted-foreground"
              >
                相关文章
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Item key={rp.slug} asChild variant="outline" size="sm">
                    <Link to={"/posts/" + rp.slug}>
                      <ItemContent>
                        <ItemTitle>
                          {rp.title}
                        </ItemTitle>
                        <ItemDescription>
                          <time dateTime={rp.published}>{formatDate(rp.published)}</time>
                        </ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </div>
            </section>
          )}

          <Separator className="mt-6" />

          {/* 版权信息卡片 */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
              <span className="font-semibold text-foreground text-sm">{post.title}</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={async () => {
                  if (await copyToClipboard(window.location.href)) {
                    toast.success("文章链接已复制到剪贴板");
                  } else {
                    toast.error("复制失败，请手动复制地址栏链接");
                  }
                }}
              >
                <Share2 data-icon="inline-start" />
                分享 / 复制链接
              </Button>
            </div>
            <div className="mt-2.5 space-y-1">
              <p>
                <span className="font-medium text-foreground">本文作者：</span>
                {siteConfig.author}
              </p>
              <p>
                <span className="font-medium text-foreground">本文链接：</span>
                <span className="break-all">{siteConfig.site_url}/posts/{post.slug}/</span>
              </p>
              <p>
                <span className="font-medium text-foreground">版权声明：</span>
                自由转载-非商用-保持署名（
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary hover:underline"
                >
                  CC BY-NC-SA 4.0
                </a>
                ）。
              </p>
            </div>
          </div>

          <footer className="pt-6 text-sm text-muted-foreground">
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

          {/* key：文章间跳转时重新注入 giscus，否则 iframe 仍显示上一篇的评论区 */}
          <Giscus key={post.slug} />
        </article>

        {/* 桌面端：右侧目录 */}
        {toc.length > 1 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">目录</p>
              <nav aria-label="文章目录" className="max-h-120 overflow-y-auto space-y-0.5 border-l-2 border-border pl-3 text-sm leading-7 text-muted-foreground">
                {toc.map((item, i) => (
                  <div key={i} style={{ paddingLeft: (item.level - 2) * 12 }}>
                    <a
                      href={"#" + item.id}
                      data-toc-id={item.id}
                      aria-current={activeHeading === item.id ? "location" : undefined}
                      className={cn(
                        "block transition-all duration-150 hover:text-foreground truncate rounded-sm py-0.5",
                        activeHeading === item.id
                          ? "text-primary font-medium pl-1.5 -ml-1.5 border-l-2 border-primary bg-primary-soft/30"
                          : "hover:translate-x-0.5"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                          el.scrollIntoView({
                            behavior: prefersReducedMotion() ? "auto" : "smooth",
                          });
                          window.history.replaceState(null, "", "#" + item.id);
                        }
                      }}
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
