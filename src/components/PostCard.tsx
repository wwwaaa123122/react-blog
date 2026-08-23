import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/posts";
import { assetUrl } from "../lib/base";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <article className="group border border-border rounded-xl p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm bg-card">
      {cover && (
        <Link to={"/posts/" + post.slug} className="block mb-4 -mx-5 -mt-5 rounded-t-xl overflow-hidden" aria-label={post.title + " 封面"}>
          <img
            src={cover}
            alt={post.title}
            className="w-full aspect-[2/1] object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      )}
      <h3 className="text-base font-semibold leading-snug mb-2">
        <Link to={"/posts/" + post.slug} className="text-foreground hover:text-primary transition-colors duration-150">
          {post.title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
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
        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-border">
          {post.tags.map((t) => (
            <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{t}</Badge>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
