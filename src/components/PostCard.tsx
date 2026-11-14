import { Link } from "../lib/router";
import type { Post } from "../types";
import { responsiveImageSrc } from "../lib/post-image";
import { PostMeta, TagList } from "../components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PostCard({ post }: { post: Post }) {
  // 网格断点：mobile 单列 ~360px、md 双列 ~484px、lg 三列 ~352px。
  // 用 -md(760px) / -thumb(320px) 变体替代 1600px 原图，
  // 单页 9 张卡片封面从 ~1.4MB 降到 ~250KB。
  const cover = responsiveImageSrc(
    post.image,
    [360, 484, 352],
    "360px, (min-width: 768px) 484px, (min-width: 1024px) 352px"
  );

  return (
    <Card size="flush" variant="interactive" className="group relative">
      {cover && (
        <CardContent className="relative overflow-hidden p-0">
          {/* 封面是标题链接的视觉重复：移出 Tab 顺序与无障碍树，
              避免读屏/键盘用户在同一张卡片上遇到两个指向相同文章的链接 */}
          <Link
            to={"/posts/" + post.slug}
            className="block bg-secondary"
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={cover.src}
              srcSet={cover.srcSet}
              sizes={cover.sizes}
              alt=""
              className="aspect-2/1 w-full object-cover ring-1 ring-inset ring-border transition-transform duration-300 group-hover:scale-105 dark:brightness-90"
              loading="lazy"
              decoding="async"
            />
          </Link>
          {post.category && (
            <div className="pointer-events-none absolute top-3 right-3">
              <Badge variant="overlay" size="2xs">{post.category}</Badge>
            </div>
          )}
        </CardContent>
      )}
      <CardContent className="flex flex-1 flex-col p-4">
        {/* 卡片标题用真实 h2（h1 文章页标题 → h2 卡片，不跳级）。
            18px 与首页列表标题（ItemTitle variant="lg"）保持同号。
            标题链接用 after 伪元素铺满整张卡片：除标签外，卡片任意处都能点进文章 */}
        <CardHeader className="p-0">
          <h2 className="font-heading text-lg leading-snug font-semibold">
            <Link
              to={"/posts/" + post.slug}
              className="text-foreground transition-colors duration-150 after:absolute after:inset-0 group-hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>
        </CardHeader>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <PostMeta post={post} className="mt-3" />
        {/* 标签浮在整卡链接之上，保证筛选仍可点 */}
        <div className="relative z-10 mt-auto pt-2.5">
          <TagList tags={post.tags} />
        </div>
      </CardContent>
    </Card>
  );
}
