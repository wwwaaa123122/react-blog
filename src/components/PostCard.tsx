import { Link } from "react-router-dom";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/posts";
import { Icon } from "./icons";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.image
    ? post.image.replace(/\.\.\/images\//, "/images/")
    : undefined;

  return (
    <article className="card card-hover post-card">
      <div className="post-card-body">
        <h3 className="post-card-title">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.description && (
          <p className="post-card-desc">{post.description}</p>
        )}
        <div className="post-card-meta">
          <span className="meta-item">
            <Icon name="clock" size={13} />
            {formatDate(post.published)}
          </span>
          <span className="meta-item">
            <Icon name="book" size={13} />
            {readingTime(post.words)}
          </span>
          {post.category && (
            <span className="meta-item">
              <Icon name="tag" size={13} />
              {post.category}
            </span>
          )}
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag} to={`/posts?tag=${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </div>
      {cover && <img className="post-card-cover" src={cover} alt="" loading="lazy" />}
    </article>
  );
}
