import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Mail } from "lucide-react";
import { publishedPosts, getAllTags, formatDate, readingTime } from "../lib/posts";
import { siteConfig } from "../config/site";
import { profileConfig } from "../config/profile";
import { assetUrl } from "../lib/base";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

function PostListItem({ post }: { post: typeof publishedPosts[0] }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <Item className="border-b border-border last:border-0 rounded-none py-5">
      {cover && (
        <ItemMedia className="self-start">
          <Link to={"/posts/" + post.slug} className="shrink-0">
            <img
              src={cover}
              alt={post.title}
              className="w-24 h-20 sm:w-28 sm:h-22 rounded-lg object-cover bg-muted"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </ItemMedia>
      )}
      <ItemContent className="min-w-0 flex-1">
        <ItemTitle className="text-base sm:text-lg font-semibold leading-snug">
          <Link
            to={"/posts/" + post.slug}
            className="text-foreground hover:text-primary transition-colors duration-150"
          >
            {post.title}
          </Link>
        </ItemTitle>
        <ItemDescription className="leading-relaxed mb-2">
          {post.description}
        </ItemDescription>
        <ItemActions className="flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          {post.category && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3" />
              {post.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {readingTime(post.words)}
          </span>
        </ItemActions>
        {post.tags.length > 0 && (
          <ItemActions className="flex-wrap gap-1.5 mt-1.5">
            {post.tags.map((t) => (
              <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{t}</Badge>
              </Link>
            ))}
          </ItemActions>
        )}
      </ItemContent>
    </Item>
  );
}

// 轻量版 prefers-reduced-motion 监听（替代 motion 的 useReducedMotion，避免引入动画库）
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function Home() {
  const posts = publishedPosts.slice(0, 8);
  const allTags = getAllTags();
  const categories = [...new Set(publishedPosts.map(p => p.category).filter(Boolean))];
  const totalWords = publishedPosts.reduce((sum, p) => sum + (p.words || 0), 0);
  const reducedMotion = usePrefersReducedMotion();
  // 打字机动画每会话只播一次：老访客直接看到完整文字，不必等待逐字打完
  const [typingPlayed, setTypingPlayed] = useState(true);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hero-typed")) {
        setTypingPlayed(false);
      } else {
        sessionStorage.setItem("hero-typed", "1");
      }
    } catch {
      /* 隐私模式等场景：保持播放 */
    }
  }, []);

  // 文章列表"从下向上弹出"：隐藏类只在客户端渲染时加上（预渲染 HTML 不包含，
  // 爬虫/无 JS 场景保持可见），元素滚入视口后依次弹入
  const isClient = typeof window !== "undefined";
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const items = Array.from(root.children) as HTMLElement[];
    // 减弱动效用户：直接显示，不做滚动触发动画
    if (reducedMotion) {
      items.forEach((el) => el.classList.add("rise-in"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("rise-in")); // 兜底：直接显示
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rise-in");
            io.unobserve(entry.target);
          }
        }
      },
      // 底部提前 25% 视口高度触发：快划时动画在元素进入视野前就开播，不会"没跟上"
      { threshold: 0, rootMargin: "0px 0px 25% 0px" }
    );
    items.forEach((el) => io.observe(el));

    // 兜底：若极端快划导致漏触发，把已进入/划过视口的残留元素强制显示
    const fallback = window.setTimeout(() => {
      const vh = window.innerHeight;
      items.forEach((el) => {
        if (el.classList.contains("rise-in")) return;
        if (el.getBoundingClientRect().top < vh) el.classList.add("rise-in");
      });
    }, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [reducedMotion]);

  return (
    <>
      <Seo title={siteConfig.title + " - " + siteConfig.subtitle} description={siteConfig.description} path="/" keywords={siteConfig.keywords} ogImage={profileConfig.avatar} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }} />

      {/* Hero */}
      <section className="mb-10 md:mb-12 pt-4 md:pt-6">
        <div className="flex items-start gap-5 mb-6">
          <Avatar className="size-14 md:size-16 rounded-full ring-2 ring-border">
            <AvatarImage src={profileConfig.avatar} alt={profileConfig.name} />
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              {profileConfig.name}
            </h1>
            <p className="text-sm text-muted-foreground">{profileConfig.bio}</p>
            {reducedMotion || !typingPlayed ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground max-w-lg">
                {siteConfig.description}
              </p>
            ) : (
              <TypingAnimation
                as="p"
                duration={28}
                delay={300}
                className="mt-1.5 text-sm leading-relaxed text-muted-foreground max-w-lg"
              >
                {siteConfig.description}
              </TypingAnimation>
            )}
          </div>
        </div>
        {/* 按钮行：统一用 size="lg" 等宽高，避免与相邻按钮高度不一致而看起来"歪" */}
        <div className="flex flex-wrap items-center gap-2">
          <ShimmerButton
            asChild
            size="lg"
            className="px-5"
            background="#111827"
            shimmerColor="#ffffff"
            shimmerDuration="2.5s"
          >
            <Link to="/posts">
              <BookOpen data-icon="inline-start" />
              阅读文章
            </Link>
          </ShimmerButton>
          {profileConfig.links.map((link) => (
            <Button asChild key={link.name} variant="outline" size="lg" data-icon="inline-start">
              <a href={link.url} target="_blank" rel="noreferrer noopener">
                {link.icon === "mail" ? <Mail /> : <Icon name={link.icon} size={16} />}
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </section>

      {/* 双栏布局 */}
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* 左侧：文章列表 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            最新文章
            <span className="text-xs font-normal text-muted-foreground">({publishedPosts.length} 篇)</span>
          </h2>
          <ItemGroup ref={listRef} className="divide-y divide-border">
            {posts.map((post, i) => (
              <div
                key={post.slug}
                className={isClient ? "rise-item" : undefined}
                style={
                  isClient
                    ? { transitionDelay: `${Math.min(i * 50, 250)}ms` }
                    : undefined
                }
              >
                <PostListItem post={post} />
              </div>
            ))}
          </ItemGroup>
          {publishedPosts.length > 8 && (
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/posts" data-icon="inline-end">
                  查看全部文章 <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* 右侧：侧边栏 */}
        <aside className="md:w-56 shrink-0 mt-10 md:mt-0">
          <div className="md:sticky md:top-20 space-y-6">
            {/* About */}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">关于</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {siteConfig.subtitle} · 分享技术、生活与热爱
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {publishedPosts.length} 篇文章 · 总计 {totalWords.toLocaleString("zh-CN")} 字
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">分类</h3>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <Link key={cat} to={"/posts?cat=" + encodeURIComponent(cat)}>
                      <Badge variant="secondary" className="text-xs cursor-pointer transition-colors hover:bg-muted">{cat}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">标签</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => (
                    <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                      <Badge variant="outline" className="text-xs hover:bg-muted transition-colors cursor-pointer">{t}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">近期</h3>
              <ItemGroup className="gap-2">
                {publishedPosts.slice(0, 5).map((post) => (
                  <Item key={post.slug} size="xs" variant="muted" asChild>
                    <Link to={"/posts/" + post.slug}>
                      <ItemContent>
                        <ItemDescription className="line-clamp-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {post.title}
                        </ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
            </div>

            {/* GitHub */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">GitHub</h3>
              <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground" data-icon="inline-start">
                <a
                  href="https://github.com/wwwaaa123122"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon name="github" size={14} />
                  @wwwaaa123122
                </a>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
