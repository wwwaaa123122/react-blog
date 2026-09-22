import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/posts";
import { assetUrl } from "../lib/base";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Item, ItemContent } from "@/components/ui/item";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <Card className="group gap-0 p-0 transition-all duration-200 hover:ring-primary/40 hover:shadow-sm">
      {cover && (
        <CardContent className="relative overflow-hidden rounded-t-xl p-0">
          <Link
            to={"/posts/" + post.slug}
            className="block bg-muted"
            aria-label={post.title + " 封面"}
          >
            <img
              src={cover}
              alt={post.title}
              className="w-full aspect-[2/1] object-cover transition-transform duration-200 group-hover:scale-[1.02]"
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
        <Item className="flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground p-0 mt-3 rounded-none">
          <ItemContent className="flex-row flex-wrap items-center gap-x-3 gap-y-1 flex-none">
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
          </ItemContent>
        </Item>
      </CardContent>
      {post.tags.length > 0 && (
        <CardFooter className="flex-wrap gap-1.5 px-5 pb-5 pt-0">
          {post.tags.map((t) => (
            <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{t}</Badge>
            </Link>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
