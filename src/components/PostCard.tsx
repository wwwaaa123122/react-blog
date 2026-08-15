import { Link } from "react-router-dom";
import type { Post } from "../types";
import { formatDate } from "../lib/posts";
import { assetUrl } from "../lib/base";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <div>
      {cover && (
        <div className="mb-4">
          <Link to={"/posts/" + post.slug}>
            <img
              src={cover}
              alt={post.title}
              className="w-full rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md"
              loading="lazy"
            />
          </Link>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 leading-snug">
        <Link to={"/posts/" + post.slug} className="hover:underline text-foreground">
          {post.title}
        </Link>
      </h3>
      <div className="text-sm text-muted-foreground mb-3">
        <time>{formatDate(post.published)}</time>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {post.description}
      </p>
    </div>
  );
}
