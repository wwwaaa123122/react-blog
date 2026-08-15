import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, Tag } from "lucide-react";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/posts";
import { assetUrl } from "../lib/base";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <Card className="mb-4 p-[22px] transition-shadow hover:shadow-lg">
      <div className="flex gap-[18px]">
        <div className="min-w-0 flex-1">
          <h3 className="text-[17.5px] font-bold leading-snug text-foreground">
            <Link
              to={"/posts/" + post.slug}
              className="transition-colors hover:text-primary [overflow-wrap:anywhere]"
            >
              {post.title}
            </Link>
          </h3>
          {post.description && (
            <p className="mt-[7px] line-clamp-2 text-[13.8px] leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3" />
              {formatDate(post.published)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3" />
              {readingTime(post.words)}
            </span>
            {post.category && (
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-3" />
                {post.category}
              </span>
            )}
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={"/posts?tag=" + encodeURIComponent(tag)}
                className="transition-opacity hover:opacity-80"
              >
                <Badge variant="secondary">{tag}</Badge>
              </Link>
            ))}
          </div>
        </div>
        {cover && (
          <img
            className="h-[100px] w-[150px] shrink-0 rounded-[9px] bg-muted object-cover"
            src={cover}
            alt=""
            loading="lazy"
          />
        )}
      </div>
    </Card>
  );
}
