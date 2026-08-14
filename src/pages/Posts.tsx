import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";

const PAGE_SIZE = 6;

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const tags = getAllTags();

  const filtered = useMemo(() => {
    let list = publishedPosts;
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [tag, keyword]);

  useEffect(() => {
    setPage(1);
  }, [tag, keyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pagePosts = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTag = (t: string) => {
    if (t === tag) {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", t);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <Seo
        title="文章"
        description={`${publishedPosts.length} 篇技术文章，涵盖服务器部署、内网穿透、Cloudflare、容器化等主题`}
        path="/posts"
      />
      <Breadcrumb items={[{ label: "文章", to: "/posts" }]} />

      <div className="page-header">
        <h1>文章</h1>
        <p>共 {publishedPosts.length} 篇文章 · 分享技术、生活与热爱</p>
      </div>

      <div className="search-box">
        <span className="search-icon">
          <Icon name="search" size={18} />
        </span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索文章标题、描述或内容…"
        />
        {keyword && (
          <button className="search-clear icon-btn" onClick={() => setKeyword("")} aria-label="清除搜索">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
            </svg>
          </button>
        )}
      </div>

      <div className="tag-filter-row">
        <button
          className={`tag ${tag === "" ? "active" : ""}`}
          onClick={() => selectTag("")}
        >
          全部
        </button>
        {tags.map((t) => (
          <button
            key={t}
            className={`tag ${tag === t ? "active" : ""}`}
            onClick={() => selectTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {pagePosts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <Icon name="search" size={44} />
          </div>
          <p>没有找到相关文章，换个关键词试试吧</p>
        </div>
      ) : (
        pagePosts.map((post) => <PostCard key={post.slug} post={post} />)
      )}

      {totalPages > 1 && (
        <nav className="pagination">
          <button
            className="page-btn"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`page-btn ${n === current ? "active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={current === totalPages}
            onClick={() => setPage(current + 1)}
          >
            ›
          </button>
        </nav>
      )}
    </>
  );
}
