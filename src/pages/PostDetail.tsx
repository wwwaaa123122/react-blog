import { Link, useParams } from "react-router-dom";
import { getPostBySlug, formatDate, readingTime } from "../lib/posts";
import Markdown, { slugify } from "../components/Markdown";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { articleJsonLd, jsonLd } from "../lib/seo";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";

function extractToc(content: string) {
  const toc: { level: number; text: string }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{2,4})\s+(.+)$/);
    if (m) {
      toc.push({ level: m[1].length, text: m[2].replace(/[#*`]/g, "").trim() });
    }
  }
  return toc;
}

export default function PostDetail() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">
          <Icon name="book" size={44} />
        </div>
        <p>文章不存在或已被删除</p>
        <div style={{ marginTop: 16 }}>
          <Link className="btn btn-primary" to="/posts">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  const toc = extractToc(post.content);
  const cover = post.image
    ? assetUrl(post.image.replace(/\.\.\/images\//, "/images/"))
    : undefined;
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Seo
        title={post.title}
        description={post.description || siteConfig.description}
        path={`/posts/${post.slug}`}
        keywords={post.tags}
      />
      <Breadcrumb
        items={[
          { label: "文章", to: "/posts" },
          { label: post.title },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }}
      />

      <article className="card post-detail">
      <header className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span className="meta-item">
            <Icon name="clock" size={14} />
            {formatDate(post.published)}
          </span>
          <span className="meta-item">
            <Icon name="book" size={14} />
            {readingTime(post.words)} · {post.words} 字
          </span>
          {post.category && (
            <span className="meta-item">
              <Icon name="tag" size={14} />
              {post.category}
            </span>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => (
              <Link key={t} to={`/posts?tag=${encodeURIComponent(t)}`} className="tag">
                {t}
              </Link>
            ))}
          </div>
        )}
      </header>

      {cover && (
        <img className="post-detail-cover" src={cover} alt={post.title} loading="lazy" />
      )}

      {toc.length > 1 && (
        <details style={{ marginBottom: 20 }}>
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            目录
          </summary>
          <ul
            style={{
              marginTop: 10,
              paddingLeft: 20,
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 2,
            }}
          >
            {toc.map((item, i) => (
              <li key={i} style={{ paddingLeft: (item.level - 2) * 14 }}>
                <a href={`#${slugify(item.text)}`} style={{ color: "inherit" }}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <Markdown content={post.content} />

      <footer
        style={{
          marginTop: 36,
          paddingTop: 20,
          borderTop: "1px solid var(--line-divider)",
          fontSize: 13.5,
          color: "var(--text-tertiary)",
        }}
      >
        <p>
          本文发布于 {formatDate(post.published)} · 转载需注明出处 · © {currentYear}{" "}
          星辰旅人
        </p>
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-ghost" to="/posts">
            ← 返回文章列表
          </Link>
          <Link className="btn btn-primary" to="/">
            首页
          </Link>
        </div>
      </footer>
      </article>
    </>
  );
}
