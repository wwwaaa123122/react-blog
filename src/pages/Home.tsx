import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { publishedPosts, getAllTags, formatDate, readingTime } from "../lib/posts";
import { siteConfig } from "../config/site";
import { profileConfig } from "../config/profile";
import { assetUrl } from "../lib/base";
import { Mail } from "lucide-react";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
            <time>{formatDate(post.published)}</time>
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

export default function Home() {
  const posts = publishedPosts.slice(0, 8);
  const allTags = getAllTags();
  const categories = [...new Set(publishedPosts.map(p => p.category).filter(Boolean))];

  return (
    <>
      <Seo title={siteConfig.title} description={siteConfig.description} path="/" keywords={siteConfig.keywords} />
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
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
              {siteConfig.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild size="sm" className="h-8">
            <Link to="/posts">
              <BookOpen className="size-3.5" />
              阅读文章
            </Link>
          </Button>
          {profileConfig.links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                {link.icon === "mail" ? <Mail className="size-3.5" /> : <Icon name={link.icon} size={14} />}
                {link.name}
              </Button>
            </a>
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
          <div className="divide-y divide-border">
            {posts.map((post) => <PostListItem key={post.slug} post={post} />)}
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
