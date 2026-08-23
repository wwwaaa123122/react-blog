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
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { TypingAnimation } from "@/components/magicui/typing-animation";

function PostListItem({ post }: { post: typeof publishedPosts[0] }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <article className="group border-b border-border last:border-0 py-5">
      <div className="flex gap-4">
        {cover && (
          <Link to={"/posts/" + post.slug} className="shrink-0">
            <img
              src={cover}
              alt={post.title}
              className="w-24 h-20 sm:w-28 sm:h-22 rounded-lg object-cover bg-muted"
              loading="lazy"
              decoding="async"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold leading-snug mb-1.5">
            <Link
              to={"/posts/" + post.slug}
              className="text-foreground hover:text-primary transition-colors duration-150"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
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
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {post.tags.map((t) => (
                <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{t}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
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
  const reducedMotion = usePrefersReducedMotion();

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
      <Seo title={siteConfig.title + " - " + siteConfig.subtitle} description={siteConfig.description} path="/" keywords={siteConfig.keywords} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }} />

      {/* Hero */}
      <section className="mb-10 md:mb-12 pt-4 md:pt-6">
        <div className="flex items-start gap-5 mb-6">
          <img
            src={profileConfig.avatar}
            alt={profileConfig.name}
            className="size-14 md:size-16 rounded-full ring-2 ring-border"
          />
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              {profileConfig.name}
            </h1>
            <p className="text-sm text-muted-foreground">{profileConfig.bio}</p>
            {reducedMotion ? (
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
        <div className="flex flex-wrap items-center gap-2.5">
          <ShimmerButton
            asChild
            className="h-9 px-5 text-sm"
            background="#111827"
            shimmerColor="#ffffff"
            shimmerDuration="2.5s"
          >
            <Link to="/posts" className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              阅读文章
            </Link>
          </ShimmerButton>
          {profileConfig.links.map((link) => (
            <Button asChild key={link.name} variant="outline" size="sm" className="h-8 gap-1.5">
              <a href={link.url} target="_blank" rel="noreferrer noopener">
                {link.icon === "mail" ? <Mail className="size-3.5" /> : <Icon name={link.icon} size={14} />}
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
          <div ref={listRef} className="divide-y divide-border">
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
          </div>
          {publishedPosts.length > 8 && (
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/posts">
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
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">关于</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {siteConfig.subtitle} · 分享技术、生活与热爱
              </p>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">分类</h3>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
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
              <ul className="space-y-2">
                {publishedPosts.slice(0, 5).map((post) => (
                  <li key={post.slug}>
                    <Link
                      to={"/posts/" + post.slug}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* GitHub */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">GitHub</h3>
              <a
                href="https://github.com/wwwaaa123122"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="github" size={14} />
                @wwwaaa123122
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
