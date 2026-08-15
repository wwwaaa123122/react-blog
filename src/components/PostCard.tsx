import { Link } from "react-router-dom";
import type { Post } from "../types";
import { formatDate } from "../lib/posts";
import { assetUrl } from "../lib/base";
import { siteConfig } from "../config/site";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;

  return (
    <div>
      {cover && (
        <div className="mb-5">
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
      <h3 className="text-3xl mb-3 leading-snug font-bold">
        <Link
          to={"/posts/" + post.slug}
          className="hover:underline text-foreground"
        >
          {post.title}
        </Link>
      </h3>
      <div className="text-lg mb-4 text-muted-foreground">
        <time>{formatDate(post.published)}</time>
      </div>
      <p className="text-lg leading-relaxed mb-4 text-muted-foreground">
        {post.description}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={siteConfig.site_url + "/favicon.svg"}
          className="size-11 rounded-full"
          alt={siteConfig.author}
        />
        <div className="text-lg font-bold">{siteConfig.author}</div>
      </div>
    </div>
  );
}
