import { Link } from "react-router-dom";
import { publishedPosts, formatDate } from "../lib/posts";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";

export default function Archive() {
  const byYear = new Map<string, typeof publishedPosts>();
  for (const post of publishedPosts) {
    const year = post.published.slice(0, 4) || "未知";
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }
  const years = Array.from(byYear.entries()).sort((a, b) =>
    a[0] < b[0] ? 1 : -1
  );

  return (
    <>
      <Seo title="归档" description="全部文章按年份归档" path="/archive" />
      <Breadcrumb items={[{ label: "归档", to: "/archive" }]} />

      <div className="page-header">
        <h1>归档</h1>
        <p>共 {publishedPosts.length} 篇文章 · 按年份归档</p>
      </div>

      <div className="card" style={{ padding: "22px 28px" }}>
        {years.map(([year, posts]) => (
          <section key={year}>
            <h2 className="archive-year">
              {year}
              <span className="count">{posts.length} 篇</span>
            </h2>
            <ul className="archive-list">
              {posts.map((post) => (
                <li className="archive-item" key={post.slug}>
                  <span className="archive-date">{formatDate(post.published)}</span>
                  <Link className="archive-link" to={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
