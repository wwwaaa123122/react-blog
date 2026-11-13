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
    <Card size="flush" variant="interactive" className="group">
      {cover && (
        <CardContent className="relative overflow-hidden p-0">
          {/* 封面是标题链接的视觉重复：移出 Tab 顺序与无障碍树，
              避免读屏/键盘用户在同一张卡片上遇到两个指向相同文章的链接 */}
          <Link
            to={"/posts/" + post.slug}
            className="block bg-muted"
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={cover.src}
              srcSet={cover.srcSet}
              sizes={cover.sizes}
              alt=""
              className="aspect-2/1 w-full object-cover ring-1 ring-inset ring-border/60 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Link>
          {post.category && (
            <div className="pointer-events-none absolute top-3 right-3">
              <Badge variant="secondary" size="2xs">{post.category}</Badge>
            </div>
          )}
        </CardContent>
      )}
      <CardContent className="p-4">
        {/* 卡片标题用真实 h2（h1 文章页标题 → h2 卡片，不跳级）。
            18px 与首页列表标题（ItemTitle variant="lg"）保持同号。 */}
        <CardHeader className="p-0">
          <h2 className="font-heading text-lg leading-snug font-semibold">
            <Link
              to={"/posts/" + post.slug}
              className="text-foreground transition-colors duration-150 group-hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>
        </CardHeader>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <PostMeta post={post} className="mt-3" />
        <TagList tags={post.tags} className="mt-2.5" />
      </CardContent>
    </Card>
  );
}
