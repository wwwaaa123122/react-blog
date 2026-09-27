import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/posts";
import { responsiveImageSrc } from "../lib/post-image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function PostCard({ post }: { post: Post }) {  // 网格断点：mobile 单列 ~360px、md 双列 ~484px、lg 三列 ~352px。
  // 用 -md(760px) / -thumb(320px) 变体替代 1600px 原图，
  // 单页 9 张卡片封面从 ~1.4MB 降到 ~250KB。
  const cover = responsiveImageSrc(
    post.image,
    [360, 484, 352],
    "360px, (min-width: 768px) 484px, (min-width: 1024px) 352px"
  );

  return (
    <Card size="flush" variant="subtle" className="group">
      {cover && (
        <CardContent className="relative overflow-hidden p-0">
          <Link
            to={"/posts/" + post.slug}
            className="block bg-muted"
            aria-label={post.title + " 封面"}
          >
            <img
              src={cover.src}
              srcSet={cover.srcSet}
              sizes={cover.sizes}
              alt={post.title}
              className="w-full aspect-2/1 object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </CardContent>
      )}
      <CardContent className="p-5">
        {/* 卡片标题用真实 h2（h1 文章页标题 → h2 卡片，不跳级） */}
        <CardHeader className="p-0">
          {/* h2 直接承担卡片标题语义与排版（不在标题内再套 CardTitle 的 div） */}
          <h2 className="font-heading text-base font-semibold leading-snug">
            <Link
              to={"/posts/" + post.slug}
              className="text-foreground hover:text-primary transition-colors duration-150"
            >
              {post.title}
            </Link>
          </h2>
          <CardDescription className="text-sm leading-relaxed line-clamp-2 mt-2">
            {post.description}
          </CardDescription>
        </CardHeader>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex flex-none flex-row flex-wrap items-center gap-x-3 gap-y-1">
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
        </div>
      </CardContent>
      {post.tags.length > 0 && (
        <CardFooter className="flex-wrap gap-1.5 px-5 pb-5 pt-0">
          {post.tags.map((t) => (
            <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
              <Badge variant="secondary" size="2xs">{t}</Badge>
            </Link>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
