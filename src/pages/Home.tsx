import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "../lib/router";
import { ArrowRight, BookOpen, Mail } from "lucide-react";
import { publishedPosts, getAllTags } from "../lib/posts";
import { siteConfig } from "../config/site";
import { profileConfig } from "../config/profile";
import { resolveAssetUrl } from "../lib/base";
import { responsiveImageSrc } from "../lib/post-image";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";
import { PostMeta, SectionHeading, SectionLabel, TagList } from "../components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

function PostListItem({ post }: { post: typeof publishedPosts[0] }) {
  // 缩略图 96px(基础) / 112px(sm)，用 320px 宽的 -thumb 变体代替 1600px 原图，
  // 首页 8 张封面从 ~800KB 降到 ~64KB。
  // 容器固定 16:9：封面源图以 16:9 为主（少数 2:1 / 1:1），此前的 6:5 会把
  // 横版文字封面裁掉近四成（"tunnelbroker warp" 只剩半截）。
  const cover = responsiveImageSrc(post.image, [96, 112], "96px, (min-width: 640px) 112px");

  return (
    <div className="cv-auto">
      <Item variant="divided" size="loose">
        {cover && (
          <ItemMedia className="self-start">
            {/* 缩略图只是标题链接的视觉补充：从无障碍树与 Tab 顺序中移除，
                避免同一篇文章产生两个同名焦点目标 */}
            <Link
              to={"/posts/" + post.slug}
              tabIndex={-1}
              aria-hidden="true"
              className="block shrink-0 overflow-hidden bg-muted ring-1 ring-inset ring-border/60"
            >
              <img
                src={cover.src}
                srcSet={cover.srcSet}
                sizes={cover.sizes}
                alt=""
                className="aspect-video w-24 object-cover transition-transform duration-300 hover:scale-105 sm:w-28"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </ItemMedia>
        )}
        <ItemContent className="min-w-0 flex-1">
          <ItemTitle variant="lg">
            <Link
              to={"/posts/" + post.slug}
              className="text-foreground transition-colors duration-150 hover:text-primary"
            >
              {post.title}
            </Link>
          </ItemTitle>
          <ItemDescription className="mb-0.5">{post.description}</ItemDescription>
          <PostMeta post={post} className="mt-1" />
          <TagList tags={post.tags} className="mt-1.5" />
        </ItemContent>
      </Item>
    </div>
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

/** 侧栏分组：与文章页目录共用「小标签 + 细分隔线」的堆叠规则。 */
function AsideSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="py-5 first:pt-0 last:pb-0">
      <SectionLabel className="mb-3">{label}</SectionLabel>
      {children}
    </section>
  );
}

export default function Home() {
  const posts = publishedPosts.slice(0, 8);
  const allTags = getAllTags();
  // 一次遍历同时统计总字数、分类与标签数量（此前每个分类/标签都要重扫全部文章）
  const categoryCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  let totalWords = 0;
  for (const p of publishedPosts) {
    totalWords += p.words || 0;
    if (p.category) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    for (const t of p.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
  }
  const categories = Object.keys(categoryCounts);
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
      <section className="mb-10 md:mb-12">
        <div className="mb-6 flex items-start gap-5">
          <Avatar size="lg" className="size-14 shrink-0 md:size-16">
            <AvatarImage
              src={resolveAssetUrl(profileConfig.avatar)}
              alt={profileConfig.name}
              loading="eager"
              decoding="async"
            />
            <AvatarFallback>{profileConfig.name.slice(0, 1)}</AvatarFallback>
            <AvatarBadge variant="success" aria-hidden="true" />
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {profileConfig.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{profileConfig.bio}</p>
            {reducedMotion || !typingPlayed ? (
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {siteConfig.description}
              </p>
            ) : (
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                <TypingAnimation as="span" duration={28} delay={300}>
                  {siteConfig.description}
                </TypingAnimation>
              </p>
            )}
          </div>
        </div>
        {/* 按钮区：自然宽度换行，顺序 阅读文章→Telegram→X→GitHub→Bilibili，
            让短小的 X 挤进第 1 排，GitHub+Bilibili 成对落到第 2 排。
            按钮统一 size="lg" 等宽高，避免相邻按钮高度不一而"歪" */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 深色按钮 + 白字：浅色模式靠自身对比即可，
              深色模式由 ShimmerButton 用 dark:border-foreground/25 描边与背景分开 */}
          <ShimmerButton
            asChild
            size="lg"
            shimmerColor="hsl(0 0% 100% / 28%)"
            shimmerDuration="2.5s"
          >
            <Link to="/posts">
              <BookOpen data-icon="inline-start" />
              阅读文章
            </Link>
          </ShimmerButton>
          {profileConfig.links.map((link) => (
            <Button asChild key={link.name} variant="outline" size="lg">
              <a href={link.url} target="_blank" rel="noreferrer noopener">
                {link.icon === "mail" ? (
                  <Mail data-icon="inline-start" />
                ) : (
                  <Icon name={link.icon} size={16} data-icon="inline-start" />
                )}
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </section>

      {/* 双栏布局 */}
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* 左侧：文章列表 */}
        <div className="min-w-0 flex-1">
          <SectionHeading meta={`${publishedPosts.length} 篇`}>最新文章</SectionHeading>
          <ItemGroup ref={listRef}>
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
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/posts">
                  查看全部文章
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* 右侧：侧边栏（与文章页目录同一套「小标签 + 细分隔线」规则，不用卡片） */}
        <aside className="mt-10 shrink-0 md:mt-0 md:w-56">
          <div className="divide-y divide-border md:sticky md:top-20">
            <AsideSection label="关于">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {siteConfig.subtitle} · 分享技术、生活与热爱
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {publishedPosts.length} 篇文章 · 总计 {totalWords.toLocaleString("zh-CN")} 字
              </p>
            </AsideSection>

            {categories.length > 0 && (
              <AsideSection label="分类">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <Link key={cat} to={"/posts?cat=" + encodeURIComponent(cat)}>
                      <Badge variant="secondary" size="xs">
                        {cat} · {categoryCounts[cat] || 0}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </AsideSection>
            )}

            {allTags.length > 0 && (
              <AsideSection label="标签">
                <div className="flex flex-wrap items-center gap-1.5">
                  {allTags.map((t) => (
                    <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                      <Badge variant="secondary" size="xs">
                        {t} · {tagCounts[t] || 0}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </AsideSection>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
